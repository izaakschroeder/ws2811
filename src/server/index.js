
import express from 'express';
import levelup from 'levelup';
import leveldown from 'leveldown';

const db = levelup('/var/lib/ws2811/db', {
  keyEncoding: 'utf8',
  valueEncoding: 'json',
});

const NODE_STATE = {
  OFF: 0,
};

let state = NODE_STATE.OFF;

app.get('/layout', (req, res) => {

});

app.put('/layout', (req, res) => {

});

app.get('/channels', (req, res) => {

});

app.get('/channel/:channel', (req, res) => {

});

app.get('/channel/:channel/state', (req, res) => {

});

app.put('/channel/:channel', (req, res) => {

});

app.put('/channel/:channel/state', (req, res) => {

});

app.put('/sequence/:sequence', (req, res) => {

});

app.post('/play', ())

app.post('/stop')

app.get('/state', (req, res) => {

});

app.put('/state', (req, res) => {

});

/*

// layout shape
// Physical device pins on which to output data; this results in a
// contiguous memory map where each pin is driven by a block of memory
// that corresponds to that pin's pixel count. The keys correspond to
// the pin header mappings for the BeagleBone Black.
{
  pins: {
    'P9_22': 300,
    'P9_24': 50
  }
}

// channel shape
// Logical groupings of the physical pixel layout into something meaningful.
// One pin may power several logical groups of pixels, so animating them is
// easier if they can be referred to by something sensible.
{
  id: 'rooftop',
  pixels: [{
    group: 'P9_22', // entry in layout pins
    offset: 10, // offset in string
    length: 25 // pixels after offset to use
  }]
}

// sequence shape
{
  events: [{
    timestamp: 0, // time at which to perform the action
    channel: 'rooftop', // channel on which to perform the action
    action: {
      type: 'set',
      duration: 1000
    }
  }]
}
*/
