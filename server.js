const app = require('./app');
const { connectToDB } = require('./config');
const port = 4000;

connectToDB();

app.listen(port, () => {
  console.log(`server start @ http://localhost:${port}/`);
});
