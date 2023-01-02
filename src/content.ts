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
const bubble = document.createElement('div');
const bubbleHeader = document.createElement('div');
const bubbleBody = document.createElement('div');
bubble.setAttribute('style', `
    z-index: 999; 
    position: fixed; 
    display: none;
    background-color: white;
    border-radius: 10px;
    width: 700px;
    overflow: hidden;
`);
bubbleHeader.innerHTML = `<h3 style="padding: 0 5px; margin: 10px;">Suggestions</h3>`;
bubbleBody.innerHTML = `<div style="padding: 10px; margin: 10px;">Loading...</div>`;
document.onclick = (event) => {
    let targetElement = event.target as HTMLElement;
    do {
        if (targetElement == bubble) {
            return;
        }
        targetElement = targetElement.parentElement!;
    } while (targetElement);
    bubble.style.display = 'none';
}
bubble.appendChild(bubbleHeader);
bubble.appendChild(bubbleBody);
document.body.appendChild(bubble);

const handler = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.altKey && event.key === 'e') {
        event.preventDefault();
        const selectedText = getSelectedText();
        if (selectedText) {
            const {bottom, left} = position();
            bubble.style.top = `${bottom}px`;
            bubble.style.left = `${left}px`;
            bubble.style.display = 'block';
            bubbleBody.innerHTML = `<div style="padding: 10px; margin: 10px;">Loading...</div>`;
            (async () => {
                const response = await chrome.runtime.sendMessage({text: selectedText});
                bubbleBody.innerHTML = '';
                for (const text of response) {
                    const button = document.createElement('button');
                    button.setAttribute('style', `
                        border: none; 
                        background-color: white; 
                        text-align: left;
                        width: 100%;
                        padding: 10px;
                    `);
                    button.onmouseenter = () => button.style.backgroundColor = 'lightblue';
                    button.onmouseleave = () => button.style.backgroundColor = 'white';
                    button.innerText = text;
                    button.onclick = () => {
                        replaceSelectedText(text);
                        bubble.style.display = 'none';
                    };
                    bubbleBody.appendChild(button);
                    bubbleBody.appendChild(document.createElement('br'))
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