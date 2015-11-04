'use strict';

var fs = require('fs');

class App {
    constructor(){
        this.layout = fs.readFileSync('./index.html');
    }

    render(){
        return this.layout;
    }
}

module.exports = App;