chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    enabled: true,
    boldVowels: true,
    boldFirstLetter: false,
    intensity: 700
  });
});
