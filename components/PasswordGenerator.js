"use client";
import React, { useState } from "react";
import { Card, CardContent, Typography, Button, TextField, Checkbox, FormControlLabel } from "@mui/material";
import { CopyAll, Refresh } from "@mui/icons-material";

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    let chars = "";
    if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+{}[]<>?";

    if (chars.length === 0) return;

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      generatedPassword += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(generatedPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <Card sx={{ maxWidth: "xl", margin: "auto", padding: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Password Generator</Typography>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        
        <div>
          <FormControlLabel control={<Checkbox checked={includeUpper} onChange={(e) => setIncludeUpper(e.target.checked)} />} label="Uppercase" />
          <FormControlLabel control={<Checkbox checked={includeLower} onChange={(e) => setIncludeLower(e.target.checked)} />} label="Lowercase" />
          <FormControlLabel control={<Checkbox checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} />} label="Numbers" />
          <FormControlLabel control={<Checkbox checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} />} label="Symbols" />
        </div>
        <TextField
            type="number"
            label="Length"
            inputProps={{ min: 6, max: 32 }}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value) || 6)}
            sx={{ width: 80 }}
          />
          <Button variant="contained" onClick={generatePassword} startIcon={<Refresh />}>Generate</Button>
        </div>
        <div style={{ position: "relative", marginTop: "16px" }}>
          <TextField fullWidth label="Generated Password" value={password} InputProps={{ readOnly: true }} />
          <Button onClick={copyToClipboard} sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}>
            <CopyAll />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator;
