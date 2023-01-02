/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/selection-position/index.js":
/*!**************************************************!*\
  !*** ./node_modules/selection-position/index.js ***!
  \**************************************************/
/***/ ((module) => {

/**
 * cross-browser selected text bounding-client-rect.
 *
 * @return {Object}
 */

module.exports = function() {

  if (window.getSelection) {
    var selection = window.getSelection();
    if (!selection.rangeCount) return;

    var range = selection.getRangeAt(0);

    if (!range.collapsed){
      return range.getBoundingClientRect();
    }

    // if we only have a cursor, then we need to insert
    // a dummy element and see what's what.
    var dummy = document.createElement('span');
    range.insertNode(dummy);
    var pos = dummy.getBoundingClientRect();
    dummy.parentNode.removeChild(dummy);
    return pos;
  }

  if (document.selection) {
    return document.selection
      .createRange()
      .getBoundingClientRect();
  }
};


/***/ }),

/***/ "./src/content.ts":
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// @ts-ignore
var selection_position_1 = __importDefault(__webpack_require__(/*! selection-position */ "./node_modules/selection-position/index.js"));
// Copied code from https://stackoverflow.com/questions/4712310/javascript-how-to-detect-if-a-word-is-highlighted 
var getSelectedText = function () {
    var text = "";
    if (typeof window.getSelection() != "undefined") {
        text = window.getSelection().toString();
    }
    else if (typeof document.getSelection() != "undefined" && document.getSelection().type == "Text") {
        text = document.getSelection().toString();
    }
    return text;
};
function replaceSelectedText(replacementText) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
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
var bubble = document.createElement('div');
var bubbleHeader = document.createElement('div');
var bubbleBody = document.createElement('div');
bubble.setAttribute('style', "\n    z-index: 999; \n    position: fixed; \n    display: none;\n    background-color: white;\n    border-radius: 10px;\n    width: 700px;\n    overflow: hidden;\n");
bubbleHeader.innerHTML = "<h3 style=\"padding: 0 5px; margin: 10px;\">Suggestions</h3>";
bubbleBody.innerHTML = "<div style=\"padding: 10px; margin: 10px;\">Loading...</div>";
document.onclick = function (event) {
    var targetElement = event.target;
    do {
        if (targetElement == bubble) {
            return;
        }
        targetElement = targetElement.parentElement;
    } while (targetElement);
    bubble.style.display = 'none';
};
bubble.appendChild(bubbleHeader);
bubble.appendChild(bubbleBody);
document.body.appendChild(bubble);
var handler = function (event) {
    if (event.ctrlKey && event.altKey && event.key === 'e') {
        event.preventDefault();
        var selectedText_1 = getSelectedText();
        if (selectedText_1) {
            var _a = (0, selection_position_1.default)(), bottom = _a.bottom, left = _a.left;
            bubble.style.top = "".concat(bottom, "px");
            bubble.style.left = "".concat(left, "px");
            bubble.style.display = 'block';
            bubbleBody.innerHTML = "<div style=\"padding: 10px; margin: 10px;\">Loading...</div>";
            (function () { return __awaiter(void 0, void 0, void 0, function () {
                var response, _loop_1, _i, response_1, text;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, chrome.runtime.sendMessage({ text: selectedText_1 })];
                        case 1:
                            response = _a.sent();
                            bubbleBody.innerHTML = '';
                            _loop_1 = function (text) {
                                var button = document.createElement('button');
                                button.setAttribute('style', "\n                        border: none; \n                        background-color: white; \n                        text-align: left;\n                        width: 100%;\n                        padding: 10px;\n                    ");
                                button.onmouseenter = function () { return button.style.backgroundColor = 'lightblue'; };
                                button.onmouseleave = function () { return button.style.backgroundColor = 'white'; };
                                button.innerText = text;
                                button.onclick = function () {
                                    replaceSelectedText(text);
                                    bubble.style.display = 'none';
                                };
                                bubbleBody.appendChild(button);
                                bubbleBody.appendChild(document.createElement('br'));
                            };
                            for (_i = 0, response_1 = response; _i < response_1.length; _i++) {
                                text = response_1[_i];
                                _loop_1(text);
                            }
                            return [2 /*return*/];
                    }
                });
            }); })();
        }
    }
};
document.addEventListener('keydown', handler, true);
// FOR GOOGLE DOCS: TODO this is very frustrating to work with
var editingIFrame = document.querySelectorAll('iframe.docs-texteventtarget-iframe')[0];
if (editingIFrame) {
    // Based on https://stackoverflow.com/questions/40435556/chrome-extension-detecting-keypresses-in-google-docs
    // @ts-ignore 
    editingIFrame.contentDocument.addEventListener("keydown", handler, false);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/content.ts");
/******/ 	
/******/ })()
;