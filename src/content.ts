// @ts-ignore
import position from "selection-position";

// Copied code from https://stackoverflow.com/questions/4712310/javascript-how-to-detect-if-a-word-is-highlighted 
const getSelectedText = () => {
    let text = "";
    if (typeof window.getSelection() != "undefined") {
        text = window.getSelection()!.toString();
    } else if (typeof document.getSelection() != "undefined" && document.getSelection()!.type == "Text") {
        text = document.getSelection()!.toString();
    }
    return text;
}

function replaceSelectedText(replacementText: string) {
    var sel: Selection, range: Range;
    if (window.getSelection) {
        sel = window.getSelection()!;
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    }
    //  else if (document.getSelection() && document.getSelection()!.createRange()) {
    //     range = document.getSelection()!.createRange();
    //     range.text = replacementText;
    // }
}

// TODO: set up react to clean up this spaghetti 
const div = document.createElement('div');
div.setAttribute('style', `
    z-index: 999; 
    position: fixed; 
    display: none;
    background-color: white;
    border-radius: 5px;
    padding: 5px;
    minWidth: 200px;
`);
div.onblur = () => {
    console.log('blur');
    div.style.display = 'none';
}
div.innerHTML = "Loading...";
document.body.appendChild(div);

const handler = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.altKey && event.key === 'e') {
        event.preventDefault();
        const selectedText = getSelectedText();
        if (selectedText) {
            const {bottom, left} = position();
            div.style.top = `${bottom}px`;
            div.style.left = `${left}px`;
            div.style.display = 'block';
            div.innerHTML = "Loading...";
            (async () => {
                const response = await chrome.runtime.sendMessage({text: selectedText});
                div.innerHTML = '';
                for (const text of response) {
                    const button = document.createElement('button');
                    button.setAttribute('style', `
                        border: none; 
                        background-color: white; 
                        width: 100%;
                    `);
                    button.onmouseenter = () => button.style.backgroundColor = 'lightblue';
                    button.onmouseleave = () => button.style.backgroundColor = 'white';
                    button.innerText = text;
                    button.onclick = () => {
                        replaceSelectedText(text);
                        div.style.display = 'none';
                    };
                    div.appendChild(button);
                    div.appendChild(document.createElement('br'))
                }
            })();
        }
    }
}

document.addEventListener('keydown', handler, true);

// FOR GOOGLE DOCS: TODO this is very frustrating to work with
var editingIFrame = document.querySelectorAll('iframe.docs-texteventtarget-iframe')[0];
if (editingIFrame) {
    // Based on https://stackoverflow.com/questions/40435556/chrome-extension-detecting-keypresses-in-google-docs
    // @ts-ignore 
    editingIFrame.contentDocument.addEventListener("keydown", handler, false);
}