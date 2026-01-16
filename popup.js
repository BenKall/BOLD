document.addEventListener("DOMContentLoaded", () => {
  const enabled = document.getElementById("enabled");
  const boldVowels = document.getElementById("boldVowels");
  const boldFirstLetter = document.getElementById("boldFirstLetter");
  const intensity = document.getElementById("intensity");

  chrome.storage.sync.get(
    {
      enabled: true,
      boldVowels: true,
      boldFirstLetter: false,
      intensity: 700
    },
    settings => {
      enabled.checked = settings.enabled;
      boldVowels.checked = settings.boldVowels;
      boldFirstLetter.checked = settings.boldFirstLetter;
      intensity.value = settings.intensity;
    }
  );

  enabled.addEventListener("change", () => {
    chrome.storage.sync.set({ enabled: enabled.checked });
  });

  boldVowels.addEventListener("change", () => {
    chrome.storage.sync.set({ boldVowels: boldVowels.checked });
  });

  boldFirstLetter.addEventListener("change", () => {
    chrome.storage.sync.set({ boldFirstLetter: boldFirstLetter.checked });
  });

  intensity.addEventListener("input", () => {
    chrome.storage.sync.set({ intensity: intensity.value });
  });
});
