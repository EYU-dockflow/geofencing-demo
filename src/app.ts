import { Application } from 'express';

const express = require( "express" );
const app:Application = express();
const port = 3000

app.get('/', (req, res) => res.send('Geofencing demo - typescripted.'))

app.listen(port, () => console.log(`We're listening on port ${port}!`))