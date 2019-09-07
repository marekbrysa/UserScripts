// ==UserScript==
// @name        GitHub Commit Compare
// @namespace   https://github.com/jerone/UserScripts
// @description Add controls to compare commits.
// @author      jerone
// @contributor darkred
// @copyright   2017+, jerone (http://jeroenvanwarmerdam.nl)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage    https://github.com/jerone/UserScripts/tree/master/GitHub_Commit_Compare
// @homepageURL https://github.com/jerone/UserScripts/tree/master/GitHub_Commit_Compare
// @downloadURL https://github.com/jerone/UserScripts/raw/master/GitHub_Commit_Compare/GitHub_Commit_Compare.user.js
// @updateURL   https://github.com/jerone/UserScripts/raw/master/GitHub_Commit_Compare/GitHub_Commit_Compare.user.js
// @supportURL  https://github.com/jerone/UserScripts/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCYMHWQ7ZMBKW
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @include     https://github.com/*/*/commits
// @include     https://github.com/*/*/commits/*
// @exclude     https://github.com/*/*.diff
// @exclude     https://github.com/*/*.patch
// @version     0.0.3
// @grant       none
// ==/UserScript==

(function () {

  function addButton() {
    var nav;
    if ((nav = document.querySelector('#commits_bucket'))) {

      // Check if our group of buttons are already attached.
      // Remove it, as the 'old' buttons don't have events anymore.
      const oldCompareGroup = document.getElementById('GitHubCommitCompareGroup');
      if (oldCompareGroup) {
        oldCompareGroup.parentElement.removeChild(oldCompareGroup);
      }
      Array.from(document.querySelectorAll('.GitHubCommitCompareButtonAB')).forEach(function (oldCompareRadioGroup) {
        oldCompareRadioGroup.parentElement.removeChild(oldCompareRadioGroup);
      });

      const checkboxEnable = document.createElement('input');
      checkboxEnable.type = 'checkbox';
      checkboxEnable.addEventListener('change',
        function () {
          const compareRadioGroup = document.querySelectorAll('.GitHubCommitCompareButtonAB');
          if (this.checked) {
            // add or show radios
            if (compareRadioGroup.length === 0) {
              addCompareRadios();
            } else {
              Array.from(compareRadioGroup).forEach(function (b) {
                b.classList.remove('d-none');
              });
            }
          } else {
            // hide radios
            Array.from(compareRadioGroup).forEach(function (b) {
              b.classList.add('d-none');
            });
          }
          const compareButton = document.getElementById('GitHubCommitCompareButton');
          if (compareButton) compareButton.classList.remove('disabled');
        });

      const label = document.createElement('label');
      label.classList.add('tooltipped', 'tooltipped-n');
      label.setAttribute('aria-label', 'Show commit compare buttons');
      label.style.cssText = `
        float: left;
        padding: 3px 10px;
        font-size: 12px;
        font-weight: 600;
        line-height: 20px;
        color: #24292e;
        vertical-align: middle;
        background-color: #fff;
        border: 1px solid rgba(27,31,35,0.2);
        border-right: 0;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      `;
      label.appendChild(checkboxEnable);

      const iconSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      iconSvgPath.setAttributeNS(null,
        'd',
        'M5 12H4c-.27-.02-.48-.11-.69-.31-.21-.2-.3-.42-.31-.69V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V11c.03.78.34 1.47.94 2.06.6.59 1.28.91 2.06.94h1v2l3-3-3-3v2zM2 1.8c.66 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm11 9.48V5c-.03-.78-.34-1.47-.94-2.06-.6-.59-1.28-.91-2.06-.94H9V0L6 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0 0 12 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z');

      const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      iconSvg.classList.add('octicon', 'octicon-diff');
      iconSvg.setAttributeNS(null, 'height', 16);
      iconSvg.setAttributeNS(null, 'width', 14);
      iconSvg.setAttributeNS(null, 'viewBox', '0 0 14 16');
      iconSvg.appendChild(iconSvgPath);

      const compareButton = document.createElement('a');
      compareButton.id = 'GitHubCommitCompareButton';
      compareButton.classList.add('btn', 'btn-sm', 'tooltipped', 'tooltipped-n', 'disabled');
      compareButton.setAttribute('href', '#');
      compareButton.setAttribute('rel', 'nofollow');
      compareButton.setAttribute('aria-label', 'Compare these commits');
      compareButton.style.cssText = `
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
      `;
      compareButton.appendChild(iconSvg);
      compareButton.appendChild(document.createElement("span"));

      const compareGroup = document.createElement('div');
      compareGroup.id = 'GitHubCommitCompareGroup';
      compareGroup.setAttributeNS(null, 'style', 'text-align: right;');
      const compareGroupContainer = document.createElement('div');
      compareGroupContainer.setAttributeNS(null, 'style', 'display: inline-block;');
      compareGroup.appendChild(compareGroupContainer);
      compareGroupContainer.appendChild(label);
      compareGroupContainer.appendChild(compareButton);

      nav.prepend(compareGroup);
    }
  }

  function updateRadioButtons() {
    let compareAdisabled = true;
    let compareBdisabled = false;

    const compares = document.querySelectorAll('.GitHubCommitCompareButtonAB');
    Array.from(compares).forEach(function (compare) {
      const compareA = compare.querySelector('[name="GitHubCommitCompareButtonA"]');
      const compareB = compare.querySelector('[name="GitHubCommitCompareButtonB"]');

      compareA.disabled = compareAdisabled;
      compareA.parentNode.classList.toggle('disabled', compareAdisabled);

      if (compareA.checked) {
        compareBdisabled = true;
      }
      if (compareB.checked) {
        compareAdisabled = false;
      }

      compareB.disabled = compareBdisabled;
      compareB.parentNode.classList.toggle('disabled', compareBdisabled);
    });

    updateCompareButton();
  }

  function updateCompareButton() {
    const repo = document.querySelector('meta[property="og:url"]').content;

    const compareA = document.querySelector('.GitHubCommitCompareButtonAB [name="GitHubCommitCompareButtonA"]:checked');
    const hashA = compareA.parentNode.parentNode.parentNode.querySelector('clipboard-copy').value;
    const compareB = document.querySelector('.GitHubCommitCompareButtonAB [name="GitHubCommitCompareButtonB"]:checked');
    const hashB = compareB.parentNode.parentNode.parentNode.querySelector('clipboard-copy').value;

    const a = document.getElementById('GitHubCommitCompareButton');
    a.setAttribute('href', `${repo}/files/${hashB}..${hashA}`);
    a.querySelector('span').textContent = ` ${hashB.substring(0, 7)}..${hashA.substring(0, 7)}`;
  }

  function addCompareRadios() {
    const commits = document.querySelectorAll('.commits-list-item .commit-links-cell');
    Array.from(commits).forEach(function (item, index) {
      const radioA = document.createElement('input');
      radioA.name = 'GitHubCommitCompareButtonA';
      radioA.type = 'radio';
      radioA.addEventListener('change', updateRadioButtons);
      if (index === 1) radioA.checked = true;

      const labelA = document.createElement('label');
      labelA.classList.add('btn', 'btn-outline', 'BtnGroup-item', 'tooltipped', 'tooltipped-s');
      labelA.setAttribute('aria-label', 'Choose a head commit');
      labelA.appendChild(radioA);

      const radioB = document.createElement('input');
      radioB.name = 'GitHubCommitCompareButtonB';
      radioB.type = 'radio';
      radioB.addEventListener('change', updateRadioButtons);
      if (index === 0) radioB.checked = true;

      const labelB = document.createElement('label');
      labelB.classList.add('btn', 'btn-outline', 'BtnGroup-item', 'tooltipped', 'tooltipped-s');
      labelB.setAttribute('aria-label', 'Choose a base commit');
      labelB.appendChild(radioB);

      const compareRadioGroup = document.createElement('div');
      compareRadioGroup.classList.add('GitHubCommitCompareButtonAB', 'commit-links-group', 'BtnGroup');
      compareRadioGroup.appendChild(labelB);
      compareRadioGroup.appendChild(labelA);

      if (item.querySelector('.muted-link')) { // Insert after number of comments button.
        item.insertBefore(compareRadioGroup, item.querySelector('.muted-link').nextSibling);
      } else {
        item.insertBefore(compareRadioGroup, item.firstChild);
      }
    });

    updateRadioButtons(); // Update radio buttons.
  }

  // Init.
  addButton();

  // Pjax.
  document.addEventListener('pjax:end', addButton);

})();

