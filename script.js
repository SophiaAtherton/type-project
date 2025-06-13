// -- Set poster scaling based on window width --
function setViewWidth() {
  document.documentElement.style.setProperty('--view-width', `${window.innerWidth}px`);
}
setViewWidth(); // Set initial size
window.addEventListener('resize', setViewWidth); // Update on resize

// -- Wait until the DOM is fully loaded --
window.addEventListener("DOMContentLoaded", () => {
  // Load typing sound
  const typeSound = new Audio('audio/key-press.wav');

  // Play typing sound, restarting if already playing
  function playTypingSound() {
    typeSound.currentTime = 0;
    typeSound.play();
  }

  // Define Russian letter groups by line
  const russianLines = [
    ["#letter1", "#letter2", "#letter3"],
    ["#letter4", "#letter5"],
    ["#letter6", "#letter7", "#letter8", "#letter9", "#letter10", "#letter11"]
  ];

  // Define English letter groups by line
  const englishLines = [
    ["#letter1-5", "#letter2-5"],
    ["#letter3-5", "#letter4-5"],
    ["#letter5-5", "#letter6-5", "#letter7-5", "#letter8-5"]
  ];

  // Animate typing in each letter of a line with staggered timing and typing sound
  function animateTyping(line) {
    const tl = gsap.timeline();
    line.forEach((id, i) => {
      tl.to(id, {
        opacity: 1,                // fade in the letter
        duration: 0.2,             // each letter takes 0.2s
        ease: "power1.inOut",
        onStart: playTypingSound   // play sound on fade-in start
      }, i * (0.18 + Math.random() * 0.1)); // stagger with slight randomness
    });
    return tl;
  }

  // Animate deleting each letter in a line (in reverse order) with typing sound
  function animateDeleting(line) {
    const tl = gsap.timeline();
    line.slice().reverse().forEach((id, i) => {
      tl.to(id, {
        opacity: 0,              // fade out the letter
        duration: 0.1,           // quick delete
        ease: "power1.inOut",
        onStart: playTypingSound // play sound on fade-out start
      }, i * 0.1);               // stagger the disappearance
    });
    return tl; // return the timeline
  }

  // Create a master timeline that loops all animations infinitely
  const master = gsap.timeline({ repeat: -1 });

  // --- RUSSIAN TEXT ---
  russianLines.forEach(line => {
    master.add(animateTyping(line)); // type it
  });
  master.to({}, { duration: 7 });     // pause for 7s after full word
  russianLines.slice().reverse().forEach(line => {
    master.add(animateDeleting(line)); // delete it in reverse
  });

  // --- ENGLISH TEXT ---
  englishLines.forEach(line => {
    master.add(animateTyping(line)); // type it
  });
  master.to({}, { duration: 7 });     // pause for 7s after full word
  englishLines.slice().reverse().forEach(line => {
    master.add(animateDeleting(line)); // delete it in reverse
  });

  // Pause the animation until user interacts
  master.pause();

  const overlay = document.getElementById('startOverlay');
  overlay.addEventListener('click', () => {
    // Try to unlock audio playback
    typeSound.play().then(() => {
      typeSound.pause();
      typeSound.currentTime = 0;

      overlay.remove(); // remove the overlay from DOM
      master.play();    // start GSAP animation
    }).catch((e) => {
      console.warn("Autoplay error:", e);
      overlay.textContent = "Click again to start"; // fallback UI
    });
  });
});
