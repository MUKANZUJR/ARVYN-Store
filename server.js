const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- ORDERS ---
// Create new order
app.post('/api/orders', async(req, res) => {
    try {
        const { customer_name, email, phone, address, items, total } = req.body;

        // Insert into orders table
        const orderResult = await pool.query(
            `INSERT INTO orders (customer_name, email, phone, address, total)
             VALUES ($1,$2,$3,$4,$5) RETURNING id`, [customer_name, email, phone, address, total]
        );

        const orderId = orderResult.rows[0].id;

        // Insert items
        for (let item of items) {
            await pool.query(
                `INSERT INTO order_items (order_id, product_name, price, quantity)
                 VALUES ($1,$2,$3,$4)`, [orderId, item.name, item.price, item.quantity || 1]
            );
        }

        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all orders
app.get('/api/orders', async(req, res) => {
    try {
        const orders = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(orders.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// --- MESSAGES ---
// Post a message
app.post('/api/messages', async(req, res) => {
    try {
        const { name, email, message } = req.body;
        await pool.query(
            'INSERT INTO messages (name, email, message) VALUES ($1,$2,$3)', [name, email, message]
        );
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all messages
app.get('/api/messages', async(req, res) => {
    try {
        const messages = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(messages.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));