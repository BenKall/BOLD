const STYLE_ID = "bold-reading-style";

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

function transformText(text, mode) {
  if (mode === "vowels") {
    return text.replace(/[aeiouAEIOU]/g, m =>
      `<span class="bold-reading">${m}</span>`
    );
  }

  if (mode === "first-letter") {
    return text.replace(/\b([a-zA-Z])/g, m =>
      `<span class="bold-reading">${m}</span>`
    );
  }

  return text;
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

    const span = document.createElement("span");
    span.innerHTML = settings.enabled
      ? transformText(text, settings.mode)
      : text;

    textNode.parentNode.replaceChild(span, textNode);
  });
}

function applySettings() {
  chrome.storage.sync.get(["enabled", "mode", "intensity"], settings => {
    processPage(settings);
  });
}

applySettings();

chrome.storage.onChanged.addListener(applySettings);

const observer = new MutationObserver(applySettings);
observer.observe(document.body, { childList: true, subtree: true });
