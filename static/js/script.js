const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let w, h, nodes = [];

function initCanvas() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    nodes = [];
    const count = Math.floor((w * h) / 25000);
    for (let i = 0; i < count; i++) {
        nodes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 1.2 + 0.5
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 136, 0.35)';
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n.x - n2.x;
            const dy = n.y - n2.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 90) {
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(n2.x, n2.y);
                ctx.strokeStyle = `rgba(0, 255, 136, ${0.08 * (1 - d / 90)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(draw);
}
initCanvas();
draw();
window.addEventListener('resize', initCanvas);

const matrix = document.getElementById('matrix');
if (matrix) {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    let columns = Math.floor(window.innerWidth / 20);
    let drops = Array(columns).fill(1);

    function drawMatrix() {
        const height = window.innerHeight;
        matrix.style.height = height + 'px';
        matrix.style.background = `linear-gradient(transparent 0%, var(--bg) 90%)`;
        let html = '';
        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const top = drops[i] * 20;
            html += `<span style="position:absolute;left:${i * 20}px;top:${top}px;color:var(--green);font-size:14px;opacity:${Math.random() * 0.5 + 0.3}">${char}</span>`;
            if (top > height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
        matrix.innerHTML = html;
        requestAnimationFrame(drawMatrix);
    }
    drawMatrix();
}

function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeEl = document.getElementById('statusTime');
    const dateEl = document.getElementById('statusDate');
    if (timeEl) timeEl.textContent = timeStr;
    if (dateEl) dateEl.textContent = dateStr;
}
updateTime();
setInterval(updateTime, 1000);

const COMMANDS = {
    'help': 'show all commands',
    'whoami': 'display user info',
    'date': 'show current date/time',
    'ls': 'list sections',
    'ls -la': 'list all with details',
    'ls projects': 'list projects',
    'cat about.md': 'show about info',
    'cat skills.json': 'show skills',
    'cat experience.log': 'show experience',
    'cat goals.md': 'show goals',
    'cat updates.log': 'show recent updates',
    'cat contact.json': 'show contact info',
    'cd ~': 'go to home',
    'cd home': 'go to home',
    'cd about': 'go to about',
    'cd skills': 'go to skills',
    'cd projects': 'go to projects',
    'cd updates': 'go to updates',
    'cd contact': 'go to contact',
    'python ml-suite.py': 'open ML suite',
    'python heart_predict.py': 'open heart prediction',
    'python cancer_detect.py': 'open cancer prediction',
    'neofetch': 'system information',
    'uname -a': 'kernel info',
    'uptime': 'system uptime',
    'pwd': 'print working directory',
    'ls -la ~/projects': 'list all projects with details',
    'mail lastw5232@gmail.com': 'open mail client',
    'github itzsubham2006': 'open github profile',
    'linkedin subhampathak': 'open linkedin profile',
    'clear': 'clear terminal output',
    'history': 'show command history',
    'echo hello': 'print hello',
    'echo $(whoami)': 'print current user',
    'sudo': 'elevated privileges (just kidding)',
    'man help': 'show manual',
    'top': 'show running processes',
    'ps aux': 'list all processes',
    'df -h': 'disk usage',
    'free -h': 'memory usage',
    'env': 'show environment',
    'exit': 'exit session'
};

let cmdHistory = [];
let historyIndex = -1;

const cmdInput = document.getElementById('cmdInput');
const cmdHint = document.getElementById('cmdHint');
const cmdText = document.getElementById('cmdText');
const cmdHistoryEl = document.getElementById('cmdHistory');
const terminalOutput = document.getElementById('terminalOutput');

function showCmdHint(cmd) {
    if (cmd && cmd.length > 0) {
        const match = Object.keys(COMMANDS).find(c => c.startsWith(cmd) && c !== cmd);
        if (match) {
            cmdHint.classList.add('show');
            cmdText.textContent = match;
        } else {
            cmdHint.classList.remove('show');
        }
    } else {
        cmdHint.classList.remove('show');
    }
}

function appendOutput(cmd, output, type = 'normal') {
    const histLine = document.createElement('div');
    histLine.className = 'hist-line';

    if (type === 'neofetch') {
        histLine.innerHTML = `<pre class="neofetch-output">${output}</pre>`;
        cmdHistoryEl.appendChild(histLine);
        return;
    }

    histLine.innerHTML = `
        <span class="prompt">$</span>
        <span class="cmd">${cmd}</span>
        ${output ? `<span class="output">${output}</span>` : ''}
    `;
    cmdHistoryEl.appendChild(histLine);
    cmdHistoryEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function clearTerminal() {
    if (cmdHistoryEl) cmdHistoryEl.innerHTML = '';
    if (terminalOutput) terminalOutput.style.display = 'none';
}

function toggleNeofetch() {
    const neofetchArt = `
<span class="n-green">      _                                              </span>
<span class="n-green">     | |                                             </span>
<span class="n-green">     | |__   __ _  _ __  _   _  ___  ___            </span>
<span class="n-green">     | '_ \\ / _\` || '_ \\| | | |/ _ \\/ __|           </span>
<span class="n-green">     | | | | (_| || |_) | |_| |  __/\\__ \\           </span>
<span class="n-green">     |_| |_|\\__,_|| .__/ \\__, |\\___||___/           </span>
<span class="n-green">                | |     __/ |                      </span>
<span class="n-green">                |_|    |___/                       </span>

<span class="n-white">  ┌─────────────────────────────────────────────┐</span>
<span class="n-white">  │</span>  <span class="n-cyan">subham</span><span class="n-white">@</span><span class="n-green">portfolio</span>                        <span class="n-white">│</span>
<span class="n-white">  ├─────────────────────────────────────────────┤</span>
<span class="n-white">  │</span>  <span class="n-label">OS</span>         <span class="n-val">PortfolioOS 5.15.0 LTS</span>              <span class="n-white">│</span>
<span class="n-white">  │</span>  <span class="n-label">Host</span>       <span class="n-val">subham.dev</span>                        <span class="n-white">│</span>
<span class="n-white">  │</span>  <span class="n-label">Kernel</span>     <span class="n-val">x86_64 ML Neural Network</span>           <span class="n-white">│</span>
<span class="n-white">  │</span>  <span class="n-label">Uptime</span>     <span class="n-val">since birth</span>                       <span class="n-white">│</span>
<span class="n-white">  │</span>  <span class="n-label">Shell</span>     <span class="n-val">bash 5.2 + custom prompts</span>         <span class="n-white">│</span>
<span class="n-white">  │</span>  <span class="n-label">Terminal</span>  <span class="n-val">Custom Portfolio Terminal</span>        <span class="n-white">│</span>
<span class="n-white">  │</span>  <span class="n-label">CPU</span>        <span class="n-val">ML Brain @ 99.9% utilization</span>      <span class="n-white">│</span>
<span class="n-white">  │</span>  <span class="n-label">Memory</span>    <span class="n-val">128GB / 128GB (thinking)</span>          <span class="n-white">│</span>
<span class="n-white">  │</span>  <span class="n-label">Python</span>    <span class="n-val">3.12.0</span>                              <span class="n-white">│</span>
<span class="n-white">  │</span>  <span class="n-label">ML Stack</span>  <span class="n-val">TensorFlow, PyTorch, Scikit</span>       <span class="n-white">│</span>
<span class="n-white">  │</span>  <span class="n-label">Location</span>  <span class="n-val">India</span>                              <span class="n-white">│</span>
<span class="n-white">  │</span>  <span class="n-label">Packages</span>  <span class="n-val">pip install everything</span>             <span class="n-white">│</span>
<span class="n-white">  └─────────────────────────────────────────────┘</span>

<span class="n-yellow">  ████</span>  <span class="n-yellow">████</span>  <span class="n-cyan">██</span>  <span class="n-cyan">██</span>  <span class="n-green">████</span>  <span class="n-white">██</span>    <span class="n-red">████</span>
<span class="n-yellow">  ██</span>    <span class="n-yellow">█</span>    <span class="n-cyan">██</span>  <span class="n-cyan">██</span>  <span class="n-green">█</span>     <span class="n-white">██</span>      <span class="n-red">█</span>
<span class="n-yellow">  ████</span>  <span class="n-yellow">██</span>    <span class="n-cyan">██</span>  <span class="n-cyan">██</span>  <span class="n-green">███</span>   <span class="n-white">██</span>      <span class="n-red">███</span>
`;

    const histLine = document.createElement('div');
    histLine.className = 'hist-line';
    histLine.innerHTML = `<pre class="neofetch-output">${neofetchArt}</pre>`;
    cmdHistoryEl.appendChild(histLine);
    cmdHistoryEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function executeCommand(cmd) {
    if (!cmd.trim()) return;

    cmdHistory.push(cmd);
    historyIndex = cmdHistory.length;

    const cmdLower = cmd.toLowerCase().trim();

    let output = '';

    switch (cmdLower) {
        case 'help':
            output = Object.entries(COMMANDS).map(([c, d]) => 
                `  <span class="cmd-match">${c.padEnd(35)}</span><span class="cmd-desc">- ${d}</span>`
            ).join('\n');
            appendOutput(cmd, output);
            return;

        case 'whoami':
            output = '<span class="n-cyan">subham</span> — CS Student, ML Enthusiast, Python Developer';
            break;

        case 'date':
            output = new Date().toLocaleString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', 
                day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            break;

        case 'ls':
        case 'ls -la':
            output = `
  about.md        skills.json     projects/
  experience.log  goals.md        updates.log
  contact.json    certs/          README.md
            `.trim();
            break;

        case 'ls projects':
            output = `
  drwxr-xr-x  ml-suite/         Multi-Model Prediction Suite
  drwxr-xr-x  heart_predict.py  Heart Disease Prediction
  drwxr-xr-x  cancer_detect.py   Cancer Detection
  drwxr-xr-x  portfolio/        This website
            `.trim();
            break;

        case 'cat about.md':
        case 'cat skills.json':
        case 'cat experience.log':
        case 'cat goals.md':
            window.location.href = '#about';
            const tabMap = {
                'cat about.md': 'skills',
                'cat skills.json': 'skills',
                'cat experience.log': 'exp',
                'cat goals.md': 'goals'
            };
            const tab = tabMap[cmdLower];
            setTimeout(() => {
                const btn = document.querySelector(`[data-tab="${tab}"]`);
                if (btn) btn.click();
            }, 300);
            output = `[viewing ${cmdLower.replace('cat ', '')}...]`;
            break;

        case 'cat updates.log':
            window.location.href = '#updates';
            output = '[viewing updates.log...]';
            break;

        case 'cat contact.json':
            window.location.href = '#contact';
            output = '[viewing contact.json...]';
            break;

        case 'cd ~':
        case 'cd home':
            window.location.href = '#home';
            output = '[navigating to home...]';
            break;

        case 'cd about':
            window.location.href = '#about';
            output = '[navigating to about...]';
            break;

        case 'cd skills':
            window.location.href = '#skills';
            output = '[navigating to skills...]';
            break;

        case 'cd projects':
            window.location.href = '#projects';
            output = '[navigating to projects...]';
            break;

        case 'cd updates':
            window.location.href = '#updates';
            output = '[navigating to updates...]';
            break;

        case 'cd contact':
            window.location.href = '#contact';
            output = '[navigating to contact...]';
            break;

        case 'python ml-suite.py':
        case 'python3 ml-suite.py':
            window.location.href = '/system';
            output = '[opening ml-suite.py...]';
            break;

        case 'python heart_predict.py':
        case 'python3 heart_predict.py':
            window.location.href = '/heart';
            output = '[opening heart_predict.py...]';
            break;

        case 'python cancer_detect.py':
        case 'python3 cancer_detect.py':
            window.location.href = '/cancer';
            output = '[opening cancer_detect.py...]';
            break;

        case 'neofetch':
            toggleNeofetch();
            return;

        case 'uname -a':
            output = 'PortfolioOS 5.15.0-sublime #1 SMP PREEMPT subham@portfolio x86_64 GNU/Linux';
            break;

        case 'uptime':
            output = 'System uptime: ∞ (since birth)';
            break;

        case 'pwd':
            output = '/home/subham/portfolio';
            break;

        case 'ls -la ~/projects':
            output = `
  total 42
  drwxr-xr-x  ml-suite/         Multi-Model Prediction Suite
  drwxr-xr-x  heart_predict.py  Heart Disease Prediction
  drwxr-xr-x  cancer_detect.py   Cancer Detection
  drwxr-xr-x  portfolio/        This website
            `.trim();
            break;

        case 'mail lastw5232@gmail.com':
            window.location.href = 'mailto:lastw5232@gmail.com';
            output = '[opening mail client...]';
            break;

        case 'github itzsubham2006':
        case 'gh itzsubham2006':
            window.open('https://github.com/itzsubham2006', '_blank');
            output = '[opening github.com/itzsubham2006...]';
            break;

        case 'linkedin subhampathak':
            window.open('https://linkedin.com/in/subhampathak', '_blank');
            output = '[opening linkedin...]';
            break;

        case 'clear':
        case 'cls':
            clearTerminal();
            return;

        case 'history':
            output = cmdHistory.map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`).join('\n');
            break;

        case 'echo hello':
            output = 'hello';
            break;

        case 'echo $(whoami)':
            output = 'subham';
            break;

        case 'sudo':
            output = '[sudo] password for subham: \n<span class="n-red">sudo: authentication failure</span>\n<span class="n-yellow">just kidding, you are already root here :)</span>';
            break;

        case 'man help':
            output = 'No manual entry for help. But here you are!';
            break;

        case 'top':
            output = `
  PID   COMMAND          CPU%   MEM%
  1     bash             0.0    0.1
  2     python           45.2   12.3
  3     thinking         99.9   89.7
  4     learning         87.3   67.4
  5     coffee           23.1   2.1
            `.trim();
            break;

        case 'ps aux':
            output = `
  USER    PID   COMMAND
  subham  1     bash - interactive
  subham  2     python - ML/AI
  subham  3     neofetch - display
  subham  4     git - version control
  subham  5     sleep - zzz
            `.trim();
            break;

        case 'df -h':
            output = `
  Filesystem      Size  Used  Avail  Use%
  /dev/brain      128G   64G    64G   50%
  /dev/coding      50G    30G    20G   60%
  /dev/creativity  99G    99G     0G  100%
  /dev/coffee     1.5L  0.5L   1.0L   33%
            `.trim();
            break;

        case 'free -h':
            output = `
                total        used        free      shared   buff/cache   available
  Memory:        128Gi       96Gi       32Gi       2Gi        64Gi        30Gi
  Swap:           0B          0B         0B
            `.trim();
            break;

        case 'env':
            output = `
  USER=subham
  HOME=/home/subham
  SHELL=/bin/bash
  PORTFOLIO=true
  ML_ENGINEER=true
  GENAI_MASTER=true
  STATUS=building
  COFFEE_LEVEL=low
            `.trim();
            break;

        case 'exit':
            output = '<span class="n-yellow">logout\nSession ended. Thanks for visiting!</span>';
            setTimeout(() => {
                cmdHistoryEl.innerHTML = '';
                if (terminalOutput) terminalOutput.style.display = 'block';
            }, 1500);
            break;

        default:
            output = `<span class="n-red">bash: ${cmd}: command not found</span>\nType <span class="n-green">'help'</span> for available commands.`;
    }

    appendOutput(cmd, output);
}

if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
        showCmdHint(e.target.value);
    });

    cmdInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeCommand(cmdInput.value);
            cmdInput.value = '';
            cmdHint.classList.remove('show');
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const partial = cmdInput.value;
            const match = Object.keys(COMMANDS).find(c => c.startsWith(partial));
            if (match) cmdInput.value = match;
            showCmdHint(cmdInput.value);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                cmdInput.value = cmdHistory[historyIndex] || '';
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < cmdHistory.length - 1) {
                historyIndex++;
                cmdInput.value = cmdHistory[historyIndex] || '';
            } else {
                historyIndex = cmdHistory.length;
                cmdInput.value = '';
            }
        } else if (e.key === 'Escape') {
            document.getElementById('keyboardHelp').classList.remove('show');
            cmdHint.classList.remove('show');
        }
    });

    cmdInput.focus();
}

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const help = document.getElementById('keyboardHelp');

    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        clearTerminal();
        return;
    }

    switch (e.key) {
        case '?':
            help.classList.toggle('show');
            break;
        case 'h':
            window.location.href = '#home';
            break;
        case 'a':
            window.location.href = '#about';
            break;
        case 's':
            window.location.href = '#skills';
            break;
        case 'p':
            window.location.href = '#projects';
            break;
        case 'm':
            window.location.href = '/system';
            break;
        case '/':
            e.preventDefault();
            cmdInput?.focus();
            break;
        case 'n':
            toggleNeofetch();
            break;
        case 'Escape':
            help.classList.remove('show');
            cmdHint.classList.remove('show');
            break;
    }
});

document.getElementById('clearBtn')?.addEventListener('click', clearTerminal);
document.getElementById('neofetchBtn')?.addEventListener('click', toggleNeofetch);
document.getElementById('helpBtn')?.addEventListener('click', () => {
    document.getElementById('keyboardHelp').classList.toggle('show');
});

document.querySelectorAll('[data-cmd]').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cmdHint) {
            cmdHint.classList.add('show');
            cmdText.textContent = el.dataset.cmd;
        }
    });
    el.addEventListener('mouseleave', () => {
        if (cmdHint) cmdHint.classList.remove('show');
    });
});

document.querySelectorAll('.qc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (cmdInput) {
            cmdInput.value = btn.dataset.cmd;
            cmdInput.focus();
        }
    });
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tab = document.getElementById(btn.dataset.tab);
        if (tab) tab.classList.add('active');
    });
});

document.querySelectorAll('.skill-card, .project-card, .blog-card, .achievement-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(8px)';
    setTimeout(() => {
        card.style.transition = 'opacity 0.3s, transform 0.3s, border-color 0.15s';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 200 + (i * 50));
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) {
            e.preventDefault();
            t.scrollIntoView({ behavior: 'smooth' });
        }
    });
});