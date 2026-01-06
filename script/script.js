const app = {
    // Application state properties
    currentScreen: 'welcomeScreen',
    currentNav: 'home',
    userData: null,
    workoutPlan: [],
    completedExercises: new Set(),
    timerInterval: null,
    timerSeconds: 0,
    workoutHistory: [],
    isLoggedIn: false,

    // Initialize the application
    init() {
        this.loadFromStorage();
        this.attachEventListeners();
        this.renderVideos();
    

        if (this.userData) {
            this.showScreen('dashboardScreen');
        }
    },

    // Attach event listeners to form elements
    attachEventListeners() {
        // User setup form
        const form = document.getElementById('userForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Login form
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        // Workout tracking form
        const trackingForm = document.getElementById('trackingForm');
        trackingForm.addEventListener('submit', (e) => this.handleTrackingSubmit(e));

        // Input validation listeners using for loop
        const inputs = document.querySelectorAll('#userForm input, #userForm select');
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        }

        // Set today's date as default for workout tracking
        const dateInput = document.getElementById('workoutDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    },

    // Navigate between sections
    navigate(section) {
        // Using querySelectorAll and for loop
        const navLinks = document.querySelectorAll('.nav-menu a');
        for (let i = 0; i < navLinks.length; i++) {
            navLinks[i].classList.remove('active');
        }

        const clickedLink = event.target;
        clickedLink.classList.add('active');

        this.currentNav = section;

        // Navigate to appropriate screen
        if (section === 'home') {
            if (this.userData) {
                this.showScreen('dashboardScreen');
            } else {
                this.showScreen('welcomeScreen');
            }
        } else if (section === 'videos') {
            this.showScreen('videosScreen');
        } else if (section === 'tracking') {
            this.showScreen('trackingScreen');
            this.renderWorkoutHistory();
        } else if (section === 'login') {
            if (this.isLoggedIn) {
                this.handleLogout();
            } else {
                this.showScreen('loginScreen');
            }
        }
    },

    // Handle user login
    handleLogin(e) {
        e.preventDefault();

        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');

        if (!this.validateField(emailInput) || !this.validateField(passwordInput)) {
            return;
        }

        // Simulate login
        this.isLoggedIn = true;

        // Update nav link text
        const loginLink = document.getElementById('loginNavLink');
        loginLink.textContent = 'Logout';

        alert('Login successful! Lorem ipsum dolor sit amet.');
        this.navigate('home');
    },

    // Handle user logout
    handleLogout() {
        this.isLoggedIn = false;
        const loginLink = document.getElementById('loginNavLink');
        loginLink.textContent = 'Login';
        alert('Logged out successfully.');
        this.navigate('login');
    },

    // Render exercise form videos
    renderVideos() {
        const videos = [
            { title: 'Push-up Form', emoji: '💪🏾', description: 'Lorem ipsum dolor sit amet consectetur adipiscing.' },
            { title: 'Squat Technique', emoji: '🦵🏾', description: 'Sed do eiusmod tempor incididunt ut labore.' },
            { title: 'Plank Basics', emoji: '🧘🏾', description: 'Ut enim ad minim veniam quis nostrud.' },
            { title: 'Deadlift Guide', emoji: '🏋🏾', description: 'Duis aute irure dolor in reprehenderit.' },
            { title: 'Lunge Tutorial', emoji: '🚶🏾', description: 'Excepteur sint occaecat cupidatat non proident.' },
            { title: 'Burpee Breakdown', emoji: '🔥', description: 'Sunt in culpa qui officia deserunt mollit.' }
        ];

        const videoGrid = document.getElementById('videoGrid');
        videoGrid.innerHTML = '';

        // Use for loop to create video cards
        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            const card = document.createElement('div');
            card.className = 'video-card';
            card.onclick = () => this.playVideo(video);

            const thumbnail = document.createElement('div');
            thumbnail.className = 'video-thumbnail';
            thumbnail.textContent = video.emoji;

            const info = document.createElement('div');
            info.className = 'video-info';

            const title = document.createElement('h4');
            title.textContent = video.title;

            const desc = document.createElement('p');
            desc.textContent = video.description;

            info.appendChild(title);
            info.appendChild(desc);

            card.appendChild(thumbnail);
            card.appendChild(info);

            videoGrid.appendChild(card);
        }
    },

    // Play video in modal
    playVideo(video) {
        const modal = document.getElementById('exerciseModal');
        const content = document.getElementById('modalContent');

        content.innerHTML = `
            <h3>${video.title}</h3>
            <div style="background: #f0f0f0; height: 300px; display: flex; align-items: center; justify-content: center; margin: 20px 0; border-radius: 8px; font-size: 4em;">
                ${video.emoji}
            </div>
            <p style="line-height: 1.6;">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div class="tip-box" style="margin-top: 20px;">
                <strong>💡 Key Points:</strong> Duis aute irure dolor in reprehenderit in voluptate 
                velit esse cillum dolore eu fugiat nulla pariatur.
            </div>
        `;

        modal.classList.add('show');
    },

    // Show add workout form
    showAddWorkoutForm() {
        const form = document.getElementById('addWorkoutForm');
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    },

    // Hide add workout form
    hideAddWorkoutForm() {
        const form = document.getElementById('addWorkoutForm');
        form.style.display = 'none';

        // Reset form
        document.getElementById('trackingForm').reset();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('workoutDate').value = today;
    },

    // Handle workout tracking form submission
    handleTrackingSubmit(e) {
        e.preventDefault();

        const dateInput = document.getElementById('workoutDate');
        const typeInput = document.getElementById('workoutType');
        const durationInput = document.getElementById('workoutDuration');
        const notesInput = document.getElementById('workoutNotes');

        const workout = {
            id: Date.now(),
            date: dateInput.value,
            type: typeInput.value,
            duration: parseInt(durationInput.value),
            notes: notesInput.value || 'N/A'
        };

        this.workoutHistory.push(workout);
        this.saveToStorage();
        this.hideAddWorkoutForm();
        this.renderWorkoutHistory();

        alert('Workout logged successfully! 💪🏾');
    },

    // Render workout history table
renderWorkoutHistory() {
    // Update stats
    const totalWorkouts = this.workoutHistory.length;
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeekWorkouts = this.workoutHistory.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate >= oneWeekAgo;
    }).length;

    const avgDuration = totalWorkouts > 0
        ? Math.round(this.workoutHistory.reduce((sum, w) => sum + w.duration, 0) / totalWorkouts)
        : 0;}}