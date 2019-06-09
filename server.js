const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Geofencing demo'))

app.listen(port, () => console.log(`We're listening on port ${port}!`))