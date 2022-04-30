// ==UserScript==
// @name         Correction Checkmarks
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Jonas Perkams
// @match        https://wb.workist.com/job/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workist.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var corrections;
    var setMarks = true;
    var checked = [];
    var initDone = false;

    //Want to invert the "Can model do it?"-assessment? Change this. (Default: false)
    var invert = false;

    var x = new MutationObserver(function (e) {
        if (e[0].removedNodes.length > 0 && (e[0].removedNodes[0].className == 'word-annotator__correction correction' || e[0].removedNodes[0].className == "assistance__main")) {
            try {
                document.getElementById("checkBtn").remove();
            } catch {
                console.log("No button to delete!");
            }
            setMarks = !setMarks;
            if(setMarks) init();
        }
    });

    function init(){
        corrections = document.querySelectorAll('.correction');
        let checkBtn = document.getElementById("checkBtn");
        if (corrections.length > 0) {
            for(let i = 0; i < corrections.length; i++){
                let checkmark = document.createElement('INPUT');
                if (!initDone) {
                    checked[i] = false;
                } else if (checked[i]) {
                    checkmark.checked = true;
                }
                checkmark.setAttribute("type", "checkbox");
                checkmark.id = i;
                checkmark.classList = "correctionCheck";
                checkmark.addEventListener('click', function(){event.stopPropagation();})
                checkmark.addEventListener('change', (event) => {
                    if (event.currentTarget.checked) {
                        checked[parseInt(event.srcElement.id)] = true;
                    } else {
                        checked[parseInt(event.srcElement.id)] = false;
                    }
                })
                corrections[i].prepend(checkmark);
            }

            let checkBtn = document.createElement('button');
            let div = document.querySelector('.word-annotator__corrections');
            checkBtn.innerHTML = "Copy Results";
            checkBtn.id = "checkBtn"
            checkBtn.addEventListener('click', function(){copyResults();})
            div.append(checkBtn);

            let toObserve = document.querySelector('.page__inner').children[1];
            x.observe(document.querySelector('.word-annotator__corrections'), { childList: true });
            x.observe(toObserve, { childList: true });
            initDone = true;
        } else {setTimeout(init, 100);}
    }

    function copyResults(){
        var resultsChecked = [];
        var resultsUnchecked = [];
        var resultString = "";
        var jobID = document.location.href.substr(document.location.href.lastIndexOf('/') + 1);
        for(let i = 0; i < corrections.length; i++){
            let checkbox = corrections[i].firstChild;
            if(checkbox.checked){
                invert ? resultsChecked.push(jobID + ", " + corrections[i].children[1].innerHTML.replace(/\s/g, '') + ", " + invert) : resultsChecked.push(jobID + ", " + corrections[i].children[1].innerHTML.replace(/\s/g, '') + ", " + !invert);
            } else {
                invert ? resultsUnchecked.push(jobID + ", " + corrections[i].children[1].innerHTML.replace(/\s/g, '') + ", " + !invert) : resultsUnchecked.push(jobID + ", " + corrections[i].children[1].innerHTML.replace(/\s/g, '') + ", " + invert);
            }
        }
        for(let i = 0; i < resultsChecked.length; i++){
            resultString += resultsChecked[i] + "\n";
        }
        for(let i = 0; i < resultsUnchecked.length; i++){
            resultString += resultsUnchecked[i] + "\n";
        }

        navigator.clipboard.writeText(resultString);
        alert("Copied results to Clipboard. Paste into Google Sheet, select dropdown, split into columns");
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('.correctionCheck { transform: scale(1.5); }');



    init();
})();
