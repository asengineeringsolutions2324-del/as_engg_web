/* ===============================
   INTERSECTION OBSERVER (Scroll Animations)
   ================================================ */
let revealOnScroll;

const revealOptions = {
    threshold: 0.05,
    rootMargin: "0px 0px -20px 0px"
};

if (window.IntersectionObserver) {
    revealOnScroll = new IntersectionObserver(function(
        entries,
        observer
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("active");
                
                // Trigger counter animation if it's a stat box
                if (entry.target.classList.contains('stat-box')) {
                    const counter = entry.target.querySelector('.counter');
                    if (counter && !counter.classList.contains('counted')) {
                        animateCounter(counter);
                        counter.classList.add('counted');
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
}

/* ===============================
   TYPING EFFECT
   ================================================ */
function typeWriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const text = typewriterElement.getAttribute('data-text');
    let i = 0;
    typewriterElement.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            typewriterElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50); // Typing speed
        } else {
            // Hide the cursor when typing is finished
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.display = 'none';
            }
        }
    }
    
    // Start typing after a short delay
    setTimeout(type, 500);
}

/* ===============================
   NUMBER COUNTERS
   ================================================ */
function animateCounter(counterElement) {
    const target = +counterElement.getAttribute('data-target');
    const duration = 2000; // ms
    const increment = target / (duration / 16); // 60fps
    
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            counterElement.innerText = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            counterElement.innerText = target;
        }
    };
    
    updateCounter();
}

/* ===============================
   PRODUCT FILTER SYSTEM
   ================================================ */
function filterProducts() {
    const mainSelect = document.getElementById("mainCategory");
    if (!mainSelect) return;
    
    const mainCategory = mainSelect.value;
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        const productMain = product.getAttribute("data-main");
        const mainMatch = mainCategory === "all" || productMain === mainCategory;

        if (mainMatch) {
            product.style.display = "block";
            // Instead of forcing animation on all matching products via timeout,
            // we re-observe it so the IntersectionObserver only animates it when it enters the viewport.
            if (!product.classList.contains("active")) {
                if (revealOnScroll) {
                    revealOnScroll.observe(product);
                } else {
                    product.classList.add("active");
                }
            }
        } else {
            product.style.display = "none";
            product.classList.remove("active");
            if (revealOnScroll) {
                revealOnScroll.unobserve(product);
            }
        }
    });
}

/* ===============================
   INITIALIZATION
   ================================================ */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Observers
    const reveals = document.querySelectorAll(".reveal");
    if (revealOnScroll) {
        reveals.forEach(reveal => {
            revealOnScroll.observe(reveal);
        });
    } else {
        reveals.forEach(reveal => {
            reveal.classList.add("active");
        });
    }
    
    // 2. Initialize Typing Effect
    typeWriter();

    // 3. Initialize Filters
    const mainSelect = document.getElementById("mainCategory");
    if (mainSelect) {
        mainSelect.addEventListener("change", filterProducts);
        filterProducts();
    }
});