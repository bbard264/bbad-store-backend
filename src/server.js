const app = require('./app');
const { connectToDB } = require('./database');
const DEFAULT_PORT = 10000;

connectToDB();

const port = process.env.PORT || DEFAULT_PORT;

app.listen(port, () => {
  console.log(`Server started @ ${port}`);
});
