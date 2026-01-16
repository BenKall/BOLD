const toggle = document.getElementById("toggle");
const mode = document.getElementById("mode");
const intensity = document.getElementById("intensity");

chrome.storage.sync.get(["enabled", "mode", "intensity"], settings => {
  toggle.checked = settings.enabled;
  mode.value = settings.mode;
  intensity.value = settings.intensity;
});

toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});

mode.addEventListener("change", () => {
  chrome.storage.sync.set({ mode: mode.value });
});

intensity.addEventListener("input", () => {
  chrome.storage.sync.set({ intensity: intensity.value });
});
