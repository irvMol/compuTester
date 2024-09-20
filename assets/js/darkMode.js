// Wait until the document is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeClass = 'dark-mode'; // Define the class for dark mode

  // Check localStorage to see if dark mode was previously enabled
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add(darkModeClass);
    darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
  }

  // Add an event listener to the button to toggle dark mode
  darkModeToggle.addEventListener('click', function () {
    if (document.body.classList.contains(darkModeClass)) {
      // Disable dark mode
      document.body.classList.remove(darkModeClass);
      localStorage.setItem('darkMode', 'disabled');
      darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
    } else {
      // Enable dark mode
      document.body.classList.add(darkModeClass);
      localStorage.setItem('darkMode', 'enabled');
      darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
    }
  });
});
