'use strict';

function APIError(status, message) {
    this.name = 'APIError';
    this.message = message || 'BAD REQUEST';
    this.status = status || 400;
}
APIError.prototype = Object.create(Error.prototype);
APIError.prototype.constructor = APIError;
APIError.prototype.jsonFormat = jsonFormat;

function jsonFormat() {
    if(typeof this.message === 'string') {
        this.message = { message: this.message }
    }
}


module.exports = APIError;