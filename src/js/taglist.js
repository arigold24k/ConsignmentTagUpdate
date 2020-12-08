const electron = require('electron');
const {ipcRenderer, remote} = electron;
const orm = require('../orm/orcleORM');
var selectedTags = [];

document.addEventListener("DOMContentLoaded", async () => {
    //have to initialize the modal
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);

    //setting options object and grabbing current window
    var options = {};
    var tagWindow = remote.getCurrentWindow();

    //setting error modal to a variable
    const elemError = document.getElementById('errorModal');
    const instanceError = M.Modal.getInstance(elemError);

    //setting success modal to a variable
    const elemSucces = document.getElementById('successModal');
    const instanceSuccess = M.Modal.getInstance(elemSucces);

    //setting success modal to a variable
    const elemConfirm = document.getElementById('confirmModal');
    const instanceConfirm = M.Modal.getInstance(elemConfirm);

    //ipcRenderer useed to catch from the main.js page
    ipcRenderer.on('update:tags', (e, res) => {
        console.log('Hitting Taglist page: ', res);
        selectedTags = res;

        const dataTable = document.querySelector('tbody');
        for (let i = 0; i < selectedTags.length; i++) {
          let newRow = document.createElement('tr');
          let keys_ = Object.keys(selectedTags[i]);
          for (let j = 0; j < keys_.length; j++) {
              let newData = document.createElement('td');
              newData.innerText = selectedTags[i][keys_[j]];

              newRow.append(newData);
              newData = null;
          }
          dataTable.append(newRow);
          newRow = null;
        };


    });

    //coding managing the flow once submit button is pressed
    let submitButton = document.getElementById('update-po');
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Hitting the update po');
        let count = 0;
        let tagList = document.createElement('ul');
        if (document.getElementById('po-number').value == '') {
                // alert('Please provide a PO Number.');
            document.getElementById('po-number').focus();
        }else{

                let selected_text = '';
                if(selectedTags){
                    for (let i = 0; i < selectedTags.length; i++) {
                        let listItem = document.createElement('li');
                        let textNode = document.createTextNode(selectedTags[i].tagnumber);
                        listItem.appendChild(textNode);
                        tagList.appendChild(listItem);
                        if (count == 0) {
                            selected_text = selected_text + selectedTags[i].tagnumber;
                            count++;
                        }else {
                            selected_text = selected_text+ ', ' + selectedTags[i].tagnumber;
                        }
                    }
                }
                //using modal instead of confrim from javascript
                let confirmContent = document.getElementById('confirm-content');
                confirmContent.innerHTML = '';
                let confirmData = document.createElement('p');
                //confirmData.innerText = `Want to updated Tags: ${selected_text} with PO Number: ${document.getElementById('po-number').value}`;
                confirmData.innerText = `Applying PO Number: ${document.getElementById('po-number').value} to the Tags below:`;
                document.getElementById('confirm-content').append(confirmData);
                document.getElementById('confirm-content').append(tagList);
                instanceConfirm.open();


                //selected tags is an object of items
                // if(confirm(`Want to updated Tags: ${selected_text} with PO Number: ${document.getElementById('po-number').value}`)) {
                //     orm.update_po_num({
                //         'po_number': document.getElementById('po-number').value,
                //         'tags': selectedTags
                //     },(err, res) => {
                //         console.log("return of the update po num ", err);
                //         if (err) {
                //             instanceError.open();
                //             // alert("Failed to Upload, please try again")
                //         }else{
                //             instanceSuccess.open()
                //
                //         }
                //     })
                // }
        }
    });

    let okErrorButton = document.getElementById('modal-error-ok');
    okErrorButton.addEventListener('click', (e) => {
        e.preventDefault();
        instanceError.close();
        //tagWindow.close();
    });

    let okSuccessButton = document.getElementById('modal-success-ok');
    okSuccessButton.addEventListener('click', (e) => {
        e.preventDefault();
        instanceSuccess.close();
        tagWindow.close();
    });


    let okConfirmButton = document.getElementById('modal-confirm-ok');
    okConfirmButton.addEventListener('click', (e) => {
        e.preventDefault();
        //CLOSE THE CONFIRM MODAL
        instanceConfirm.close();
        console.log();
        //updating tags if user presses okay
        orm.update_po_num({
            'po_number': document.getElementById('po-number').value,
            'tags': selectedTags
        },(err, res) => {
            console.log("return of the update po num ", err);
            if (err) {
                instanceError.open();
                // alert("Failed to Upload, please try again")
            }else{
                instanceSuccess.open()
            }
        });
    });

    let cancelConfirmButton = document.getElementById('modal-confirm-cancel');
    cancelConfirmButton.addEventListener('click', (e) => {
        e.preventDefault();
        instanceConfirm.close();
    });
});




