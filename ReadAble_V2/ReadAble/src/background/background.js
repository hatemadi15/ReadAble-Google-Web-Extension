// This file contains the background service worker logic for handling API calls and managing extension events.

const DEEPSEEK_API_KEY = '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';
const WORDS_API_KEY = '49271852f8msh0708f6bec15a253p1d8d3fjsnc4272774025e';

chrome.runtime.onInstalled.addListener(() => {
    console.log('ReadAble extension installed.');

    chrome.storage.sync.set({
        fontFamily: 'Arial',
        letterSpacing: 0,
        lineHeight: 1.5,
        theme: 'default'
    });
});

// Handle API calls for text simplification
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'simplifyText') {
        const textToSimplify = request.text;

        fetch('https://api.deepseek.com/simplify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: textToSimplify })
        })
        .then(response => response.json())
        .then(data => {
            sendResponse({ simplifiedText: data.simplifiedText });
        })
        .catch(error => {
            console.error('Error simplifying text:', error);
            sendResponse({ error: 'Failed to simplify text.' });
        });

        return true; // Keep the message channel open for sendResponse
    }

    // Handle vocabulary definitions
    if (request.action === 'fetchDefinition') {
        const word = request.word;

        fetch(`https://wordsapi.com/api/v1/words/${word}/definitions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${WORDS_API_KEY}`
            }
        })
        .then(response => response.json())
        .then(data => {
            sendResponse({ definition: data.definitions });
        })
        .catch(error => {
            console.error('Error fetching definition:', error);
            sendResponse({ error: 'Failed to fetch definition.' });
        });

        return true; // Keep the message channel open for sendResponse
    }

    if (request.type === 'getPreferences') {
        chrome.storage.sync.get(null, (items) => {
            sendResponse(items);
        });
        return true;
    }
});