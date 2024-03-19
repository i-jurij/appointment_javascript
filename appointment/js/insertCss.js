export function insertCss() {
    document.getElementsByTagName('head')[0].insertAdjacentHTML(
        'beforeend',
        '<link rel="stylesheet" href="appointment/css/style.css" />');
}
