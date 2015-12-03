'use strict';

var thinClientTemplate = require('./client-scripts-templates/thin-client-template.js');

class ViralThinClient {
  constructor(peerSocket) {
    this.peerSocketId = peerSocket.id;
  }

  getContent() {
    return thinClientTemplate(this.peerSocketId);
  }
}

module.exports = ViralThinClient;