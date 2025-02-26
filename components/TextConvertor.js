"use client";
import { useState } from "react";
import { TextField, IconButton, Typography, Box, Card, CardContent } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const numberToIndianWords = (num) => {
  if (num === "0") return "Rupee Zero";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const scales = ["", "Thousand", "Lakh", "Crore", "Arab", "Kharab", "Neel", "Padma", "Shankh"];

  let words = [];
  let numStr = num.toString();

  const getWords = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + getWords(n % 100) : "");
  };

  const numSections = [];
  while (numStr.length > 0) {
    if (numSections.length === 0) {
      numSections.push(numStr.slice(-3)); // Last 3 digits (for thousands)
      numStr = numStr.slice(0, -3);
    } else {
      numSections.push(numStr.slice(-2)); // Next 2 digits (for Lakh, Crore)
      numStr = numStr.slice(0, -2);
    }
  }

  numSections.reverse().forEach((section, index) => {
    let numValue = parseInt(section, 10);
    if (numValue !== 0) {
      words.push(getWords(numValue) + " " + scales[numSections.length - index - 1]);
    }
  });

  return "Rupee " + words.join(" ").trim();
};

export default function RupeeConverter() {
  const [number, setNumber] = useState("");
  const [words, setWords] = useState("");
  const [commaSeparated, setCommaSeparated] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow numbers
    setNumber(value);

    if (value) {
      setWords(numberToIndianWords(value));
      setCommaSeparated(new Intl.NumberFormat("en-IN").format(Number(value)));
    } else {
      setWords("");
      setCommaSeparated("");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box sx={{ maxWidth: "xl", margin: "auto", textAlign: "center", p: 3 }}>
       <Card sx={{ maxWidth: "xl", margin: "auto", padding: 3, boxShadow: 3 }}>
       <CardContent>
       <Typography variant="h5" gutterBottom sx={{ textAlign: "left" }}>
  Text Convertor
</Typography>

      <TextField
        label="Enter Amount"
        variant="outlined"
        fullWidth
        value={number}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      {commaSeparated && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">{commaSeparated}</Typography>
          <IconButton onClick={() => copyToClipboard(commaSeparated)}>
            <ContentCopyIcon />
          </IconButton>
        </Box>
      )}

      {words && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6">{words}</Typography>
          <IconButton onClick={() => copyToClipboard(words)}>
            <ContentCopyIcon />
          </IconButton>
        </Box>
      )}
    </CardContent>
    </Card>
    </Box>
  );
}
