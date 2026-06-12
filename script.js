document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // STICKY HEADER & SCROLL SPY
    // ==========================================================================
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header class toggle
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Scroll Spy active link update
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // MOBILE NAVIGATION TOGGLE
    // ==========================================================================
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav');
    const links = document.querySelectorAll('.nav-link, .nav-cta');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('open');
        navMenu.classList.toggle('nav-active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('open');
            navMenu.classList.remove('nav-active');
        });
    });

    // ==========================================================================
    // CARD GLOW EFFECT (MOUSE COORDINATE TRACKING)
    // ==========================================================================
    const glowCards = document.querySelectorAll('.about-card, .skill-card, .project-card, .cert-card, .contact-form-container');

    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.fade-up-init');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-up-visible');
                // Unobserve once shown
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Trigger hero reveal immediately
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('fade-up-visible');
        }
    }, 100);

    // ==========================================================================
    // INTERACTIVE CANVAS PARTICLES BACKGROUND
    // ==========================================================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let particleCount = 80;
    const connectionDistance = 120;
    let mouse = { x: null, y: null, radius: 150 };

    // Adjust particle count for smaller screens
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        if (window.innerWidth < 768) {
            particleCount = 30;
        } else {
            particleCount = 80;
        }
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 1;
        }

        update() {
            // Normal movement
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Interactive mouse repulsion/interaction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    // Push particle slightly
                    this.x += Math.cos(angle) * force * 1.2;
                    this.y += Math.sin(angle) * force * 1.2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw and update particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw lines connecting particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = (1 - (distance / connectionDistance)) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
            
            // Connect to mouse if close
            if (mouse.x !== null && mouse.y !== null) {
                const p = particles[i];
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const opacity = (1 - (distance / mouse.radius)) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    // Event listeners for particles canvas
    window.addEventListener('resize', setCanvasSize);
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Initialize Canvas
    setCanvasSize();
    animateParticles();

    // ==========================================================================
    // CONTACT FORM VALIDATION & HANDLING
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('.btn-submit');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // Reset status
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        // Basic Validation
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            formStatus.textContent = 'Please fill out all fields.';
            formStatus.classList.add('error');
            return;
        }

        // Email validation pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            formStatus.textContent = 'Please enter a valid email address.';
            formStatus.classList.add('error');
            return;
        }

        // Disable button and show sending state
        submitBtn.disabled = true;
        const origContent = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <span class="pulsing-dot" style="margin-left: 8px;"></span>';

        // Prepare data for Web3Forms API
        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let res = await response.json();
            if (response.status === 200) {
                formStatus.textContent = 'Message sent successfully! Thank you, Shubham will get back to you soon.';
                formStatus.classList.add('success');
                // Clear inputs
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';
            } else {
                formStatus.textContent = res.message || 'Something went wrong. Please try again.';
                formStatus.classList.add('error');
            }
        })
        .catch(error => {
            formStatus.textContent = 'Network error. Please check your connection and try again.';
            formStatus.classList.add('error');
        })
        .finally(() => {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = origContent;
        });
    });
});
