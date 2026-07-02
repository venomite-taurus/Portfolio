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

    // ==========================================================================
    // CLICKABLE PROJECT CARD
    // ==========================================================================
    const clickableProjectCards = document.querySelectorAll('.clickable-project-card');
    clickableProjectCards.forEach(card => {
        card.addEventListener('click', () => {
            const url = card.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    // ==========================================================================
    // ETL PIPELINE SIMULATOR
    // ==========================================================================
    const scenarioSelector = document.getElementById('pipeline-scenario');
    const runPipelineBtn = document.getElementById('run-pipeline-btn');
    const resetPipelineBtn = document.getElementById('reset-pipeline-btn');
    const simulateErrorsToggle = document.getElementById('simulate-errors');
    const runBtnText = document.getElementById('run-btn-text');
    const runIcon = runPipelineBtn.querySelector('.run-icon');
    
    const metricRows = document.getElementById('metric-rows');
    const metricSpeed = document.getElementById('metric-speed');
    const metricQuality = document.getElementById('metric-quality');
    
    const stepExtract = document.getElementById('step-extract');
    const stepTransform = document.getElementById('step-transform');
    const stepLoad = document.getElementById('step-load');
    
    const statusExtract = document.getElementById('status-extract');
    const statusTransform = document.getElementById('status-transform');
    const statusLoad = document.getElementById('status-load');
    
    const consoleLogs = document.getElementById('console-logs');

    let simulationInterval = null;
    let pipelineRunning = false;

    const scenarios = {
        telecom: {
            totalRows: 15000,
            speed: 3750, // rows per second
            quality: 99.8,
            logs: {
                extract: [
                    { text: "[INFO] Initializing PySpark session on Yarn cluster...", type: "info" },
                    { text: "[INFO] Loading configuration for Telecom Churn datasets...", type: "muted" },
                    { text: "[INFO] Ingesting raw JSON churn records from Amazon S3 bucket...", type: "info" },
                    { text: "[SUCCESS] Extracted schema: customerID (String), contract (String), tenure (Int), charges (Double), churn (String).", type: "success" },
                    { text: "[SUCCESS] Ingestion completed. 15,000 raw rows loaded into Spark memory.", type: "success" }
                ],
                transform: [
                    { text: "[INFO] Commencing transform phase. Applying schema validation rules...", type: "info" },
                    { text: "[WARNING] Found 45 records with null TotalCharges. Imputing with column median values...", type: "warning" },
                    { text: "[INFO] Running StringIndexer and OneHotEncoder on categorical fields...", type: "info" },
                    { text: "[INFO] Spark VectorAssembler consolidating feature columns for ML pipeline...", type: "info" },
                    { text: "[SUCCESS] Transform phase succeeded. Features dataframe prepared.", type: "success" }
                ],
                load: [
                    { text: "[INFO] Establishing secure JDBC connection to Snowflake Data Warehouse...", type: "info" },
                    { text: "[INFO] Executing COPY INTO target table 'telecom_churn_features'...", type: "info" },
                    { text: "[INFO] Re-indexing and running database optimization stats...", type: "muted" },
                    { text: "[SUCCESS] Spark-Snowflake load completed. 15,000 rows loaded successfully.", type: "success" }
                ]
            }
        },
        healthcare: {
            totalRows: 24000,
            speed: 6000,
            quality: 100,
            logs: {
                extract: [
                    { text: "[INFO] Initializing Spark Context for health claim records...", type: "info" },
                    { text: "[INFO] Connecting to relational MediAssist claims SQL DB...", type: "info" },
                    { text: "[INFO] Pulling claims table (claim_id, provider, diagnoses, amount, date)...", type: "muted" },
                    { text: "[SUCCESS] Ingestion complete. 24,000 healthcare claims extracted.", type: "success" }
                ],
                transform: [
                    { text: "[INFO] Starting data standardization rules...", type: "info" },
                    { text: "[INFO] Mapping diagnosis columns to standardized ICD-10 medical codebook...", type: "info" },
                    { text: "[INFO] Running deduplication filter on claims logs...", type: "info" },
                    { text: "[SUCCESS] Standardization complete. Redundancy and entry errors reduced by 20%.", type: "success" }
                ],
                load: [
                    { text: "[INFO] Synchronizing Spark DataFrame with Databricks Delta Table...", type: "info" },
                    { text: "[INFO] Performing atomic MERGE INTO 'claims_gold' Delta Table...", type: "info" },
                    { text: "[SUCCESS] Delta Lake transaction committed successfully. 24,000 claims written.", type: "success" }
                ]
            }
        },
        travel: {
            totalRows: 8000,
            speed: 2000,
            quality: 99.9,
            logs: {
                extract: [
                    { text: "[INFO] Establishing HTTP client connection to Trip Buddy Vercel deployment API...", type: "info" },
                    { text: "[INFO] GET https://trip-buddy-ao8c.vercel.app/api/bookings - Response 200 OK", type: "info" },
                    { text: "[SUCCESS] Ingested 8,000 booking JSON objects in real-time stream.", type: "success" }
                ],
                transform: [
                    { text: "[INFO] Parsing nesting travel coordinates and routes...", type: "info" },
                    { text: "[INFO] Verifying authentication tokens against Supabase sessions...", type: "info" },
                    { text: "[SUCCESS] Stream parsing complete. Auth credentials matched for all user records.", type: "success" }
                ],
                load: [
                    { text: "[INFO] Connecting to Supabase Postgres database instance...", type: "info" },
                    { text: "[INFO] Initiating parallel UPSERT operations to postgres.bookings table...", type: "info" },
                    { text: "[SUCCESS] Supabase real-time sync complete. 8,000 booking entries loaded.", type: "success" }
                ]
            }
        }
    };

    function writeConsoleLine(text, type = 'info') {
        const line = document.createElement('div');
        line.className = `console-line text-${type}`;
        line.textContent = `> ${text}`;
        consoleLogs.appendChild(line);
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
    }

    function clearConsole() {
        consoleLogs.innerHTML = '';
    }

    function startConnectorAnimation(connectorId, isError = false) {
        const container = document.getElementById(connectorId);
        if (!container) return;
        container.innerHTML = '';
        container.parentElement.classList.remove('completed');
        
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'data-particle';
            particle.style.animationDelay = `${i * 0.5}s`;
            container.appendChild(particle);
        }
        container.parentElement.classList.add(isError ? 'error-state' : 'active');
    }

    function stopConnectorAnimation(connectorId, status = 'completed') {
        const container = document.getElementById(connectorId);
        if (!container) return;
        container.innerHTML = '';
        container.parentElement.classList.remove('active', 'error-state');
        if (status === 'completed') {
            container.parentElement.classList.add('completed');
        } else if (status === 'error') {
            container.parentElement.classList.add('error-state');
        }
    }

    function resetSimulatorUI() {
        pipelineRunning = false;
        if (simulationInterval) clearInterval(simulationInterval);
        
        runPipelineBtn.disabled = false;
        runBtnText.textContent = "Run Pipeline";
        runIcon.style.display = "inline-block";
        resetPipelineBtn.disabled = true;
        scenarioSelector.disabled = false;
        
        metricRows.textContent = "0";
        metricSpeed.textContent = "0/s";
        metricQuality.textContent = "100%";
        
        // reset active metric classes
        document.querySelectorAll('.metric-box').forEach(box => {
            box.className = 'metric-box';
        });
        
        // reset flow steps
        document.querySelectorAll('.flow-step').forEach(step => {
            step.className = 'flow-step';
            const statusSpan = step.querySelector('.step-status');
            if (statusSpan) statusSpan.textContent = "Idle";
        });
        
        // reset connectors
        document.querySelectorAll('.flow-connector').forEach(conn => {
            conn.className = 'flow-connector';
            const particles = conn.querySelector('.data-particles-container');
            if (particles) particles.innerHTML = '';
        });
        
        clearConsole();
        writeConsoleLine("Ready to run pipeline. Select scenario and click 'Run Pipeline'.", "muted");
    }

    function runETLPipeline() {
        if (pipelineRunning) return;
        
        pipelineRunning = true;
        runPipelineBtn.disabled = true;
        runBtnText.textContent = "Running...";
        runIcon.style.display = "none";
        resetPipelineBtn.disabled = false;
        scenarioSelector.disabled = true;
        
        const selectedScenarioKey = scenarioSelector.value;
        const scenario = scenarios[selectedScenarioKey];
        const errorEnabled = simulateErrorsToggle.checked;
        
        clearConsole();
        writeConsoleLine(`Starting ETL pipeline for scenario: ${selectedScenarioKey.toUpperCase()}`, "info");
        
        let currentRows = 0;
        
        // Step 1: EXTRACT
        setTimeout(() => {
            if (!pipelineRunning) return;
            
            stepExtract.classList.add('active');
            statusExtract.textContent = "Extracting...";
            document.querySelector('.metrics-display .metric-box:nth-child(1)').classList.add('active');
            document.querySelector('.metrics-display .metric-box:nth-child(2)').classList.add('active');
            
            let logIndex = 0;
            const extractLogInterval = setInterval(() => {
                if (!pipelineRunning) {
                    clearInterval(extractLogInterval);
                    return;
                }
                
                if (logIndex < scenario.logs.extract.length) {
                    const log = scenario.logs.extract[logIndex];
                    writeConsoleLine(log.text, log.type);
                    logIndex++;
                } else {
                    clearInterval(extractLogInterval);
                    
                    // Complete extract
                    stepExtract.classList.remove('active');
                    stepExtract.classList.add('completed');
                    statusExtract.textContent = "Extract OK";
                    
                    // Start flow to transform
                    startConnectorAnimation('particles-1', false);
                    
                    // Step 2: TRANSFORM
                    setTimeout(() => {
                        if (!pipelineRunning) return;
                        
                        stopConnectorAnimation('particles-1', 'completed');
                        stepTransform.classList.add('active');
                        statusTransform.textContent = "Transforming...";
                        
                        let transLogIndex = 0;
                        const transformLogInterval = setInterval(() => {
                            if (!pipelineRunning) {
                                clearInterval(transformLogInterval);
                                return;
                            }
                            
                            if (transLogIndex < scenario.logs.transform.length) {
                                const log = scenario.logs.transform[transLogIndex];
                                writeConsoleLine(log.text, log.type);
                                transLogIndex++;
                            } else {
                                clearInterval(transformLogInterval);
                                
                                // If simulated fault is checked, fail at transform/load transition
                                if (errorEnabled) {
                                    handleFault('particles-2', stepTransform, statusTransform);
                                    return;
                                }
                                
                                // Complete transform
                                stepTransform.classList.remove('active');
                                stepTransform.classList.add('completed');
                                statusTransform.textContent = "Transform OK";
                                
                                // Start flow to load
                                startConnectorAnimation('particles-2', false);
                                
                                // Step 3: LOAD
                                setTimeout(() => {
                                    if (!pipelineRunning) return;
                                    
                                    stopConnectorAnimation('particles-2', 'completed');
                                    stepLoad.classList.add('active');
                                    statusLoad.textContent = "Loading...";
                                    
                                    let loadLogIndex = 0;
                                    const loadLogInterval = setInterval(() => {
                                        if (!pipelineRunning) {
                                            clearInterval(loadLogInterval);
                                            return;
                                        }
                                        
                                        if (loadLogIndex < scenario.logs.load.length) {
                                            const log = scenario.logs.load[loadLogIndex];
                                            writeConsoleLine(log.text, log.type);
                                            loadLogIndex++;
                                        } else {
                                            clearInterval(loadLogInterval);
                                            
                                            // Complete Load
                                            stepLoad.classList.remove('active');
                                            stepLoad.classList.add('completed');
                                            statusLoad.textContent = "Load OK";
                                            
                                            // Update Metrics Final
                                            metricRows.textContent = scenario.totalRows.toLocaleString();
                                            metricSpeed.textContent = "0/s";
                                            metricQuality.textContent = `${scenario.quality}%`;
                                            
                                            // Success Glow metrics
                                            document.querySelector('.metrics-display .metric-box:nth-child(3)').classList.add('active');
                                            
                                            writeConsoleLine(`[SUCCESS] Ingestion completed. Pipeline finished successfully.`, "success");
                                            
                                            runBtnText.textContent = "Completed";
                                            runPipelineBtn.disabled = true;
                                        }
                                    }, 500);
                                }, 1000);
                            }
                        }, 600);
                    }, 1500);
                }
            }, 400);
            
            // Count rows and throughput
            let ticks = 0;
            simulationInterval = setInterval(() => {
                if (!pipelineRunning) {
                    clearInterval(simulationInterval);
                    return;
                }
                
                if (currentRows < scenario.totalRows) {
                    // Increment rows dynamically
                    const chunk = Math.min(Math.floor(scenario.speed / 10), scenario.totalRows - currentRows);
                    currentRows += chunk;
                    metricRows.textContent = currentRows.toLocaleString();
                    
                    // Vary speed slightly for realism
                    const speedVariance = Math.floor((Math.random() - 0.5) * 400);
                    metricSpeed.textContent = `${(scenario.speed + speedVariance).toLocaleString()}/s`;
                    
                    // Quality variation
                    const qVariance = (Math.random() * 0.1).toFixed(2);
                    metricQuality.textContent = `${(scenario.quality - parseFloat(qVariance)).toFixed(1)}%`;
                } else {
                    clearInterval(simulationInterval);
                }
            }, 100);
            
        }, 500);
    }

    function handleFault(connectorId, failedStep, statusSpan) {
        // Stop throughput metric
        clearInterval(simulationInterval);
        metricSpeed.textContent = "0/s";
        
        // Show failure on active step
        failedStep.classList.remove('active');
        failedStep.classList.add('error-state');
        statusSpan.textContent = "FAILED";
        
        // Animate backwards red particles on connection
        startConnectorAnimation(connectorId, true);
        
        // Metric boxes show error color
        document.querySelectorAll('.metric-box').forEach(box => {
            box.classList.add('error');
        });
        metricQuality.textContent = "0.0%";
        
        writeConsoleLine("[ERROR] Connection aborted: Target database closed connection unexpectedly.", "error");
        writeConsoleLine("[ERROR] Connection timeout while committing ingestion transactions.", "error");
        writeConsoleLine("[WARNING] Ingestion stalled. Initiating emergency roll-back sequence...", "warning");
        
        setTimeout(() => {
            if (!pipelineRunning) return;
            writeConsoleLine("[INFO] Database transaction rolled back to last stable checkpoint.", "info");
            writeConsoleLine("[FATAL] Pipeline terminated with exit code 1. Manual intervention required.", "error");
            
            stopConnectorAnimation(connectorId, 'error');
            runBtnText.textContent = "Failed";
            runPipelineBtn.disabled = true;
        }, 1500);
    }

    runPipelineBtn.addEventListener('click', runETLPipeline);
    resetPipelineBtn.addEventListener('click', resetSimulatorUI);
    scenarioSelector.addEventListener('change', resetSimulatorUI);
    simulateErrorsToggle.addEventListener('change', resetSimulatorUI);
});
