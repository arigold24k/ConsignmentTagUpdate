const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path: path.join(__dirname, '/../../' ,'.env')});
const dbname = 'PSSI';

console.log('Hitting Oracle Connection');
const configOracleObj = {
    user: process.env.USRNME,
    password: process.env.DKKEY2,
    connectString: 'smpdb2.pssi.local:1521/' + dbname,
    externalAuth: false
};

module.exports = configOracleObj;
