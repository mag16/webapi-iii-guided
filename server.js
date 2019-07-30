const express = require('express'); // importing a CommonJS module

const hubsRouter = require('./hubs/hubs-router.js');
const helmet = require('helmet');
const morgan = require('morgan');

const server = express();

server.use(helmet());
server.use(morgan('dev'));
server.use(express.json());
server.use('/api/hubs', hubsRouter);
server.use(methodLogger);
server.use(addName);
//server.use(lockout);
server.use(gateKeeper);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

function methodLogger(req, res, next) {
  console.log(`${req.method} request received`);
  next()
}

function addName(req, res, next) {
  req.name = 'MAG';
  next();
}

function lockout(req, res, next) {
  res.status(403).json({ message: 'API locked us out YALL!!!' });
}

function gateKeeper(req, res, next) {
  const seconds = new Date().getSeconds();
  console.log(`the seconds is: ${seconds}`)

  if (seconds & 3 === 0) {
    res.status(403).json({ message: 'I really hate the # 3' });
  } else {
    next();
  }

}

module.exports = server;
