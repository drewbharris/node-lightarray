# node-lightarray

node.js application server for the LightArray installation

### API Documentation

#### HTTP API

    GET /api/v1/array
    
Get the current value of all elements.  Returns a JSON object.

    GET /api/v1/array/:element
    
Get the current value of an element.  Return a single number.

    POST /api/v1/array/:element
    
Returns the updated value of the element.
    
#### WebSocket API

@todo
