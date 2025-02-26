"use client";
import React, { useState } from "react";
import { Button, Typography, Stack } from "@mui/material";
import { useDropzone } from "react-dropzone";
import * as pdfjs from "pdfjs-dist/build/pdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

// Fix PDF.js worker issue
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfToDocxConverter() {
  const [file, setFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: "application/pdf" });

  const extractTextFromPDF = async (pdf) => {
    const doc = new Document();
    const totalPages = pdf.numPages;

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      doc.addSection({
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `Page ${i}\n`,
                bold: true,
                size: 24,
              }),
            ],
          }),
          ...textContent.items.map((item) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: item.str,
                  size: 22,
                }),
              ],
            })
          ),
        ],
      });
    }

    return doc;
  };

  const convertPDFToDocx = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = async () => {
      const pdfData = new Uint8Array(fileReader.result);
      const pdf = await pdfjs.getDocument({ data: pdfData }).promise;

      const docxDocument = await extractTextFromPDF(pdf);

      Packer.toBlob(docxDocument).then((blob) => {
        saveAs(blob, file.name.replace(".pdf", ".docx"));
      });
    };
  };

  return (
    <Stack spacing={3} alignItems="center" sx={{ p: 3, maxWidth: "md", margin: "auto" }}>
      <div {...getRootProps({ style: { border: "2px dashed #ccc", padding: 20, textAlign: "center", width: "100%" } })}>
        <input {...getInputProps()} />
        <Typography>Drag & drop a PDF file here, or click to select</Typography>
      </div>
      {file && <Typography variant="subtitle1">Selected File: {file.name}</Typography>}

      <Button variant="contained" color="primary" onClick={convertPDFToDocx} disabled={!file}>
        Convert to DOCX
      </Button>
    </Stack>
  );
}
