window.addEventListener("DOMContentLoaded", () => {
  const totalTime = 10;
  let timeLeft = totalTime;
  const countdownEl = document.getElementById("countdown");
  const progressBar = document.getElementById("progress");
  const btn = document.querySelector(".btn");

  btn.addEventListener("click", () => {
    window.location.reload();
  });

  progressBar.style.width = "0%";

  const intervalId = setInterval(() => {
    timeLeft--;
    if (countdownEl) countdownEl.textContent = timeLeft;
    const progressWidth = ((totalTime - timeLeft) / totalTime) * 100;
    if (progressBar) progressBar.style.width = `${progressWidth}%`;

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      window.location.reload();
    }
  }, 1000);
});
