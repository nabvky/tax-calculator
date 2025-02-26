"use client";
import { useState } from "react";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [splitPages, setSplitPages] = useState("");
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
    setSplitPages("");
    setError("");
  };

  const handleSplit = async () => {
    if (!file || !splitPages) {
      setError("Please upload a file and enter page numbers.");
      return;
    }

    const splitPoints = splitPages.split(",").map((num) => parseInt(num.trim(), 10));
    if (splitPoints.some(isNaN)) {
      setError("Invalid input. Enter comma-separated page numbers.");
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = async () => {
      const pdfBytes = fileReader.result;
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const zip = new JSZip();
      let lastPage = 0;
      const fileName = file.name.replace(".pdf", "");

      for (let i = 0; i < splitPoints.length; i++) {
        const newPdf = await PDFDocument.create();
        for (let j = lastPage; j < splitPoints[i]; j++) {
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [j]);
          newPdf.addPage(copiedPage);
        }
        lastPage = splitPoints[i];

        const newPdfBytes = await newPdf.save();
        zip.file(`${fileName}_Part${i + 1}.pdf`, newPdfBytes);
      }

      const finalPdf = await PDFDocument.create();
      for (let j = lastPage; j < pdfDoc.getPageCount(); j++) {
        const [copiedPage] = await finalPdf.copyPages(pdfDoc, [j]);
        finalPdf.addPage(copiedPage);
      }
      const finalPdfBytes = await finalPdf.save();
      zip.file(`${fileName}_Part${splitPoints.length + 1}.pdf`, finalPdfBytes);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = `${fileName}_Split.zip`;
      a.click();

      new Audio("/ding.mp3").play();
      alert("Splitting completed! Files downloaded as ZIP.");
    };
  };

  return (
    <Box className="split-pdf-container" sx={{ width: "100%", padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Split PDF
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
        label="Enter page numbers to split (e.g. 2, 5, 7)"
        value={splitPages}
        onChange={(e) => setSplitPages(e.target.value)}
        error={!!error}
        helperText={error || "Enter comma-separated page numbers."}
        sx={{ marginBottom: 2 }}
      />

      <Button variant="contained" color="primary" onClick={handleSplit} disabled={!file}>
        Split & Download ZIP
      </Button>
    </Box>
  );
}
