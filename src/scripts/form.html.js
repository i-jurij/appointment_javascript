/*
<form name="zapis_usluga_form" id="zapis_usluga_form">
    <div id="time_choice"></div>
    <div class="hor_center buts" id="buttons_div">
      <button type="button" class="but" id="zapis_usluga_form_res" disabled />Сбросить</button>
      <button type="button" class="but" id="zapis_usluga_form_sub" disabled />Готово</button>
    </div>
  </form>
  */

export function printForm(FormConfig) {
  const TAG_FOR_FORM = document.querySelector(FormConfig.appointmentTag);
  if (TAG_FOR_FORM) {
    let zapis_usluga_form = document.createElement('FORM');
    //zapis_usluga_form.action = FormConfig.formAction;
    zapis_usluga_form.id = FormConfig.formId;
    zapis_usluga_form.name = FormConfig.formId;
    zapis_usluga_form.method = FormConfig.formMethod;
    /*
      my_tb=document.createElement('INPUT');
      my_tb.type='HIDDEN';
      my_tb.name='hidden1';
      my_tb.value='Values of my hidden1';
      my_form.appendChild(my_tb);
    */
    let divForTimeChoiceId = document.createElement('DIV');
    divForTimeChoiceId.id = FormConfig.divForTimeChoiceId;

    let buttons_div = document.createElement('DIV');
    buttons_div.className = FormConfig.buttonsDivClassName;
    buttons_div.id = FormConfig.buttonsDivId;

    let but_subm = document.createElement('BUTTON');
    but_subm.type = 'button';
    but_subm.className = FormConfig.buttonsSubmitClassName;
    but_subm.id = FormConfig.buttonSubmitId;
    but_subm.disabled = true;
    let but_subm_text = document.createTextNode(FormConfig.buttonSubmitText);
    but_subm.appendChild(but_subm_text);

    buttons_div.appendChild(but_subm);

    let but_res = document.createElement('BUTTON');
    but_res.type = 'button';
    but_res.className = FormConfig.buttonsResetClassName;
    but_res.id = FormConfig.buttonResetId;
    but_res.disabled = true;
    let but_res_text = document.createTextNode(FormConfig.buttonResetText);
    but_res.appendChild(but_res_text);

    buttons_div.appendChild(but_res);
    buttons_div.appendChild(but_subm);

    zapis_usluga_form.appendChild(divForTimeChoiceId);
    zapis_usluga_form.appendChild(buttons_div);

    TAG_FOR_FORM.appendChild(zapis_usluga_form);
  }
}
