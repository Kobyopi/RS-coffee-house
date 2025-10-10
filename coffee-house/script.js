//Product data
const productsData = {
    coffee: [
        {
            id: 1,
            name: 'Irish coffee',
            description: 'Fragnant black coffee with Jameson Irish whiskey and whipped milk',
            price: 7.00,
            image: '../assets/coffee-1.jpg'
        },
        {
            id: 2,
            name: 'Kahlua coffee',
            description: 'Classic coffee with milk and Kahlua liqueur under a cap of frothed milk',
            price: 7.00,
            image: '../assets/coffee-2.jpg'
        },
        {
            id: 3,
            name: 'Honey raf',
            description: 'Espresso with frothed milk, cream and aromatic honey',
            price: 5.50,
            image: '../assets/coffee-3.jpg'
        },
        {
            id: 4,
            name: 'Ice cappuccino',
            description: 'Cappuccino with soft thick foam in summer version with ice',
            price: 5.00,
            image: '../assets/coffee-4.jpg'
        },
        {
            id: 5,
            name: 'Espresso',
            description: 'Classic black coffee',
            price: 4.50,
            image: '../assets/coffee-5.jpg'
        },
        {
            id: 6,
            name: 'Latte',
            description: 'Espresso coffee with the addition of steamed milk and dense milk foam',
            price: 5.50,
            image: '../assets/coffee-6.jpg'
        },
        {
            id: 7,
            name: 'Latte macchiato',
            description: 'Espresso with forthed milk and chocolate',
            price: 5.50,
            image: '../assets/coffee-7.jpg'
        },
        {
            id: 8,
            name: 'Coffee with cognac',
            description: 'Fragnant black coffee with cognac and whipped cream',
            price: 6.50,
            image: '../assets/coffee-8.jpg'
        }
    ],
    tea: [
        {
            id: 9,
            name: 'Moroccan',
            description: 'Fragnant black tea with the addition of tangerine, cinnamon, honey, lemon and mint',
            price: 4.50,
            image: '../assets/tea-1.png'
        },
        {
            id: 10,
            name: 'Ginger',
            description: 'Original black tea with fresh ginger, lemon and honey',
            price: 5.00,
            image: '../assets/tea-2.png'
        },
        {
            id: 11,
            name: 'Cranberry',
            description: 'Invigorating black tea with cranberry and honey',
            price: 5.00,
            image: '../assets/tea-3.png'
        },
        {
            id: 12,
            name: 'Sea buckthorn',
            description: 'Toning sweet black tea with sea buckthorn, fresh thyme and cinnamon',
            price: 5.50,
            image: '../assets/tea-4.png'
        }
    ],
    dessert: [
        {
            id: 13,
            name: 'Marble cheesecake',
            description: 'Philadelphia cheese with lemon zest on a light sponge cake and red currant jam',
            price: 3.50,
            image: '../assets/dessert-1.png'
        },
        {
            id: 14,
            name: 'Red velvet',
            description: 'Layer cake with cream cheese frosting',
            price: 4.00,
            image: '../assets/dessert-2.png'
        },
        {
            id: 15,
            name: 'Cheesecakes',
            description: 'Soft cottage cheese pancakes with sour cream and fresh berries and sprinkled with powdered sugar',
            price: 4.50,
            image: '../assets/dessert-3.png'
        },
        {
            id: 16,
            name: 'Creme brulee',
            description: 'Delicate creamy dessert in a caramel basket with wild berries',
            price: 4.00,
            image: '../assets/dessert-4.png'
        },
        {
            id: 17,
            name: 'Pancakes',
            description: 'Tender pancakes with strawberry jam and fresh strawberries',
            price: 4.50,
            image: '../assets/dessert-5.png'
        },
        {
            id: 18,
            name: 'Honey cake',
            description: 'Classic honey cake with delicate custard',
            price: 4.50,
            image: '../assets/dessert-6.png'
        },
        {
            id: 19,
            name: 'Chocolate cake',
            description: 'Cake with hot chocolate filling and nuts with dried apricots',
            price: 5.50,
            image: '../assets/dessert-7.png'
        },
        {
            id: 20,
            name: 'Black forest',
            description: 'A combination of thin sponge cake with cherry jam and light chocolate mousse',
            price: 6.50,
            image: '../assets/dessert-8.png'
        }
    ]
};

// Burger Menu
const burgerIcon = document.querySelector('.burger-icon');
const burgerMenu = document.querySelector('.burger-menu');
const burgerLinks = document.querySelectorAll('.burger-link');

if (burgerIcon) {
    burgerIcon.addEventListener('click', () => {
        burgerIcon.classList.toggle('active');
        burgerMenu.classList.toggle('active');
        document.body.classList.toggle('burger-open');
    });
}

if (burgerLinks) {
    burgerLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerIcon.classList.remove('active');
            burgerMenu.classList.remove('active');
            document.body.classList.remove('burger-open');
        });
    });
}

// Close burger menu when window is resized above 768px
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        burgerIcon.classList.remove('active');
        burgerMenu.classList.remove('active');
        document.body.classList.remove('burger-open');
    }
});

// Carousel on Home Page
const carouselTrack = document.querySelector('.carousel-track');
const carouselBtnLeft = document.querySelector('.carousel-btn-left');
const carouselBtnRight = document.querySelector('.carousel-btn-right');
const indicators = document.querySelectorAll('.indicator');
const carousel = document.querySelector('.carousel');

let currentSlide = 0;
let autoPlayInterval;
let touchStartX = 0;
let touchEndX = 0;

function updateCarousel() {
    if (carouselTrack) {
        carouselTrack.style.transform = 'translateX(-${currentSlide * 100}%)';

        indicators.forEach((indicator, index) => {
            indicators.classList.toggle('active', index === currentSlide);
            const progress = indicators.querySelector('.indicator-progress');
            if (index === currentSlide) {
                progress.style.width = '0';
                setTimeout(() => {
                    progress.style.animation = 'none';
                    progress.offsetHeight;
                    progress.style.animation = 'progress 5s linear forwards';
                }, 10);
            } else {
                progress.style.width = '0';
                progress.style.animation = 'none';
            }
        });
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % 3;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + 3) % 3;
    updateCarousel();
}

function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

if (carouselBtnRight) {
    carouselBtnRight.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
    });
}

if (carouselBtnLeft) {
    carouselBtnLeft.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
    });
}

if (indicators) {
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
            startAutoPlay();
        });
    });
}

// Pause on hover
if (carousel) {
    carousel.addEventListener('mouseenter', () => {
        stopAutoPlay();
        const activeIndicator = document.querySelector('.indicator.active');
        if (activeIndicator) {
            activeIndicator.classList.add('paused');
        }
    });
    
    carousel.addEventListener('mouseleave', () => {
        const activeIndicator = document.querySelector('.indicator.active');
        if (activeIndicator) {
            activeIndicator.classList.remove('paused');
        }
        startAutoPlay();
    });

    // Touch events for mobile
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Start autoplay on page load
if (carousel) {
    startAutoPlay();
}