function setViewWidth() {
  document.documentElement.style.setProperty('--view-width', `${window.innerWidth}px`);
}

// Set on load
setViewWidth();

// Update on resize
window.addEventListener('resize', setViewWidth);
