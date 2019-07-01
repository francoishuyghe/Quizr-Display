const routes = require('next-routes')

                                                    // Name   Page      Pattern
module.exports = routes()                           // ----   ----      -----
.add('intro', '/intro')                                       
.add('question', '/question/:number')
.add('share', '/share')
.add('shared', '/shared')
    .add('results', '/results')
    .add('/:shop', '/')