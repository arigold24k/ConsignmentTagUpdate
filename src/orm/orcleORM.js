const connectionString =  require('../databaseConfig/orcleDBConfig');
const oracledb = require('oracledb');
process.env.ORA_SDTZ = 'EST';

const ormOrcle = {
    get_consigment_data:  async(cb) => {
        console.log('Hitting Oracle: get consignment Tags');
        let connection;
        console.log(`Connection: ${connection}`);
        try {
            console.log("made it to the try.");
            connection = await oracledb.getConnection(connectionString);
            console.log(`Connection: ${connection}`);
            let results = await connection.execute(`SELECT B.CUST_SHIPTO_NUM, B.INV_ITEM_CODE, B.INV_ITEM_TAG, A.CUST_PO_NUMBER, to_char(A.INVOICE_DATE, 'MM-DD-YYYY') FROM ST_INVOICES A, ST_INVOICE_LINES B WHERE A.INVOICE_ID = B.INVOICE_ID AND A.CUST_PO_NUMBER = 'CONSIGNMENT' order by b.cust_shipto_num, a.invoice_date asc`);
            console.log(`Getting results: ${results}`);
            if (results) {
                console.log('Results from query: ', results);
                cb(null, results);
            }
        }
        catch(error){
            cb(error, null);
        }
        finally{
            if(connection) {
                try{
                    console.log('Connection closed');
                    connection.close();
                }catch(error) {
                    console.log(`Error closing oracle connection.Error: `, error);
                }

            }
        }
    },
    update_po_num: async (incoming_data ,cb) => {
        let connection;
        try {
            console.log("Hitting update po num in orm: ", incoming_data);
            console.log("Po Number: ", incoming_data.po_number);
            console.log("Tags: ", incoming_data.tags);
            //console.log("Tags Keys: ", Object.keys(incoming_data.tags[1]));
            connection = await oracledb.getConnection(connectionString);
            let results = false;
            let results2 = false;
            let shipto;
            for (let i = 0; i < incoming_data.tags.length; i++) {
                let keys_ = Object.keys(incoming_data.tags[i]);

                // for (let j = 0; j < keys_.length; i++) {
                    console.log(`UPDATE ST_INVOICES SET CUST_PO_NUMBER = '${incoming_data.po_number}' WHERE INVOICE_ID IN (SELECT INVOICE_ID FROM ST_INVOICE_LINES WHERE 1=1 AND INV_ITEM_TAG IN ('${incoming_data.tags[i][keys_[2]]}') AND CUST_SHIPTO_NUM = '${incoming_data.tags[i][keys_[0]]}')`);
                    results = await connection.execute(`BEGIN UPDATE ST_INVOICES SET CUST_PO_NUMBER = '${incoming_data.po_number}' WHERE INVOICE_ID IN (SELECT INVOICE_ID FROM ST_INVOICE_LINES WHERE 1=1 AND INV_ITEM_TAG IN ('${incoming_data.tags[i][keys_[2]]}') AND CUST_SHIPTO_NUM = '${incoming_data.tags[i][keys_[0]]}');  COMMIT; END;`);

                    console.log("results: ", results)
                // }

            };

            shipto = incoming_data.tags[0][Object.keys(incoming_data.tags[0])[0]];
            if (shipto == '001871J') {
                results2 = await connection.execute(`BEGIN PSSI.PSSI_JCI_CONS_INV_RPT_AV ('${incoming_data.po_number}', '${incoming_data.tags[0][Object.keys(incoming_data.tags[0])[0]]}'); COMMIT; END;`);
            }

            // results2 = await connection.execute(`BEGIN PSSI.PSSI_JCI_CONS_INV_RPT_AV ('${incoming_data.po_number}', '${incoming_data.tags[0][Object.keys(incoming_data.tags[0])[0]]}');`);
            console.log(`Values of result 1: ${results}: Value of result 2: ${results2}`);
            if (results && (results2 || shipto !== '001871J')) {
                cb(null, true);
            }else {
                cb(true, null);
            }

        }
        catch(error){
            cb(error, null);
        }
        finally{
            if(connection) {
                try{
                    connection.close();
                }catch(error) {
                    console.log(`Error closing oracle connection.Error: `, error);
                }

            }
        }
    }

};

module.exports = ormOrcle;
