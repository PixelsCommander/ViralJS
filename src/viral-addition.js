'use strict';

var viralAdditionTemplate = require('./client-scripts-templates/viral-addition-template.js');


class ViralClientAddition {
    constructor(peerId) {
        this.peerId = peerId;
    }

    getContent() {
        return viralAdditionTemplate();
    }
}

module.exports = ViralClientAddition;