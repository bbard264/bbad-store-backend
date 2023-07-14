const app = require('./src/app');
const { connectToDB } = require('./src/database');
const port = 4000;

connectToDB();

app.listen(port, () => {
  console.log(`server start @ http://localhost:${port}/`);
});
