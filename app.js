const fs = require('fs');
let webapp = require('./webapp.js');
let ServeFile = require('./lib/serveFile.js');
let serveFile = new ServeFile('public').getRequestHandler();
const lib = require('./lib/handlers.js');
let app = webapp.create();
app.use(lib.loadUser);
app.use(lib.redirectLoggedOutUserToLogin);
app.use(lib.redirectLoggedInUserToHome);
app.post('/login',lib.loginHandler);
app.get('/logout',lib.logoutHandle);
app.post('/addTodo',lib.addTodoHandler);
app.post('/getAllTitle',lib.getAllTitle);
app.postProcess(serveFile);

module.exports = app;
