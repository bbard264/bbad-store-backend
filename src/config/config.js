const fs = require('fs');

class Config {
  static readConfigFile(documentName) {
    const data = fs.readFileSync('./src/config/config.json', 'utf8');
    const config = JSON.parse(data);
    const document = config[documentName];
    return document;
  }
}

module.exports = Config;
