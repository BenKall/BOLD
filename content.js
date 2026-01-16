const STYLE_ID = "bold-reading-style";
const MARKER_ATTR = "data-reading-boost";

function injectStyle(weight) {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    .bold-reading {
      font-weight: ${weight};
    }
  `;
}

function shouldSkipNode(node) {
  const parent = node.parentNode;
  if (!parent) return true;

  if (parent.hasAttribute?.(MARKER_ATTR)) return true;

  const tag = parent.nodeName;
  return (
    tag === "SCRIPT" ||
    tag === "STYLE" ||
    tag === "TEXTAREA" ||
    tag === "INPUT" ||
    tag === "CODE" ||
    tag === "PRE" ||
    parent.isContentEditable
  );
}

function resetPage() {
  document
    .querySelectorAll(`[${MARKER_ATTR}]`)
    .forEach(el => {
      el.replaceWith(document.createTextNode(el.textContent));
    });
}

function transformText(text, settings) {
  let result = text;

  if (settings.boldFirstLetter) {
    result = result.replace(/\b([a-zA-Z])/g, m =>
      `<span class="bold-reading">${m}</span>`
    );
  }

  if (settings.boldVowels) {
    result = result.replace(/[aeiouAEIOU]/g, m =>
      `<span class="bold-reading">${m}</span>`
    );
  }

  return result;
}

function processPage(settings) {
  injectStyle(settings.intensity);

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  const nodes = [];
  let node;

  while ((node = walker.nextNode())) {
    nodes.push(node);
  }

  nodes.forEach(textNode => {
    if (shouldSkipNode(textNode)) return;

    const text = textNode.nodeValue;
    if (!text) return;

    if (!settings.enabled) return;

    const span = document.createElement("span");
    span.setAttribute(MARKER_ATTR, "true");
    span.innerHTML = transformText(text, settings);

    textNode.parentNode.replaceChild(span, textNode);

  });
}

function applySettings() {
  chrome.storage.sync.get(
    {
      enabled: true,
      boldVowels: true,
      boldFirstLetter: true,
      intensity: 700
    },
    settings => {
      injectStyle(settings.intensity);

      if (!settings.enabled) {
        resetPage();
        return;
      }

      processPage(settings);
    }
  );
}

applySettings();

chrome.storage.onChanged.addListener(applySettings);

const observer = new MutationObserver(applySettings);
observer.observe(document.body, { childList: true, subtree: true });
