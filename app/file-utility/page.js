"use client";
import React from "react";
import { Grid, Card, CardActionArea, CardContent, Typography, Link } from "@mui/material";
import { useRouter } from "next/navigation";
// import MergePDF from "@/components/MergePDF";
// import MergePDF from "../components/MergePDF";
import { PictureAsPdf, Layers, ContentCut, ContentCopy, TextSnippet, Visibility, FileDownload, Compress, Image, Rotate90DegreesCcw, Lock, VpnKey, Edit, Description, TableChart, Slideshow, ImageSearch, DriveFileRenameOutline } from "@mui/icons-material";
import MergePDFPage from "./merge-pdf/page";
import SplitPDFPage from "./split-pdf/page";
import ExtractPDFPage from "./extract-pdf/page";
import PreviewPDFPage from "./preview-pdf/page";
import PDFToDocxConvertorPage from "./pdf-to-docx/page";

const utilities = [
  { title: "Merge PDFs", icon: <Layers fontSize="large" />, path: "/file-utility/merge-pdf", component: MergePDFPage },
  { title: "Split PDF", icon: <ContentCut fontSize="large" />, path: "/file-utility/split-pdf", component: SplitPDFPage },
  { title: "Extract PDF", icon: <ContentCopy fontSize="large" />, path: "/file-utility/extract-pdf", component: ExtractPDFPage },
  { title: "Extract Text", icon: <TextSnippet fontSize="large" />, path: "/extract-text" },
  { title: "Preview PDF", icon: <Visibility fontSize="large" />, path: "/file-utility/preview-pdf", component: PreviewPDFPage },
  { title: "Download Processed PDF", icon: <FileDownload fontSize="large" />, path: "/download-pdf" },
  { title: "Compress PDF", icon: <Compress fontSize="large" />, path: "/compress-pdf" },
  { title: "Convert PDF to Images", icon: <Image fontSize="large" />, path: "/pdf-to-images" },
  { title: "Convert Images to PDF", icon: <PictureAsPdf fontSize="large" />, path: "/images-to-pdf" },
  { title: "Rotate PDF Pages", icon: <Rotate90DegreesCcw fontSize="large" />, path: "/rotate-pdf" },
  { title: "Secure PDF", icon: <Lock fontSize="large" />, path: "/file-utility/secure-pdf", component: PreviewPDFPage },
  { title: "Remove Password", icon: <VpnKey fontSize="large" />, path: "/remove-password" },
  { title: "Sign PDF", icon: <Edit fontSize="large" />, path: "/sign-pdf" },
  { title: "Convert PDF to Word", icon: <Description fontSize="large" />, path: "/file-utility/pdf-to-docx", component: PDFToDocxConvertorPage },
  { title: "Convert PDF to Excel", icon: <TableChart fontSize="large" />, path: "/pdf-to-excel" },
  { title: "Convert PDF to PowerPoint", icon: <Slideshow fontSize="large" />, path: "/pdf-to-ppt" },
  { title: "Extract Images from PDF", icon: <ImageSearch fontSize="large" />, path: "/extract-images" },
  { title: "Batch Rename PDFs", icon: <DriveFileRenameOutline fontSize="large" />, path: "/batch-rename" },
];

export default function PdfUtilities() {
  const router = useRouter();

  return (
    <Grid container spacing={3} sx={{ padding: "24px" }}>
      {utilities.map((utility, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Link key={utility.name} href={utility.path}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, transition: "0.3s",
              "&:hover": {
                background: "linear-gradient(135deg, #d4fc79, #fef9d7)",
                transform: "scale(1.05)",
              } }}>
            <CardActionArea onClick={() => router.push(utility.path)}>
              <CardContent sx={{ textAlign: "center", padding: "20px" }}>
                {utility.icon}
                <Typography variant="h6" sx={{ marginTop: "12px", fontWeight: "bold" }}>
                  {utility.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
