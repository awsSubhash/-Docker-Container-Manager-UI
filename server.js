const express = require('express');
const Docker = require('dockerode');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const docker = new Docker();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get running containers
app.get('/containers', async (req, res) => {
    try {
        const containers = await docker.listContainers();
        res.json(containers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Kill a container
app.post('/kill-container', async (req, res) => {
    const { containerId } = req.body;
    if (!containerId) {
        return res.status(400).json({ error: 'Container ID is required' });
    }

    try {
        const container = docker.getContainer(containerId);
        await container.stop();
        res.json({ message: `Container ${containerId} stopped successfully.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

