const fs = require('fs');

const dir = './results';

const saveNews =  async (name, results) => {

    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }

   await fs.writeFile(`${dir}/${name}.json`, JSON.stringify(results,null, 2), function (err) {
        if(err){
            console.log(err);
        }
    })
};

module.exports = {
    saveNews,
};