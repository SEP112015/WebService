const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const AGENDA_API = 'http://www.raydelto.org/agenda.php';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const response = await axios.get(AGENDA_API);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Route to add a new contact
app.post('/api/contacts', async (req, res) => {
  try {
    const { nombre, apellido, telefono } = req.body;
    
    // Validate required fields
    if (!nombre || !apellido || !telefono) {
      return res.status(400).json({ error: 'All fields are required (nombre, apellido, telefono)' });
    }
    
    const contact = { nombre, apellido, telefono };
    const response = await axios.post(AGENDA_API, contact);
    
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ error: 'Failed to add contact' });
  }
});

// Explicitly handle the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
