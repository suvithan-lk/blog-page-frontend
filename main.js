// Professional Blog JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initAnimations();
    initContactForm();
    initScrollToTop();
    initNavbarScroll();
    initBlogFunctionality();
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.section-content, .hero-section');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection);
            updateActiveNavLink(this);
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const navbarToggler = document.querySelector('.navbar-toggler');
                navbarToggler.click();
            }
        });
    });
    
    // Show section function
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.remove('d-none');
                section.classList.add('loading');
                
                // Scroll to top of section
                const offsetTop = sectionId === 'home' ? 0 : 76;
                window.scrollTo({
                    top: section.offsetTop - offsetTop,
                    behavior: 'smooth'
                });
            } else {
                section.classList.add('d-none');
                section.classList.remove('loading');
            }
        });
    }
    
    // Update active navigation link
    function updateActiveNavLink(activeLink) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
}

// Blog functionality
function initBlogFunctionality() {
    initBlogSearch();
    initCategoryFilter();
    initNewsletterSignup();
    initBlogInteractions();
    initPagination();
    initSidebarInteractions();
}

// Blog search functionality
function initBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    const searchBtn = document.getElementById('searchBtn');
    const blogPosts = document.querySelectorAll('.blog-card');
    
    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value.toLowerCase());
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value.toLowerCase());
            }
        });
        
        // Real-time search (optional)
        searchInput.addEventListener('input', function() {
            if (this.value.length > 2) {
                performSearch(this.value.toLowerCase());
            } else if (this.value.length === 0) {
                showAllPosts();
            }
        });
    }
    
    function performSearch(query) {
        let foundPosts = 0;
        
        blogPosts.forEach(post => {
            const title = post.querySelector('.card-title').textContent.toLowerCase();
            const content = post.querySelector('.card-text').textContent.toLowerCase();
            const category = post.querySelector('.badge').textContent.toLowerCase();
            
            if (title.includes(query) || content.includes(query) || category.includes(query)) {
                post.style.display = 'block';
                post.style.animation = 'fadeInUp 0.5s ease-out';
                foundPosts++;
            } else {
                post.style.display = 'none';
            }
        });
        
        // Show "no results" message if needed
        showNoResultsMessage(foundPosts === 0);
    }
    
    function showAllPosts() {
        blogPosts.forEach(post => {
            post.style.display = 'block';
            post.style.animation = 'fadeInUp 0.5s ease-out';
        });
        showNoResultsMessage(false);
    }
    
    function showNoResultsMessage(show) {
        let noResults = document.getElementById('noResults');
        if (!noResults && show) {
            noResults = document.createElement('div');
            noResults.id = 'noResults';
            noResults.className = 'col-12 text-center py-5';
            noResults.innerHTML = `
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No posts found</h4>
                <p class="text-muted">Try adjusting your search terms or browse our categories.</p>
            `;
            document.querySelector('.blog-posts-grid .row').appendChild(noResults);
        } else if (noResults && !show) {
            noResults.remove();
        }
    }
}

// Category filter functionality
function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const blogPosts = document.querySelectorAll('.blog-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            filterPostsByCategory(category);
        });
    });
    
    function filterPostsByCategory(category) {
        let visiblePosts = 0;
        
        blogPosts.forEach(post => {
            const postCategory = post.getAttribute('data-category');
            
            if (category === 'all' || postCategory === category) {
                post.style.display = 'block';
                post.style.animation = 'fadeInUp 0.5s ease-out';
                visiblePosts++;
            } else {
                post.style.display = 'none';
            }
        });
        
        // Update category counts
        updateCategoryCounts();
    }
    
    function updateCategoryCounts() {
        const categories = ['technology', 'design', 'business', 'lifestyle'];
        const counts = {};
        
        categories.forEach(cat => {
            counts[cat] = document.querySelectorAll(`[data-category="${cat}"]:not([style*="display: none"])`).length;
        });
        
        // Update category badges (if they exist)
        categories.forEach(cat => {
            const badge = document.querySelector(`[data-category="${cat}"] .badge`);
            if (badge) {
                badge.textContent = counts[cat];
            }
        });
    }
}

// Newsletter signup functionality
function initNewsletterSignup() {
    const newsletterForms = document.querySelectorAll('.newsletter-signup form, .sidebar-widget .input-group');
    
    newsletterForms.forEach(form => {
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button');
        
        if (emailInput && submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleNewsletterSignup(emailInput.value, form);
            });
            
            emailInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleNewsletterSignup(this.value, form);
                }
            });
        }
    });
    
    function handleNewsletterSignup(email, form) {
        if (validateEmail(email)) {
            // Show success message
            showNewsletterMessage(form, 'success', 'Thank you for subscribing!');
            
            // Clear input
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput) {
                emailInput.value = '';
            }
            
            // Simulate API call
            setTimeout(() => {
                console.log('Newsletter subscription:', email);
            }, 1000);
        } else {
            showNewsletterMessage(form, 'error', 'Please enter a valid email address.');
        }
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showNewsletterMessage(form, type, message) {
        // Remove existing message
        const existingMsg = form.querySelector('.newsletter-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        // Create new message
        const msgDiv = document.createElement('div');
        msgDiv.className = `newsletter-message alert alert-${type === 'success' ? 'success' : 'danger'} mt-2`;
        msgDiv.textContent = message;
        
        form.appendChild(msgDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            msgDiv.remove();
        }, 3000);
    }
}

// Blog interactions
function initBlogInteractions() {
    // Read more buttons
    const readMoreBtns = document.querySelectorAll('.btn-outline-primary, .btn-primary');
    
    readMoreBtns.forEach(btn => {
        if (btn.textContent.includes('Read More')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                handleReadMore(this);
            });
        }
    });
    
    // Popular posts
    const popularPosts = document.querySelectorAll('.popular-post');
    popularPosts.forEach(post => {
        post.addEventListener('click', function() {
            handlePopularPostClick(this);
        });
    });
    
    // Tags
    const tags = document.querySelectorAll('.tags-cloud .badge');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            handleTagClick(this);
        });
    });
}

function handleReadMore(btn) {
    const card = btn.closest('.blog-card');
    const title = card.querySelector('.card-title').textContent;
    
    // Show loading state
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    btn.disabled = true;
    
    // Simulate loading
    setTimeout(() => {
        // Here you would typically navigate to the full post
        console.log('Opening post:', title);
        
        // For demo purposes, show an alert
        alert(`Opening: ${title}\n\nThis would navigate to the full blog post.`);
        
        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1000);
}

function handlePopularPostClick(post) {
    const title = post.querySelector('h6').textContent;
    console.log('Popular post clicked:', title);
    
    // Add visual feedback
    post.style.transform = 'scale(0.95)';
    setTimeout(() => {
        post.style.transform = 'scale(1)';
    }, 150);
    
    // Here you would navigate to the post
    alert(`Opening popular post: ${title}`);
}

function handleTagClick(tag) {
    const tagText = tag.textContent;
    console.log('Tag clicked:', tagText);
    
    // Filter posts by tag (similar to category filter)
    const blogPosts = document.querySelectorAll('.blog-card');
    let foundPosts = 0;
    
    blogPosts.forEach(post => {
        const content = post.querySelector('.card-text').textContent.toLowerCase();
        if (content.includes(tagText.toLowerCase())) {
            post.style.display = 'block';
            post.style.animation = 'fadeInUp 0.5s ease-out';
            foundPosts++;
        } else {
            post.style.display = 'none';
        }
    });
    
    // Show feedback
    if (foundPosts > 0) {
        showTagFilterMessage(`Showing posts tagged with "${tagText}"`);
    } else {
        showTagFilterMessage(`No posts found for "${tagText}"`);
    }
}

function showTagFilterMessage(message) {
    // Remove existing message
    const existingMsg = document.querySelector('.tag-filter-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Create message
    const msgDiv = document.createElement('div');
    msgDiv.className = 'tag-filter-message alert alert-info text-center mt-3';
    msgDiv.textContent = message;
    
    document.querySelector('.blog-posts-grid').insertBefore(msgDiv, document.querySelector('.blog-posts-grid .row'));
    
    // Remove after 3 seconds
    setTimeout(() => {
        msgDiv.remove();
    }, 3000);
}

// Pagination functionality
function initPagination() {
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handlePaginationClick(this);
        });
    });
}

function handlePaginationClick(link) {
    const pageItem = link.closest('.page-item');
    
    if (pageItem.classList.contains('disabled')) {
        return;
    }
    
    // Update active page
    document.querySelectorAll('.pagination .page-item').forEach(item => {
        item.classList.remove('active');
    });
    pageItem.classList.add('active');
    
    // Simulate page change
    console.log('Navigating to page:', link.textContent);
    
    // Add loading animation
    const blogContent = document.querySelector('.blog-posts-grid');
    blogContent.style.opacity = '0.5';
    
    setTimeout(() => {
        blogContent.style.opacity = '1';
        // Here you would load new content
        alert('This would load new blog posts for the selected page.');
    }, 500);
}

// Sidebar interactions
function initSidebarInteractions() {
    // Category links
    const categoryLinks = document.querySelectorAll('.category-item a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.toLowerCase();
            
            // Trigger category filter
            const categoryBtn = document.querySelector(`[data-category="${category}"]`);
            if (categoryBtn) {
                categoryBtn.click();
            }
        });
    });
}

// Scroll effects
function initScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const navbar = document.querySelector('.navbar');
        
        if (scrolled > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.blog-card, .sidebar-widget, .featured-post');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Contact form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmit(this);
        });
    }
}

function handleContactSubmit(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        alert('Thank you for your message! We\'ll get back to you soon.');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const navbar = document.querySelector('.navbar');
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Handle footer navigation links
const footerLinks = document.querySelectorAll('footer a[href^="#"]');
footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});