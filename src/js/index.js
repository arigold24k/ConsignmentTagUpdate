const orm = require('../orm/orcleORM');
const electron = require('electron');
const {ipcRenderer} = electron;
let newRow;
let newData;
let newText;
let dataArray = [];
let holderObject = {};
let selected = [];
let newRadioButton;

$(document).ready(async function(e){
    try {
        run_get_tags();
    }
    catch (err) {
        console.log('Error, ', err);
    }
    finally {
        //have to initialize the modal
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, options);
        var options = {};

        //setting error modal to a variable
        const elemError = document.getElementById('errorModal');
        const instanceError = M.Modal.getInstance(elemError);

        //filter code for ship to number
        let shipTo = document.querySelector('#shipto');
        let itemcode = document.querySelector('#item-code');
        let tagnumber = document.querySelector('#tag-number');
        let invdate = document.querySelector('#invoice-date');
        let filterbox = document.getElementsByClassName('filterbox');
        console.log('filter box lenght ', filterbox.length);


        Array.from(filterbox).forEach((filter_box) => {
            filter_box.addEventListener('change', (e) => {
                console.log('test 123');
                const selectbutton = document.querySelectorAll('.data-row');

                //simplified code
                selectbutton.forEach((elem) => {
                    if(shipTo.value != '' || tagnumber.value != '' || invdate.value != '' || itemcode.value != '') {
                        if (( (elem.getAttribute('data-tag-number').indexOf(tagnumber.value) !== -1 || tagnumber.value == '') && (elem.getAttribute('data-shipto').indexOf(shipTo.value) !== -1 || shipTo.value == '') && (elem.getAttribute('data-invoice-date').indexOf(invdate.value) !== -1 || invdate.value == '') && (elem.getAttribute('data-item-code').indexOf(itemcode.value) !== -1 || itemcode.value == ''))) {
                            elem.style.display = '';
                        }else {
                            elem.style.display = 'none';
                        }
                    }else {
                        elem.style.display = '';
                    }
                });

            });
        });

        let submitbutton = document.querySelector('#get-tags');
        submitbutton.addEventListener("click", (e) => {
            e.preventDefault();
            console.log('Submit button works.');
            if(selected.length == 0) {
                //alert('Please Select at least one item');
                instanceError.open();
            }else{

                console.log('Send Data Object: ', selected);

                ipcRenderer.send('update:tags', selected);
            };

        });

        let okErrorButton = document.getElementById('modal-error-ok');
        okErrorButton.addEventListener('click', (e) => {
            e.preventDefault();
            instanceError.close();
        });


    };
});

document.addEventListener("onload", async (e) => {
    try {
        run_get_tags();
    }catch(e){
        console.log(`Error: ${e}`)
    }finally{
        let shipTo = document.querySelector('#shipto');
        let itemcode = document.querySelector('#item-code');
        let tagnumber = document.querySelector('#tag-number');
        let invdate = document.querySelector('#invoice-date');
        let filterbox = document.getElementsByClassName('filterbox');
        console.log('filter box lenght ', filterbox.length);


        Array.from(filterbox).forEach((filter_box) => {
            filter_box.addEventListener('change', (e) => {
                console.log('test 123');
                const selectbutton = document.querySelectorAll('.data-row');

                //simplified code
                selectbutton.forEach((elem) => {
                    if(shipTo.value != '' || tagnumber.value != '' || invdate.value != '' || itemcode.value != '') {
                        if (( (elem.getAttribute('data-tag-number').indexOf(tagnumber.value) !== -1 || tagnumber.value == '') && (elem.getAttribute('data-shipto').indexOf(shipTo.value) !== -1 || shipTo.value == '') && (elem.getAttribute('data-invoice-date').indexOf(invdate.value) !== -1 || invdate.value == '') && (elem.getAttribute('data-item-code').indexOf(itemcode.value) !== -1 || itemcode.value == ''))) {
                            elem.style.display = '';
                        }else {
                            elem.style.display = 'none';
                        }
                    }else {
                        elem.style.display = '';
                    }
                });

            });
        });

        let submitbutton = document.querySelector('#get-tags');
        submitbutton.addEventListener("click", (e) => {
            e.preventDefault();
            console.log('Submit button works.');
            if(selected.length == 0) {
                alert('Please Select at least one item');
            }else{

                console.log('Send Data Object: ', selected);

                ipcRenderer.send('update:tags', selected);
            };

        });
    }
});

const run_get_tags = async () => {
    await orm.get_consigment_data((err, res) => {
        console.log(`Response from get consignment: res: ${res}, \n err: ${err}`);
        if (err) {
            console.log('Error in getting Oracle data Error Msg: ', err);
            throw err;
            //return;
        }else {
            const data = res.row;

            const lenofData = res.rows.length;

            console.log('Data coming back', lenofData);
            const querySection = document.querySelector('tbody');
            for (let i = 0 ; i < lenofData; i++) {
                newRow = document.createElement('tr');
                //add to attributes ot the row to be able to hid and unhide rows.
                newRow.setAttribute('class', 'data-row');
                newRow.setAttribute('data-shipto', res.rows[i][0]);
                newRow.setAttribute('data-item-code', res.rows[i][1]);
                newRow.setAttribute('data-tag-number', res.rows[i][2]);
                newRow.setAttribute('data-invoice-date', res.rows[i][4]);
                for (let j = 0; j < res.rows[i].length; j++) {
                    newData = document.createElement('td');
                    newData.setAttribute('class', 'center-align');

                    if (j == 0) {
                        let newlabel = document.createElement('label');
                        //newlabel.setAttribute('class', 'center-align');
                        newRadioButton = document.createElement('input');
                        newRadioButton.setAttribute('type', 'checkbox');
                        newRadioButton.setAttribute('value', res.rows[i][2]);
                        newRadioButton.setAttribute('id', res.rows[i][1]);
                        newRadioButton.setAttribute('class', 'center-align selectButton');

                        newRadioButton.setAttribute('data-shipto', res.rows[i][0]);
                        newRadioButton.setAttribute('data-item-code', res.rows[i][1]);
                        newRadioButton.setAttribute('data-tag-number', res.rows[i][2]);
                        newRadioButton.setAttribute('data-invoice-date', res.rows[i][4]);
                        newlabel.append(newRadioButton);
                        newlabel.append(document.createElement('span'));

                        //newRow.append(newlabel);
                        newData.append(newlabel);
                        //newData.innerText = res.rows[i][j];
                        newRow.append(newData);
                        newData = null;
                        newData = document.createElement('td');
                        newData.setAttribute('class', 'center-align');
                        newData.innerText = res.rows[i][j];
                        newRow.append(newData);
                        holderObject['shipto'] = res.rows[i][j];
                        newData = null;

                    }else {
                        newData.innerText = res.rows[i][j];
                        // newText = document.createTextNode(res.rows[i][j]);
                        switch (j) {
                            case 1:
                                holderObject['itemcode'] = res.rows[i][j];
                                break;
                            case 2:
                                holderObject['tagNumber'] = res.rows[i][j];
                                break;
                            case 3:
                                holderObject['custPO'] = res.rows[i][j];
                                break;
                            case 4:
                                holderObject['invoiceDate'] = res.rows[i][j];
                                break;
                            default:
                                break;
                        }
                        newRow.append(newData);
                        newData = null;

                    }

                }
                dataArray.push(holderObject);
                querySection.append(newRow);
                newRow = null;
                newData = null;
                newText = null;
                //dataArray = [];
            };
        }
    });
};

const refresh_page = () => {
  let tableData = document.getElementsByClassName("data-row");

  //tableData.clear();
  Array.from(tableData).forEach((tableRow) => {
      tableRow.remove();
  });

    selected = [];
    let filterbox = document.getElementsByClassName('filterbox');
    Array.from(filterbox).forEach((val) => {
       val.value = '';
    });
    let checkbox_ = document.getElementById('selectAll');
    checkbox_.checked = false;
  //console.log('removed old data.');
  //console.log('Beginning of run_get_tags.');
  run_get_tags();
  //console.log('end of run_get_tags.');

};

ipcRenderer.on('update:refresh', (e) => {
    refresh_page();


});

//
// document.addEventListener("DOMContentLoaded", async function(e){
//     try {
//         orm.get_consigment_data((err, res) => {
//             if (err) {
//                 console.log('Error in getting Oracle data Error Msg: ', err);
//                 //return;
//             }else {
//                 const data = res.row;
//
//                 const lenofData = res.rows.length;
//
//                 console.log('Data coming back', lenofData);
//                 const querySection = document.querySelector('tbody');
//                 for (let i = 0 ; i < lenofData; i++) {
//                     newRow = document.createElement('tr');
//                     //add to attributes ot the row to be able to hid and unhide rows.
//                     newRow.setAttribute('class', 'data-row');
//                     newRow.setAttribute('data-shipto', res.rows[i][0]);
//                     newRow.setAttribute('data-item-code', res.rows[i][1]);
//                     newRow.setAttribute('data-tag-number', res.rows[i][2]);
//                     newRow.setAttribute('data-invoice-date', res.rows[i][4]);
//                     for (let j = 0; j < res.rows[i].length; j++) {
//                         newData = document.createElement('td');
//                         newData.setAttribute('class', 'center-align');
//
//                         if (j == 0) {
//                             let newlabel = document.createElement('label');
//                             newlabel.setAttribute('class', 'center-align');
//                             newRadioButton = document.createElement('input');
//                             newRadioButton.setAttribute('type', 'checkbox');
//                             newRadioButton.setAttribute('value', res.rows[i][2]);
//                             newRadioButton.setAttribute('id', res.rows[i][1]);
//                             newRadioButton.setAttribute('class', 'selectButton center-align');
//
//                             newRadioButton.setAttribute('data-shipto', res.rows[i][0]);
//                             newRadioButton.setAttribute('data-item-code', res.rows[i][1]);
//                             newRadioButton.setAttribute('data-tag-number', res.rows[i][2]);
//                             newRadioButton.setAttribute('data-invoice-date', res.rows[i][4]);
//                             newlabel.append(newRadioButton);
//                             newlabel.append(document.createElement('span'));
//
//                             newRow.append(newlabel);
//
//                             newData.innerText = res.rows[i][j];
//                             newRow.append(newData);
//                             holderObject['shipto'] = res.rows[i][j];
//                             newData = null;
//
//                         }else {
//                             newData.innerText = res.rows[i][j];
//                             // newText = document.createTextNode(res.rows[i][j]);
//                             switch (j) {
//                                 case 1:
//                                     holderObject['itemcode'] = res.rows[i][j];
//                                     break;
//                                 case 2:
//                                     holderObject['tagNumber'] = res.rows[i][j];
//                                     break;
//                                 case 3:
//                                     holderObject['custPO'] = res.rows[i][j];
//                                     break;
//                                 case 4:
//                                     holderObject['invoiceDate'] = res.rows[i][j];
//                                     break;
//                                 default:
//                                     break;
//                             }
//                             newRow.append(newData);
//                             newData = null;
//
//                         }
//
//                     }
//                     dataArray.push(holderObject);
//                     querySection.append(newRow);
//                     newRow = null;
//                     newData = null;
//                     newText = null;
//                     //dataArray = [];
//                 };
//             }
//         });
//     }
//     catch (err) {
//       console.log('Error, ', err);
//     }
//     finally {
//         //filter code for ship to number
//         let shipTo = document.querySelector('#shipto');
//         let itemcode = document.querySelector('#item-code');
//         let tagnumber = document.querySelector('#tag-number');
//         let invdate = document.querySelector('#invoice-date');
//         let filterbox = document.getElementsByClassName('filterbox');
//         console.log('filter box lenght ', filterbox.length);
//
//
//         Array.from(filterbox).forEach((filter_box) => {
//             filter_box.addEventListener('change', (e) => {
//                 console.log('test 123');
//                 const selectbutton = document.querySelectorAll('.data-row');
//
//                 //simplified code
//                 selectbutton.forEach((elem) => {
//                     if(shipTo.value != '' || tagnumber.value != '' || invdate.value != '' || itemcode.value != '') {
//                         if (( (elem.getAttribute('data-tag-number').indexOf(tagnumber.value) !== -1 || tagnumber.value == '') && (elem.getAttribute('data-shipto').indexOf(shipTo.value) !== -1 || shipTo.value == '') && (elem.getAttribute('data-invoice-date').indexOf(invdate.value) !== -1 || invdate.value == '') && (elem.getAttribute('data-item-code').indexOf(itemcode.value) !== -1 || itemcode.value == ''))) {
//                             elem.style.display = '';
//                         }else {
//                             elem.style.display = 'none';
//                         }
//                     }else {
//                         elem.style.display = '';
//                     }
//                 });
//
//             });
//         });
//
//         let submitbutton = document.querySelector('#get-tags');
//         submitbutton.addEventListener("click", (e) => {
//             e.preventDefault();
//            console.log('Submit button works.');
//            if(selected.length == 0) {
//                alert('Please Select at least one item');
//            }else{
//
//                console.log('Send Data Object: ', selected);
//
//                ipcRenderer.send('update:tags', selected);
//            };
//
//         });
//
//
//     };
// });

document.addEventListener('change', (e) => {
    console.log('This is the target', e.target);
    console.log('This is the target', e.target.id);
    if (e.target && e.target.className.indexOf('selectButton') !== -1) {
        console.log("Check box", e.target.checked);
        console.log('Index of tag, ', selected.indexOf(e.target));
        const index_ = selected.findIndex(x => x.tagnumber === e.target.getAttribute('data-tag-number'));
        if (e.target.checked) {
            //add to array

            if (index_ === -1) {
                selected.push({
                    "shipto": e.target.getAttribute('data-shipto'),
                    "itemcode": e.target.getAttribute('data-item-code'),
                    "tagnumber": e.target.getAttribute('data-tag-number')
                });
            }
        }else {
            //remove from array
            if (index_ !== -1) {
                selected.splice(index_, 1);
            }
        }
    };

    if(e.target && e.target.className == 'filterbox') {
        console.log('test 123');
        const selectbutton = document.querySelectorAll('.data-row');

        //simplified code
        selectbutton.forEach((elem) => {
            if(shipTo.value != '' || tagnumber.value != '' || invdate.value != '' || itemcode.value != '') {
                if (( (elem.getAttribute('data-tag-number').indexOf(tagnumber.value) !== -1 || tagnumber.value == '') && (elem.getAttribute('data-shipto').indexOf(shipTo.value) !== -1 || shipTo.value == '') && (elem.getAttribute('data-invoice-date').indexOf(invdate.value) !== -1 || invdate.value == '') && (elem.getAttribute('data-item-code').indexOf(itemcode.value) !== -1 || itemcode.value == ''))) {
                    elem.style.display = '';
                }else {
                    elem.style.display = 'none';
                }
            }else {
                elem.style.display = '';
            }
        });
    };

    if (e.target && e.target.id == 'selectAll') {
        //console.log('Hitting listener.');
        const selectButton = document.querySelectorAll('.selectButton');
        const dataRow = document.querySelectorAll('.data-row');
        let count = 0;
        console.log('working: ', e.target.checked);

            if (e.target.checked) {
                selected = [];
                dataRow.forEach(elem => {
                      //console.log('elem.children: ', elem.children[0].children[0]);
                    if(elem.style.display != 'none') {
                        selected.push({
                            "shipto": elem.getAttribute('data-shipto'),
                            "itemcode": elem.getAttribute('data-item-code'),
                            "tagnumber": elem.getAttribute('data-tag-number')
                        });
                        elem.children[0].children[0].children[0].checked = true
                    }
                });
               // selectButton.checked = true;
            }else {
                selected = [];
                console.log('Inside else statement', selectButton);
                selectButton.forEach(elem => {
                    console.log('This is the element: ', elem);
                    elem.checked = false;
                });
                //selectButton.checked = false;
            }
        // if (e.target.checked) {
        //     selected = [];
        //     selectButton.forEach(elem => {
        //         let count = 0;
        //         if (count == 0) {
        //             console.log(`Elem tag: ${elem.style.display != 'none'}`);
        //             count++;
        //         }
        //         if(elem.style.display != 'none') {
        //             selected.push(elem.value);
        //             elem.checked = true;
        //         }
        //     });
        //    // selectButton.checked = true;
        // }else {
        //     selected = [];
        //     selectButton.forEach(elem => {
        //         elem.checked = false;
        //     });
        //     //selectButton.checked = false;
        // }
    }
});







