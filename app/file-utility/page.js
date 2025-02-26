import React from "react";
import { Grid, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { PictureAsPdf, Layers, ContentCut, ContentCopy, TextSnippet, Visibility, FileDownload, Compress, Image, Rotate90DegreesCcw, Lock, VpnKey, Edit, Description, TableChart, Slideshow, ImageSearch, DriveFileRenameOutline } from "@mui/icons-material";

const utilities = [
  { title: "Merge PDFs", icon: <Layers fontSize="large" />, path: "/merge-pdf" },
  { title: "Split PDF", icon: <ContentCut fontSize="large" />, path: "/split-pdf" },
  { title: "Extract Pages", icon: <ContentCopy fontSize="large" />, path: "/extract-pages" },
  { title: "Extract Text", icon: <TextSnippet fontSize="large" />, path: "/extract-text" },
  { title: "PDF Preview", icon: <Visibility fontSize="large" />, path: "/pdf-preview" },
  { title: "Download Processed PDF", icon: <FileDownload fontSize="large" />, path: "/download-pdf" },
  { title: "Compress PDF", icon: <Compress fontSize="large" />, path: "/compress-pdf" },
  { title: "Convert PDF to Images", icon: <Image fontSize="large" />, path: "/pdf-to-images" },
  { title: "Convert Images to PDF", icon: <PictureAsPdf fontSize="large" />, path: "/images-to-pdf" },
  { title: "Rotate PDF Pages", icon: <Rotate90DegreesCcw fontSize="large" />, path: "/rotate-pdf" },
  { title: "Secure PDF", icon: <Lock fontSize="large" />, path: "/secure-pdf" },
  { title: "Remove Password", icon: <VpnKey fontSize="large" />, path: "/remove-password" },
  { title: "Sign PDF", icon: <Edit fontSize="large" />, path: "/sign-pdf" },
  { title: "Convert PDF to Word", icon: <Description fontSize="large" />, path: "/pdf-to-word" },
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
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardActionArea onClick={() => router.push(utility.path)}>
              <CardContent sx={{ textAlign: "center", padding: "20px" }}>
                {utility.icon}
                <Typography variant="h6" sx={{ marginTop: "12px", fontWeight: "bold" }}>
                  {utility.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
