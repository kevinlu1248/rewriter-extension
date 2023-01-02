chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text) {
        console.log(request.text);
        (async () => {
            const response = await fetch('https://rewriter-api.herokuapp.com/', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text: request.text, n: 3})
            });
            sendResponse(await response.json());
        })();
    }
    return true;
})