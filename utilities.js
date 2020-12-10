const csv = require('csv-parser');
const fs = require('fs');
const path = require("path");

class Utilities {
    static readCSV(path) {
        return new Promise(((resolve, reject) => {
            const results = [];
            fs.createReadStream(path)
                .pipe(csv())
                .on('data', data => results.push(data))
                .on('end', () => {
                    resolve(results);
                })
                .on('error', reject);
        }));
    }

    static readFile(path) {
        return fs.readFileSync(path).toString();
    }


    static removeFilePart(dirname){
        return path.parse(dirname).dir;
    };

    static fileExists(path) {
        return fs.existsSync(path);
    }


}

module.exports = Utilities;