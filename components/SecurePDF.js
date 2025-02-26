"use client";
import React, { useState } from "react";
import { Button, TextField, Typography, Stack } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";

export default function SecurePDF() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (selectedFile.size > 30 * 1024 * 1024) {
      setError("File size should not exceed 30MB.");
      return;
    }
    setFile(selectedFile);
    setError("");
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: "application/pdf" });

  const secureFile = async () => {
    if (!file || !password) {
      setError("Please upload a file and enter a password.");
      return;
    }

    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.encrypt({ userPassword: password, ownerPassword: password, permissions: [] });
      
      const securedPdfBytes = await pdfDoc.save();
      const blob = new Blob([securedPdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Secured_${file.name}`;
      link.click();
      
      new Audio("/ding.mp3").play();
    } catch (err) {
      setError("Error securing the PDF. Try again.");
    }
  };

  return (
    <Stack spacing={3} alignItems="center" sx={{ p: 3, maxWidth: "md", margin: "auto" }}>
      <Typography variant="h5">Secure PDF</Typography>
      <div {...getRootProps()} style={{ border: "2px dashed #aaa", padding: "20px", textAlign: "center", cursor: "pointer", width: "100%" }}>
        <input {...getInputProps()} />
        <p>{file ? file.name : "Drag & drop a PDF file here, or click to select"}</p>
      </div>
      <TextField label="Set Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={secureFile}>Secure & Download</Button>
    </Stack>
  );
}
