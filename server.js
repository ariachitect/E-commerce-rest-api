const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const mongoose = require('mongoose');

const dataBase = process.env.DATABASE;
mongoose
  .connect(dataBase, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connected successfully !'));
const app = require('./app');

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 5053;

app.listen(port, host, () => {
  console.log(` we are listening on  ${host}:${port} ...`);
});
