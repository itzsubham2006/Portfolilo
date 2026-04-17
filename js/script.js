const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let nodes = [];

function initCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    nodes = [];
    const nodeCount = Math.floor((width * height) / 15000);
    
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }
}

function drawNeuralNetwork() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
        ctx.fill();
        
        for (let j = i + 1; j < nodes.length; j++) {
            const node2 = nodes[j];
            const dx = node.x - node2.x;
            const dy = node.y - node2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(node2.x, node2.y);
                ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - dist / 120)})`;
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(drawNeuralNetwork);
}

initCanvas();
drawNeuralNetwork();
window.addEventListener('resize', initCanvas);

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            const tabContent = document.getElementById(tabId);
            if (tabContent) tabContent.classList.add('active');
        });
    });
}

const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        console.log('Feedback submitted:', { username, email, message });
        
        const btn = feedbackForm.querySelector('.btn');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<span>Sent!</span> <i class="fa-solid fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
        
        setTimeout(() => {
            feedbackForm.reset();
            btn.innerHTML = originalContent;
            btn.style.background = '';
        }, 2000);
    });
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .project-card').forEach(el => {
    if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
