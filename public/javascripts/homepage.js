document.addEventListener("DOMContentLoaded", () => {
  const modeToggle = document.getElementById("modeToggle");
  const body = document.body;

  // Apply mode and update UI
  function applyMode(mode) {
    if (mode === "dark") {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
      modeToggle.textContent = "☀️";
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
      modeToggle.textContent = "🌙";
    }
  }

  // Check localStorage or fallback to system preference
  const savedMode = localStorage.getItem("mode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialMode = savedMode || (prefersDark ? "dark" : "light");
  applyMode(initialMode);

  // Save and toggle on click
  modeToggle.addEventListener("click", () => {
    const currentMode = body.classList.contains("dark-mode") ? "dark" : "light";
    const newMode = currentMode === "dark" ? "light" : "dark";
    localStorage.setItem("mode", newMode);
    applyMode(newMode);
  });
});
