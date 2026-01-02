// Get all navigation buttons and sections
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

// Add click event to each button
navButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Get which section to show from data-section attribute
        const targetSection = this.getAttribute('data-section');
        
        // Remove active class from everything
        navButtons.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked button and target section
        this.classList.add('active');
        document.getElementById(targetSection).classList.add('active');
    });
});