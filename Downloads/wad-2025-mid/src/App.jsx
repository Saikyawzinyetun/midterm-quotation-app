import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  Paper,
  Typography,
} from '@mui/material';

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [discount, setDiscount] = useState('');

  // Prefill on load
  useEffect(() => {
    fetch('/data/quotation.json')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Failed to load prefill data', err));
  }, []);

  // Add or merge item
  const handleAdd = () => {
    const newItem = {
      name: itemName.trim(),
      price: parseFloat(price) || 0,
      qty: parseInt(qty, 10) || 0,
      discount: parseFloat(discount) || 0,
    };
    if (!newItem.name) return;

    const idx = items.findIndex(
      x => x.name === newItem.name && x.price === newItem.price
    );
    if (idx > -1) {
      const updated = [...items];
      updated[idx] = {
        ...updated[idx],
        qty: updated[idx].qty + newItem.qty,
        discount: updated[idx].discount + newItem.discount,
      };
      setItems(updated);
    } else {
      setItems(prev => [...prev, newItem]);
    }

    // Reset form
    setItemName('');
    setPrice('');
    setQty('');
    setDiscount('');
  };

  // Clear all items
  const handleClear = () => setItems([]);

  // Delete single item
  const handleDelete = index => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Compute totals
  const subtotal = items.reduce((sum, x) => sum + x.price * x.qty, 0);
  const totalDiscount = items.reduce((sum, x) => sum + x.discount, 0);
  const grandTotal = subtotal - totalDiscount;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quotation App
      </Typography>
      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Item
            </Typography>
            <TextField
              label="Item"
              fullWidth
              margin="normal"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              margin="normal"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              margin="normal"
              value={qty}
              onChange={e => setQty(e.target.value)}
            />
            <TextField
              label="Discount"
              type="number"
              fullWidth
              margin="normal"
              value={discount}
              onChange={e => setDiscount(e.target.value)}
            />
            <Button variant="contained" fullWidth onClick={handleAdd} sx={{ mt: 2 }}>
              Add
            </Button>
            <Button variant="outlined" fullWidth onClick={handleClear} sx={{ mt: 1 }}>
              Clear
            </Button>
          </Paper>
        </Grid>

        {/* Table Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((itm, idx) => (
                  <TableRow key={`${itm.name}-${idx}`}>
                    <TableCell>{itm.name}</TableCell>
                    <TableCell align="right">{itm.price.toFixed(2)}</TableCell>
                    <TableCell align="right">{itm.qty}</TableCell>
                    <TableCell align="right">{itm.discount.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      {(itm.price * itm.qty - itm.discount).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Button color="error" onClick={() => handleDelete(idx)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Totals</TableCell>
                  <TableCell align="right">{totalDiscount.toFixed(2)}</TableCell>
                  <TableCell align="right">{grandTotal.toFixed(2)}</TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
