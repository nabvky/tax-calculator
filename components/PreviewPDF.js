"use client";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Typography, Box } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.js';
// pdfjs.GlobalWorkerOptions.workerSrc = "../public/pdf.min.js ";

const PreviewPDF = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      if (selectedFile.size <= 30 * 1024 * 1024) {
        setFile(URL.createObjectURL(selectedFile));
      } else {
        alert("File size exceeds 30MB limit.");
      }
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const removeFile = () => {
    setFile(null);
    setNumPages(null);
    setPageNumber(1);
    setScale(1);
  };

  return (
    <Box sx={{ textAlign: "center", p: 3 }}>
      {!file ? (
        <Button variant="contained" component="label" startIcon={<UploadFileIcon />}>
          Upload PDF
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            Page {pageNumber} of {numPages}
          </Typography>
          <Document file={file} onLoadSuccess={handleDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} scale={scale} />
          </Document>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              disabled={pageNumber === 1}
              startIcon={<NavigateBeforeIcon />}
            >
              Prev
            </Button>
            <Button
              variant="contained"
              onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
              disabled={pageNumber === numPages}
              endIcon={<NavigateNextIcon />}
            >
              Next
            </Button>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => setScale((prev) => Math.min(prev + 0.2, 2))}
              startIcon={<ZoomInIcon />}
            >
              Zoom In
            </Button>
            <Button
              variant="contained"
              onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.5))}
              startIcon={<ZoomOutIcon />}
            >
              Zoom Out
            </Button>
          </Box>
          <Button
            variant="contained"
            color="error"
            onClick={removeFile}
            sx={{ mt: 3 }}
            startIcon={<RemoveCircleIcon />}
          >
            Remove File
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PreviewPDF;
