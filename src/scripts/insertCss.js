export function insertCss(FormConfig, styleText) {
    /*
    document.getElementsByTagName('head')[0].insertAdjacentHTML(
        'beforeend',
        '<link rel="stylesheet" href="appointment/css/style.css" />');
    */
    let style = document.createElement("style");
    let text = document.createTextNode(styleText);
    style.appendChild(text);
    //document.head.appendChild(style);
    let tagForInsertStyle = document.querySelector(FormConfig.appointmentTag);
    if (tagForInsertStyle) {
        tagForInsertStyle.appendChild(style);
    }
}
