![ViralJS](https://github.com/PixelsCommander/ViralJS/blob/master/figures/logo-small.png?raw=true)
=======

P2P Web apps ditribution made easy
----------------------------------

- [Demo](http://pixelscommander.com:3000)
- [Article about](http://pixelscommander.com/en/interactive-revolution/what-is-beyond-isomorphic/)

Isomorphism blurred the boundaries between server and client. The only difference beetween them at the moment is server\`s ability to deliver application to clients. What if we go further supposing that client can transmit application to others? What if we can erase the boundaries between server and client completely? In this case every client which got application\`s code becomes it`s distributor or carrier. And drawing the analogy with spreading microorganisms in the nature this technique perfectly matches “**viral JavaScript**“ naming.

Motivation
----------
P2P content distribution allows to reduce server load and decrease network latency since peering could be setup in the way content to be delivered from the nearest peer available. For example after hitting corporative network application will be delivered inside of it using high speed internal channels without creating a load on company`s internet channel.

![Normal distribution](https://github.com/PixelsCommander/ViralJS/blob/master/figures/normal_m.png?raw=true)

<sub><sup>Traditional app distribution. Server sends package many times, corporative internet channels are loaded appropriately</sup></sub>

![P2P distribution](https://github.com/PixelsCommander/ViralJS/blob/master/figures/p2p_m.png?raw=true)

<sub><sup>In case of P2P distribution application hits corporative network once and then is distributed using high speed internal network. This reduces server load and corporative internet channel load</sup></sub>

Or another case – once application got from USA to Europe it is delivered inside of European networks only without creating transatlantic traffic.

![Normal distribution](https://github.com/PixelsCommander/ViralJS/blob/master/figures/normal_world_m.png?raw=true)

<sub><sup>It takes a lot of transatlantic trips to transmit an app when doing it in a traditional way</sup></sub>

![P2P distribution](https://github.com/PixelsCommander/ViralJS/blob/master/figures/p2p_world_m.png?raw=true)

<sub><sup>P2P allows to reduce number of transcontinental transfers and reduce server load</sup></sub>

By distributing application via P2P you create a self-establishing and self-evolving CDN which moves data closer to client.

Installing from NPM
-------------------
`npm -i viraljs`

How to use?
-----------

```html
var ViralContainer = require('viraljs');
var viralContainer = new ViralContainer();
myExpressApp.use(viralContainer.middleware);
```

Bug tracker
-----------

Have a bug? Please create an issue here on GitHub!

https://github.com/PixelsCommander/ViralJS/issues

License
-------
MIT: http://mit-license.org/

Copyright 2015 Denis Radin aka [PixelsCommander](http://pixelscommander.com)