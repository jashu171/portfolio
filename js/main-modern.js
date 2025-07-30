// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global variables
let locoScroll;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio initializing...');
    
    try {
        initPreloader();
        initLocomotiveScroll();
        
        // Check if GSAP is available
        if (typeof gsap !== 'undefined') {
            initGSAPAnimations();
            console.log('✅ GSAP animations initialized');
        } else {
            console.warn('⚠️ GSAP not available, using fallback animations');
            initFallbackAnimations();
        }
        
        initNavigation();
        initFormHandling();
        initVideoControls();
        initProjectAnimations();
        
        // Fallback video controls initialization after a delay
        setTimeout(() => {
            console.log('🔄 Fallback video controls initialization...');
            initVideoControls();
        }, 1000);
        
        console.log('✅ Portfolio fully initialized');
    } catch (error) {
        console.error('❌ Error initializing portfolio:', error);
        // Continue with basic functionality
        initBasicFunctionality();
    }
});

// Fallback animations when GSAP is not available
function initFallbackAnimations() {
    // Add CSS-based animations as fallback
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeIn 1s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .slide-in-left {
            animation: slideInLeft 1s ease-out;
        }
        
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Apply fallback animations
    setTimeout(() => {
        document.querySelectorAll('.hero-title, .section-title').forEach(el => {
            el.classList.add('fade-in');
        });
    }, 500);
    
    // Initialize project animations even without GSAP
    initProjectAnimations();
    
    // Initialize project animations even without GSAP
    initProjectAnimations();
}

// Basic functionality fallback
function initBasicFunctionality() {
    console.log('🔧 Initializing basic functionality...');
    
    // Basic navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Basic form handling
    const form = document.querySelector('.form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! (This is a demo)');
        });
    }
}

// Circular Preloader Animation
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const loaderProgress = document.querySelector('.loader-progress');
    const percentageText = document.querySelector('.percentage-text');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 12 + 3; // Random increment between 3-15
        if (progress > 100) progress = 100;
        
        // Update circular progress
        const rotation = (progress / 100) * 360 - 90; // Start from top (-90deg)
        loaderProgress.style.transform = `rotate(${rotation}deg)`;
        
        // Update percentage text
        percentageText.textContent = Math.round(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Complete loading animation
            setTimeout(() => {
                gsap.timeline()
                    .to('.circular-loader', {
                        scale: 1.2,
                        duration: 0.3,
                        ease: 'power2.out'
                    })
                    .to('.welcome-text', {
                        scale: 1.1,
                        duration: 0.3,
                        ease: 'power2.out'
                    }, '-=0.2')
                    .to('.preloader', {
                        opacity: 0,
                        scale: 0.8,
                        duration: 1,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            preloader.style.display = 'none';
                            // Start main animations after preloader
                            animateHeroSection();
                        }
                    }, '+=0.5');
            }, 500);
        }
    }, 80);
}

// Initialize Locomotive Scroll with fallback for file:// protocol
function initLocomotiveScroll() {
    // Check if we're running on file:// protocol
    const isFileProtocol = window.location.protocol === 'file:';
    
    if (!isFileProtocol) {
        try {
            locoScroll = new LocomotiveScroll({
                el: document.querySelector('[data-scroll-container]'),
                smooth: true,
                multiplier: 1,
                class: 'is-revealed'
            });

            // Update ScrollTrigger when Locomotive Scroll updates
            locoScroll.on('scroll', ScrollTrigger.update);

            // Tell ScrollTrigger to use these proxy methods for the scroll container
            ScrollTrigger.scrollerProxy('[data-scroll-container]', {
                scrollTop(value) {
                    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
                },
                getBoundingClientRect() {
                    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
                },
                pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
            });

            // Refresh ScrollTrigger and update LocomotiveScroll
            ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
            ScrollTrigger.refresh();
        } catch (error) {
            console.warn('Locomotive Scroll failed to initialize:', error);
            initFallbackScroll();
        }
    } else {
        // Use fallback smooth scroll for file:// protocol
        initFallbackScroll();
    }
}

// Fallback smooth scroll implementation
function initFallbackScroll() {
    // Add smooth scroll behavior to CSS
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Custom smooth scroll implementation
    window.smoothScrollTo = function(target) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
}

// Hero Section Animation
function animateHeroSection() {
    const tl = gsap.timeline();
    
    // Animate title lines
    tl.to('.title-line', {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    })
    .to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5')
    .to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.3');

    // Animate floating orbs
    gsap.to('.orb-1', {
        y: -20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });

    gsap.to('.orb-2', {
        y: -30,
        x: 10,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });

    gsap.to('.orb-3', {
        y: -15,
        x: -10,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });

    // Animate Spline container
    gsap.fromTo('.spline-container', {
        opacity: 0,
        x: 100
    }, {
        opacity: 0.8,
        x: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 1
    });
}

// Initialize Project Animations with Intersection Observer
function initProjectAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe all project cards
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize GSAP Animations
function initGSAPAnimations() {
    // Use window as scroller for file:// protocol
    const scroller = locoScroll ? '[data-scroll-container]' : window;
    
    // About section animations
    ScrollTrigger.create({
        trigger: '.about-section',
        scroller: scroller,
        start: 'top 80%',
        onEnter: () => {
            gsap.timeline()
                .fromTo('.image-container', {
                    opacity: 0,
                    x: -100,
                    filter: 'blur(10px)'
                }, {
                    opacity: 1,
                    x: 0,
                    filter: 'blur(0px)',
                    duration: 1,
                    ease: 'power3.out'
                })
                .fromTo('.about-text .section-title', {
                    opacity: 0,
                    y: 50,
                    filter: 'blur(10px)'
                }, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'power3.out'
                }, '-=0.5')
                .fromTo('.about-description', {
                    opacity: 0,
                    y: 30
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                }, '-=0.3')
                .fromTo('.skill-item', {
                    opacity: 0,
                    y: 30,
                    scale: 0.9
                }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'back.out(1.7)'
                }, '-=0.3');
        }
    });

    // Services section animations
    ScrollTrigger.create({
        trigger: '.services-section',
        scroller: scroller,
        start: 'top 80%',
        onEnter: () => {
            gsap.timeline()
                .fromTo('.services-section .section-header', {
                    opacity: 0,
                    y: 50,
                    filter: 'blur(10px)'
                }, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1,
                    ease: 'power3.out'
                })
                .fromTo('.service-card', {
                    opacity: 0,
                    y: 60,
                    scale: 0.9
                }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'back.out(1.7)'
                }, '-=0.5');
        }
    });

    // Projects section header animation
    ScrollTrigger.create({
        trigger: '.projects-section .section-header',
        scroller: scroller,
        start: 'top 80%',
        onEnter: () => {
            gsap.fromTo('.projects-section .section-header', {
                opacity: 0,
                y: 50,
                filter: 'blur(10px)'
            }, {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 1,
                ease: 'power3.out'
            });
        }
    });

    // Individual project card animations with asymmetric reveal
    initProjectAnimations();

    // Contact section animations
    ScrollTrigger.create({
        trigger: '.contact-section',
        scroller: scroller,
        start: 'top 80%',
        onEnter: () => {
            gsap.timeline()
                .fromTo('.contact-info', {
                    opacity: 0,
                    x: -50
                }, {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: 'power3.out'
                })
                .fromTo('.contact-form', {
                    opacity: 0,
                    x: 50
                }, {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: 'power3.out'
                }, '-=0.7')
                .fromTo('.form-group', {
                    opacity: 0,
                    y: 30
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power3.out'
                }, '-=0.5');
        }
    });

    // Footer animations
    ScrollTrigger.create({
        trigger: '.footer',
        scroller: scroller,
        start: 'top 90%',
        onEnter: () => {
            gsap.fromTo('.footer-content', {
                opacity: 0,
                y: 60,
                filter: 'blur(10px)'
            }, {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 1,
                ease: 'power3.out'
            });
        }
    });

    // Hover animations for interactive elements
    initHoverAnimations();
}

// Hover Animations
function initHoverAnimations() {
    // CTA Button hover
    document.querySelectorAll('.glow-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Project card hover
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Skill item hover
    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                y: -5,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Service card hover
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -8,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Social link hover
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                y: -3,
                scale: 1.1,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Form input focus animations
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input.nextElementSibling, {
                opacity: 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input.nextElementSibling, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                if (locoScroll) {
                    locoScroll.scrollTo(targetElement);
                } else {
                    // Fallback smooth scroll
                    window.smoothScrollTo(targetElement);
                }
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    if (locoScroll) {
        locoScroll.on('scroll', (instance) => {
            const scrollTop = instance.scroll.y;
            
            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        });
    } else {
        // Fallback for regular scroll
        window.addEventListener('scroll', updateActiveNavLink);
    }
}

// Form Handling
function initFormHandling() {
    const form = document.querySelector('.form');
    const submitBtn = document.querySelector('.submit-btn');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Animate submit button
        gsap.to(submitBtn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        // Simulate form submission
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span><i class="ph ph-check"></i>';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
    });
}

// Initialize Project Animations with Intersection Observer
function initProjectAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe all project cards
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
}

// Utility function to create floating particles
function createFloatingParticles() {
    const particleContainer = document.querySelector('.footer-particles');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particleContainer.appendChild(particle);
    }
}

// Initialize Video Controls
function initVideoControls() {
    console.log('🎥 Initializing video controls...');
    
    document.querySelectorAll('.project-video-container').forEach((container, index) => {
        const video = container.querySelector('.project-video');
        const playPauseBtn = container.querySelector('.play-pause-btn');
        const muteBtn = container.querySelector('.mute-btn');
        
        console.log(`Video container ${index}:`, { video: !!video, playPauseBtn: !!playPauseBtn, muteBtn: !!muteBtn });
        
        if (video && playPauseBtn && muteBtn) {
            // Set initial mute state
            video.muted = true;
            container.classList.add('video-muted');
            
            console.log(`✅ Video ${index} controls initialized`);
            
            // Handle play/pause button click
            playPauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Play/pause clicked for video ${index}`);
                
                if (video.paused) {
                    video.play().then(() => {
                        container.classList.add('video-playing');
                        console.log(`Video ${index} playing`);
                    }).catch(err => console.error('Play failed:', err));
                } else {
                    video.pause();
                    container.classList.remove('video-playing');
                    console.log(`Video ${index} paused`);
                }
            });
            
            // Handle mute/unmute button click
            muteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Mute button clicked for video ${index}, current muted state:`, video.muted);
                
                if (video.muted) {
                    video.muted = false;
                    container.classList.remove('video-muted');
                    console.log(`Video ${index} unmuted`);
                } else {
                    video.muted = true;
                    container.classList.add('video-muted');
                    console.log(`Video ${index} muted`);
                }
            });
            
            // Handle video click to toggle play/pause
            video.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Video ${index} clicked`);
                
                if (video.paused) {
                    video.play().then(() => {
                        container.classList.add('video-playing');
                    }).catch(err => console.error('Play failed:', err));
                } else {
                    video.pause();
                    container.classList.remove('video-playing');
                }
            });
            
            // Update button state when video plays/pauses
            video.addEventListener('play', () => {
                container.classList.add('video-playing');
            });
            
            video.addEventListener('pause', () => {
                container.classList.remove('video-playing');
            });
            
            // Handle video ended
            video.addEventListener('ended', () => {
                container.classList.remove('video-playing');
            });
            
            // Pause other videos when one starts playing
            video.addEventListener('play', () => {
                document.querySelectorAll('.project-video').forEach(otherVideo => {
                    if (otherVideo !== video && !otherVideo.paused) {
                        otherVideo.pause();
                    }
                });
            });
            
            // Handle video load errors
            video.addEventListener('error', (e) => {
                console.error(`Video ${index} error:`, e);
            });
            
        } else {
            console.warn(`❌ Video ${index} missing elements:`, {
                video: !!video,
                playPauseBtn: !!playPauseBtn,
                muteBtn: !!muteBtn
            });
        }
    });
}

// Initialize particles
createFloatingParticles();

// Debug function for video controls
function debugVideoControls() {
    console.log('🔍 Debugging video controls...');
    
    const containers = document.querySelectorAll('.project-video-container');
    console.log(`Found ${containers.length} video containers`);
    
    containers.forEach((container, index) => {
        const video = container.querySelector('.project-video');
        const playPauseBtn = container.querySelector('.play-pause-btn');
        const muteBtn = container.querySelector('.mute-btn');
        const overlay = container.querySelector('.video-overlay');
        
        console.log(`Container ${index}:`, {
            container: !!container,
            video: !!video,
            playPauseBtn: !!playPauseBtn,
            muteBtn: !!muteBtn,
            overlay: !!overlay,
            videoSrc: video ? video.src : 'no video',
            videoMuted: video ? video.muted : 'no video'
        });
        
        if (video) {
            console.log(`Video ${index} properties:`, {
                paused: video.paused,
                muted: video.muted,
                readyState: video.readyState,
                currentTime: video.currentTime,
                duration: video.duration
            });
        }
    });
}

// Make debug function available globally
window.debugVideoControls = debugVideoControls;

// Handle window resize
window.addEventListener('resize', () => {
    if (locoScroll) {
        locoScroll.update();
    }
    ScrollTrigger.refresh();
});

// Refresh on page load
window.addEventListener('load', () => {
    if (locoScroll) {
        locoScroll.update();
    }
    ScrollTrigger.refresh();
    
    // Ensure video controls are initialized after everything loads
    console.log('🔄 Window loaded - reinitializing video controls...');
    initVideoControls();
});