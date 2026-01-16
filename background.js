chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    enabled: true,
    mode: "vowels", // "vowels" | "first-letter"
    intensity: 700
  });
});
