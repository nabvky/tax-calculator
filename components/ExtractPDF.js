"use client";
import { useState } from "react";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";

export default function ExtractPDF() {
  const [file, setFile] = useState(null);
  const [pageRange, setPageRange] = useState("");
  const [error, setError] = useState("");

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      setError("Only one file can be uploaded at a time.");
      return;
    }

    const uploadedFile = acceptedFiles[0];

    if (uploadedFile.size > 30 * 1024 * 1024) {
      setError("File size exceeds 30MB.");
      return;
    }

    if (uploadedFile.type !== "application/pdf") {
      setError("Invalid file type. Only PDFs are allowed.");
      return;
    }

    setFile(uploadedFile);
    setError("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "application/pdf",
    multiple: false,
  });

  const handleRemoveFile = () => {
    setFile(null);
    setPageRange("");
    setError("");
  };

  const handleExtract = async () => {
    if (!file || !pageRange) {
      setError("Please upload a file and enter the page range.");
      return;
    }

    const rangePattern = /^(\d+(-\d+)?,\s?)*(\d+(-\d+)?)$/;
    if (!rangePattern.test(pageRange)) {
      setError("Invalid format. Use comma-separated numbers or ranges (e.g., 2-5, 8, 10-12).");
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = async () => {
      const pdfBytes = fileReader.result;
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const newPdf = await PDFDocument.create();
      const totalPages = pdfDoc.getPageCount();

      const pagesToExtract = [];
      pageRange.split(",").forEach((part) => {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map((num) => parseInt(num.trim(), 10));
          if (start >= 1 && end <= totalPages) {
            for (let i = start; i <= end; i++) pagesToExtract.push(i - 1);
          }
        } else {
          const pageNum = parseInt(part.trim(), 10);
          if (pageNum >= 1 && pageNum <= totalPages) pagesToExtract.push(pageNum - 1);
        }
      });

      if (pagesToExtract.length === 0) {
        setError("No valid pages to extract.");
        return;
      }

      for (let page of pagesToExtract) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [page]);
        newPdf.addPage(copiedPage);
      }

      const newPdfBytes = await newPdf.save();
      const newBlob = new Blob([newPdfBytes], { type: "application/pdf" });
      const newUrl = URL.createObjectURL(newBlob);
      const a = document.createElement("a");
      a.href = newUrl;
      a.download = file.name.replace(".pdf", "_Extracted.pdf");
      a.click();

      new Audio("/ding.mp3").play();
      alert("Extraction successful! File downloaded.");
    };
  };

  return (
    <Box className="extract-pdf-container" sx={{ width: "100%", padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Extract Pages from PDF
      </Typography>

      <Paper
        {...getRootProps()}
        sx={{
          padding: 4,
          border: "2px dashed #aaa",
          backgroundColor: "#f9f9f9",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 2,
        }}
      >
        <input {...getInputProps()} />
        <Typography>Drag & drop a PDF here, or click to select one</Typography>
      </Paper>

      {file && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
          <Typography>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</Typography>
          <Button variant="outlined" color="error" onClick={handleRemoveFile}>
            Remove
          </Button>
        </Box>
      )}

      <TextField
        fullWidth
        label="Enter page range (e.g., 2-5, 8, 10-12)"
        value={pageRange}
        onChange={(e) => setPageRange(e.target.value)}
        error={!!error}
        helperText={error || "Specify pages as comma-separated numbers or ranges."}
        sx={{ marginBottom: 2 }}
      />

      <Button variant="contained" color="primary" onClick={handleExtract} disabled={!file}>
        Extract & Download
      </Button>
    </Box>
  );
}
