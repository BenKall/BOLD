const VOWEL_REGEX = /[aeiouAEIOU]/g;

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

function boldVowelsInTextNode(textNode) {
  if (shouldSkipNode(textNode)) return;

  const text = textNode.nodeValue;
  if (!text || !VOWEL_REGEX.test(text)) return;

  const span = document.createElement("span");
  span.innerHTML = text.replace(
    VOWEL_REGEX,
    (match) => `<strong>${match}</strong>`
  );

  textNode.parentNode.replaceChild(span, textNode);
}

function processPage() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  const textNodes = [];

  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  textNodes.forEach(boldVowelsInTextNode);
}

processPage();
