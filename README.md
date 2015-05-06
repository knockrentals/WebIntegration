#Knock Web Integration Library

Useful for 3rd party clients to integrate Knock into their websites.

##Usage:

```javascript
knock.init('company id goes here'); // you need to initialize the library with your company id to start

knock.open('listing id goes here'); // opens a scheduling UI for a particular listing

knock.open(); // opens a page showing all of your company's listings for selection
```

##Development

You must first run `npm install` to install grunt and its dependencies.

###Grunt

####Builds

Prod: `grunt build`

Stage: `grunt build:stage`

Dev: `grunt build:dev`

####Deployment

Prod: `grunt deploy:prod`

Stage: `grunt deploy:stage`