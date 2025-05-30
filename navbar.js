function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  const hamburger = document.getElementById("hamburger");

  navLinks.classList.toggle("show");
  hamburger.classList.toggle("active");
}