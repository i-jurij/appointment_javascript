import { FormConfig, Common } from "./importExport.js";
export function modalAlert(message_string) {
    var newDiv = document.createElement('div');
    newDiv.classList.add('modal')
    newDiv.id = "alert"
    newDiv.innerHTML = '<div><p>' + message_string + '</p><button id="alert_ok">OK</button></div>';
    // Добавляем только что созданный элемент в дерево DOM
    let my_div;
    if (!!Common.divMonth) {
      my_div = Common.divMonth
    }
    if (!!Common.divShort) {
      my_div = Common.divShort
    }
    //document.body.insertBefore(newDiv, my_div);
    document.querySelector('#'+FormConfig.divForTimeChoiceId).parentNode.insertBefore(newDiv, my_div);
    // setup body no scroll
    document.body.style.overflow = 'hidden';

    let but = document.getElementById('alert_ok')
    but.focus()
    but.addEventListener('click', function (ev) {
      newDiv.remove()
      // setup body scroll
      document.body.style.overflow = 'visible';
    })
  }