var Horseman = require('node-horseman');
var horseman = new Horseman();

var numLinks = horseman
  .open('http://www.google.com')
  .type('input[name="q"]', 'github')
  .click("button:contains('Google Search')")
  .waitForNextPage()
  .count("li.g");

console.log("Number of links: " + numLinks);

horseman.close();