import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Box, Button, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Select, MenuItem, Paper } from '@mui/material';

const gstSlabs = [0, 5, 12, 18, 28];
const tdsSlabs = [1, 2, 5, 10, 20, 30];

const TaxCalculator = () => {
    const [rows, setRows] = useState([{ baseAmount: '', gstRate: 18, tdsRate: 10 }]);
    const [results, setResults] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedHistory = Cookies.get('history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
    }, []);

    const addRow = () => {
        setRows([...rows, { baseAmount: '', gstRate: 18, tdsRate: 10 }]);
    };

    const removeRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, field, value) => {
        setRows(rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
    };

    const calculateTaxes = () => {
        const newResults = rows.map((row) => {
            const baseAmount = parseFloat(row.baseAmount);
            if (isNaN(baseAmount)) return null;

            const gstRate = parseFloat(row.gstRate) / 100;
            const tdsRate = parseFloat(row.tdsRate) / 100;

            const gstAmount = roundToTwoDecimals(baseAmount * gstRate);
            const tdsAmount = roundToNextTen(baseAmount * tdsRate);

            const finalAmount = baseAmount + gstAmount - tdsAmount;

            return { baseAmount, gstRate: row.gstRate, tdsRate: row.tdsRate, gstAmount, tdsAmount, finalAmount };
        }).filter(Boolean);

        setResults(newResults);

        const historyItem = { timestamp: new Date().toLocaleString(), calculations: newResults };
        const updatedHistory = [...history, historyItem];
        Cookies.set('history', JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
    };

    const roundToTwoDecimals = (value) => Math.round(value * 100) / 100;
    const roundToNextTen = (value) => Math.ceil(value / 10) * 10;

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" align="center" gutterBottom>
                Invoice Calculator
            </Typography>

            {/* Table Inputs */}
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Base Amount</TableCell>
                            <TableCell>GST Rate</TableCell>
                            <TableCell>TDS Rate</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={row.baseAmount}
                                        onChange={(e) => handleInputChange(index, 'baseAmount', e.target.value)}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={row.gstRate}
                                        onChange={(e) => handleInputChange(index, 'gstRate', e.target.value)}
                                        fullWidth
                                    >
                                        {gstSlabs.map((slab) => (
                                            <MenuItem key={slab} value={slab}>
                                                {slab}%
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={row.tdsRate}
                                        onChange={(e) => handleInputChange(index, 'tdsRate', e.target.value)}
                                        fullWidth
                                    >
                                        {tdsSlabs.map((slab) => (
                                            <MenuItem key={slab} value={slab}>
                                                {slab}%
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button color="error" variant="contained" onClick={() => removeRow(index)}>
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Buttons with spacing */}
            <Box display="flex" gap={2} mt={3} mb={4} justifyContent="center" flexWrap="wrap">
                <Button color="success" variant="contained" onClick={addRow}>
                    Add Row
                </Button>
                <Button color="primary" variant="contained" onClick={calculateTaxes}>
                    Calculate
                </Button>
            </Box>

            {/* Results Table */}
            <Typography variant="h5" gutterBottom>Results</Typography>
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Base Amount</TableCell>
                            <TableCell>GST Rate</TableCell>
                            <TableCell>GST Amount</TableCell>
                            <TableCell>TDS Rate</TableCell>
                            <TableCell>TDS Amount</TableCell>
                            <TableCell>Final Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {results.map((result, index) => (
                            <TableRow key={index}>
                                <TableCell>{result.baseAmount.toFixed(2)}</TableCell>
                                <TableCell>{result.gstRate}%</TableCell>
                                <TableCell>{result.gstAmount.toFixed(2)}</TableCell>
                                <TableCell>{result.tdsRate}%</TableCell>
                                <TableCell>{result.tdsAmount.toFixed(2)}</TableCell>
                                <TableCell>{result.finalAmount.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* History */}
            <Typography variant="h5" mt={4} gutterBottom>Calculation History</Typography>
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Base Amount</TableCell>
                            <TableCell>GST Rate</TableCell>
                            <TableCell>Final Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.map((entry, index) => (
                            entry.calculations.map((calc, i) => (
                                <TableRow key={`${index}-${i}`}>
                                    <TableCell>{i === 0 ? entry.timestamp : ''}</TableCell>
                                    <TableCell>{calc.baseAmount.toFixed(2)}</TableCell>
                                    <TableCell>{calc.gstRate}%</TableCell>
                                    <TableCell>{calc.finalAmount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default TaxCalculator;
