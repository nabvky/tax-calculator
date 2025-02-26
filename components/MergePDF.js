"use client";
import { useState, useRef, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { PDFDocument } from "pdf-lib";

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [outputName, setOutputName] = useState("");
  const [history, setHistory] = useState([]);
  const [openToast, setOpenToast] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("pdfMergeHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
    multiple: true,
    maxSize: 30 * 1024 * 1024,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        alert("Some files were rejected. Ensure they are PDFs and under 30MB.");
      }
      setFiles([...files, ...acceptedFiles]);
    },
  });

  const handleDelete = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedFiles = [...files];
    const [movedFile] = reorderedFiles.splice(result.source.index, 1);
    reorderedFiles.splice(result.destination.index, 0, movedFile);
    setFiles(reorderedFiles);
  };

  const mergePDFs = async () => {
    if (files.length === 0) {
      alert("Please upload at least two PDFs.");
      return;
    }

    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      await new Promise((resolve) => {
        reader.onload = async () => {
          const pdfBytes = new Uint8Array(reader.result);
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
          resolve();
        };
      });
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

    const filename = outputName.trim() ? `${outputName}.pdf` : `Merged_${Date.now()}.pdf`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    setOpenToast(true);

    const newHistory = [{ name: filename, timestamp: new Date().toLocaleString() }, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("pdfMergeHistory", JSON.stringify(newHistory));
  };

  return (
    <Paper sx={{ p: 3, maxWidth: "xl", margin: "auto", width: "100%" }}>
      <Typography variant="h5" align="center" sx={{ mb: 2 }}>
        Merge PDFs
      </Typography>

      <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: "20px", textAlign: "center", cursor: "pointer", marginBottom: "20px" }}>
        <input {...getInputProps()} />
        <Typography>Drag & Drop PDFs here or Click to Upload</Typography>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="files">
          {(provided) => (
            <TableContainer component={Paper} ref={provided.innerRef} {...provided.droppableProps}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>File Name</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files.map((file, index) => (
                    <Draggable key={file.name} draggableId={file.name} index={index}>
                      {(provided) => (
                        <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{file.name}</TableCell>
                          <TableCell>{(file.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                          <TableCell>
                            <Button color="error" onClick={() => handleDelete(index)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Droppable>
      </DragDropContext>

      <TextField fullWidth label="Output File Name (Optional)" variant="outlined" value={outputName} onChange={(e) => setOutputName(e.target.value)} sx={{ mt: 2 }} />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={mergePDFs}>
        Merge PDFs
      </Button>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Recent Mergers
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>File Name</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={openToast} autoHideDuration={3000} onClose={() => setOpenToast(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity="success" onClose={() => setOpenToast(false)}>
          PDF Merged Successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
}
