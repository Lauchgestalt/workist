// ==UserScript==
// @name         Correction Checkmarks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Jonas Perkams
// @match        https://wb.workist.com/job/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workist.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var corrections;

    function init(){
        corrections = document.querySelectorAll('.correction');
        if (corrections.length > 0) {
            for(let i = 0; i < corrections.length; i++){
                let checkmark = document.createElement('INPUT');
                checkmark.setAttribute("type", "checkbox");
                checkmark.addEventListener('click', function(){event.stopPropagation();})
                corrections[i].prepend(checkmark);
            }

            let checkBtn = document.createElement('button');
            let div = document.querySelector('.word-annotator__corrections');
            checkBtn.innerHTML = "Copy Results";
            checkBtn.addEventListener('click', function(){copyResults();})
            div.append(checkBtn);
        } else {setTimeout(init, 0);}
    }

    function copyResults(){
        var results = [];
        var resultString = "";
        var jobID = document.location.href.substr(document.location.href.lastIndexOf('/') + 1);
        for(let i = 0; i < corrections.length; i++){
            let checkbox = corrections[i].firstChild;
            if(checkbox.checked){
                results.push(jobID + ", " + corrections[i].children[1].innerHTML.replace(/\s/g, ''));
            }
        }
        for(let i = 0; i < results.length; i++){
            resultString += results[i] + "\n";
        }

        navigator.clipboard.writeText(resultString);
        alert("Copied results to Clipboard. Paste into Google Sheet, select dropdown, split into columns");
    }

    init();
})();
