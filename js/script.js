(function() {
    'use strict';

    var currentDir = '~';
    var cmdHistory = [];
    var historyIndex = -1;

    var cmdInput = document.getElementById('cmdInput');
    var twOutput = document.getElementById('twOutput');
    var twBody = document.getElementById('twBody');
    var cmdHint = document.getElementById('cmdHint');
    var cmdText = document.getElementById('cmdText');
    var keyboardHelp = document.getElementById('keyboardHelp');
    var helpCloseBtn = document.getElementById('helpCloseBtn');

    function pH(dir) {
        return '[subham@hehe]';
    }
    function pT(dir) {
        return '[subham@hehe]';
    }

    function updatePrompt() {
        var ips = document.querySelectorAll('.tw-input-row .ip');
        for (var i = 0; i < ips.length; i++) {
            ips[i].innerHTML = pH(currentDir) + ' ';
        }
    }

    function esc(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function addLine(cmd, output) {
        if (!twOutput) return;

        var cmdLine = document.createElement('div');
        cmdLine.className = 'tw-line fade-in';
        cmdLine.innerHTML = '<span class="p">' + pH(currentDir) + '</span> <span class="t">' + esc(cmd) + '</span>';
        twOutput.appendChild(cmdLine);

        if (output) {
            var outLine = document.createElement('div');
            outLine.className = 'tw-line fade-in';
            outLine.innerHTML = '<span class="s">  </span><span class="t">' + output + '</span>';
            twOutput.appendChild(outLine);
        }

        if (twBody) twBody.scrollTop = twBody.scrollHeight;
    }

    function clearTerminal() {
        if (twOutput) twOutput.innerHTML = '';
        if (twBody) twBody.scrollTop = 0;
    }

    function showHihifetch() {
        if (!twOutput) return;

        var compact = window.innerWidth < 465;
        var art = compact
? '<span style="color:#d4d4d4">      _                       </span>\n' +
'<span style="color:#d4d4d4">     | |                      </span>\n' +
'<span style="color:#d4d4d4">     | |__   __ _  _ __  _   _ </span>\n' +
'<span style="color:#d4d4d4">     | \'_ \\ / _` || \'_ \\| | | |</span>\n' +
'<span style="color:#d4d4d4">     | | | | (_| || |_) | |_| |</span>\n' +
'<span style="color:#d4d4d4">     |_| |_|\\__,_|| .__/ \\__, |</span>\n' +
'<span style="color:#d4d4d4">                | |     __/ | </span>\n' +
'<span style="color:#d4d4d4">                |_|    |___/  </span>\n\n' +
' +---------------------------+\n' +
' | <span style="color:#89dceb">subham</span>@<span style="color:#d4d4d4">portfolio</span>           |\n' +
' +---------------------------+\n' +
' | OS   PortfolioOS 5.15.0   |\n' +
' | Host subham.dev           |\n' +
' | Kern x86_64 ML Neural Net |\n' +
' | Py   3.12.0               |\n' +
' | ML   TF, PyTorch, Scikit  |\n' +
' | Loc  India                |\n' +
' +---------------------------+'
: '<span style="color:#d4d4d4">      _                                              </span>\n' +
'<span style="color:#d4d4d4">     | |                                             </span>\n' +
'<span style="color:#d4d4d4">     | |__   __ _  _ __  _   _  ___  ___            </span>\n' +
'<span style="color:#d4d4d4">     | \'_ \\ / _` || \'_ \\| | | |/ _ \\/ __|           </span>\n' +
'<span style="color:#d4d4d4">     | | | | (_| || |_) | |_| |  __/\\__ \\           </span>\n' +
'<span style="color:#d4d4d4">     |_| |_|\\__,_|| .__/ \\__, |\\___||___/           </span>\n' +
'<span style="color:#d4d4d4">                | |     __/ |                      </span>\n' +
'<span style="color:#d4d4d4">                |_|    |___/                       </span>\n\n' +
'  +-----------------------------------------+\n' +
'  |  <span style="color:#89dceb">subham</span>@<span style="color:#d4d4d4">portfolio</span>                        |\n' +
'  +-----------------------------------------+\n' +
'  |  OS         PortfolioOS 5.15.0 LTS       |\n' +
'  |  Host       subham.dev                   |\n' +
'  |  Kernel     x86_64 ML Neural Network      |\n' +
'  |  Python     3.12.0                       |\n' +
'  |  ML Stack   TensorFlow, PyTorch, Scikit  |\n' +
'  |  Location   India                        |\n' +
'  +-----------------------------------------+';

        var cmdLine = document.createElement('div');
        cmdLine.className = 'tw-line fade-in';
        cmdLine.innerHTML = '<span class="p">' + pH(currentDir) + '</span> <span class="t">hihifetch</span>';
        twOutput.appendChild(cmdLine);

        var outLine = document.createElement('div');
        outLine.className = 'tw-line fade-in';
        outLine.innerHTML = '<span class="s">  </span><pre style="margin:0;padding:0;line-height:1.4;white-space:pre;color:#b0b0b0;font-family:inherit">' + art + '</pre>';
        twOutput.appendChild(outLine);

        if (twBody) twBody.scrollTop = twBody.scrollHeight;
    }

    function exec(cmd) {
        var raw = cmd.trim();
        if (!raw) return;

        cmdHistory.push(raw);
        historyIndex = cmdHistory.length;
        var lower = raw.toLowerCase().trim();
        var out = '';

        if (lower === 'help') {
            out = 'help'.padEnd(22) + ' show this help<br>' +
                  'ls'.padEnd(22) + ' list directory<br>' +
                  'cat about.md'.padEnd(22) + ' about me<br>' +
                  'cat skills.json'.padEnd(22) + ' my skills<br>' +
                  'cd ~'.padEnd(22) + ' go home<br>' +
                  'whoami'.padEnd(22) + ' display user<br>' +
                  'hihifetch'.padEnd(22) + ' system info<br>' +
                  'python ml-suite.py'.padEnd(22) + ' open ML suite<br>' +
                  'history'.padEnd(22) + ' command history<br>' +
                  'clear'.padEnd(22) + ' clear terminal<br>' +
                  'date'.padEnd(22) + ' current date<br>' +
                  'pwd'.padEnd(22) + ' print directory<br>' +
                  'exit'.padEnd(22) + ' logout';

        } else if (lower === 'whoami') {
            out = 'subham - CS Student, ML Enthusiast, Python Developer';

        } else if (lower === 'date') {
            out = new Date().toLocaleString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' });

        } else if (lower === 'pwd') {
            out = '/home/subham/' + (currentDir === '~' ? 'portfolio' : currentDir);

        } else if (lower === 'ls' || lower === 'ls -l' || lower === 'ls -la') {
            out = 'total 8<br>' +
                  'drwxr-xr-x  root root  <span style="color:#89dceb">.</span><br>' +
                  'drwxr-xr-x  root root  <span style="color:#89dceb">..</span><br>' +
                  '-rw-r--r--  root root  <span style="color:#c8f7a6">about.md</span><br>' +
                  '-rw-r--r--  root root  <span style="color:#c8f7a6">contact.json</span><br>' +
                  'drwxr-xr-x  root root  <span style="color:#89dceb">projects/</span><br>' +
                  '-rw-r--r--  root root  <span style="color:#c8f7a6">skills.json</span><br>' +
                  '-rw-r--r--  root root  <span style="color:#c8f7a6">updates.log</span><br>' +
                  'drwxr-xr-x  root root  <span style="color:#89dceb">certs/</span>';

        } else if (lower === 'ls projects') {
            out = 'drwxr-xr-x  root root  <span style="color:#89dceb">ml-suite/</span><br>' +
                  '-rwxr-xr-x  root root  <span style="color:#c8f7a6">heart_predict.py</span><br>' +
                  '-rwxr-xr-x  root root  <span style="color:#c8f7a6">cancer_detect.py</span><br>' +
                  '-rw-r--r--  root root  <span style="color:#c8f7a6">portfolio/</span>';

        } else if (lower === 'cat about.md') {
            out = '<span style="color:#c8f7a6">name</span>:   Subham Pathak<br>' +
                  '<span style="color:#c8f7a6">role</span>:   CS Student - ML Engineer<br>' +
                  '<span style="color:#c8f7a6">stack</span>:  AI/ML | GenAI | LLMs<br>' +
                  '<span style="color:#c8f7a6">status</span>: building things<br>' +
                  '<span style="color:#c8f7a6">loc</span>:    India<br>' +
                  '<span style="color:#c8f7a6">email</span>:  lastw5232@gmail.com';

        } else if (lower === 'cat skills.json') {
            out = '{<br>' +
                  '  <span style="color:#c8f7a6">"python"</span>:        "NumPy, Pandas, TensorFlow, Scikit-learn"<br>' +
                  '  <span style="color:#c8f7a6">"ml"</span>:            "Supervised, Unsupervised, Reinforcement"<br>' +
                  '  <span style="color:#c8f7a6">"deep_learning"</span>: "CNNs, RNNs, Transformers, NLP"<br>' +
                  '  <span style="color:#c8f7a6">"genai"</span>:         "GPT, Prompt Engineering, AI Agents, RAG"<br>' +
                  '  <span style="color:#c8f7a6">"web"</span>:           "HTML, CSS, JavaScript, FastAPI"<br>' +
                  '  <span style="color:#c8f7a6">"tools"</span>:         "Git, Linux, Docker, Vim"<br>' +
                  '}';

        } else if (lower === 'cat updates.log') {
            out = '2025.05  Exploring AI Agents<br>' +
                  '2025.04  Building RAG Systems<br>' +
                  '2025.03  PyTorch Deep Dive<br>' +
                  '2025.02  FastAPI Portfolio';

        } else if (lower === 'cat contact.json') {
            out = '{<br>' +
                  '  <span style="color:#c8f7a6">"email"</span>:    "lastw5232@gmail.com"<br>' +
                  '  <span style="color:#c8f7a6">"location"</span>: "India"<br>' +
                  '  <span style="color:#c8f7a6">"github"</span>:   "itzsubham2006"<br>' +
                  '  <span style="color:#c8f7a6">"linkedin"</span>: "subhampathak"<br>' +
                  '}';

        } else if (lower === 'cd ~' || lower === 'cd home') {
            currentDir = '~';
            updatePrompt();
        } else if (lower === 'cd ..') {
            if (currentDir !== '~') { currentDir = '~'; updatePrompt(); }
        } else if (lower === 'cd /') {
            currentDir = '/';
            updatePrompt();
        } else if (lower === 'cd projects') {
            currentDir = 'projects';
            updatePrompt();
        } else if (lower === 'cd about' || lower === 'cd skills') {
            updatePrompt();
        } else if (lower === 'python ml-suite.py' || lower === 'python3 ml-suite.py') {
            window.location.href = '/system'; return;
        } else if (lower === 'python heart_predict.py' || lower === 'python3 heart_predict.py') {
            window.location.href = '/heart'; return;
        } else if (lower === 'python cancer_detect.py' || lower === 'python3 cancer_detect.py') {
            window.location.href = '/cancer'; return;

        } else if (lower === 'hihifetch') {
            showHihifetch(); return;

        } else if (lower === 'uname -a') {
            out = 'PortfolioOS 5.15.0-sublime #1 SMP PREEMPT subham@portfolio x86_64 GNU/Linux';
        } else if (lower === 'uptime') {
            out = ' 12:34:56 up 999 days,  load average: 0.42, 0.37, 0.28';

        } else if (lower === 'clear' || lower === 'cls') {
            clearTerminal(); return;

        } else if (lower === 'history') {
            var lines = [];
            for (var i = 0; i < cmdHistory.length; i++) {
                lines.push('  ' + String(i + 1).padStart(3) + '  ' + cmdHistory[i]);
            }
            out = lines.join('<br>');

        } else if (lower === 'echo hello') {
            out = 'hello';
        } else if (lower === 'echo $(whoami)') {
            out = 'subham';
        } else if (lower === 'sudo') {
            out = '<span style="color:#ff6b6b">nice try.</span><br><span style="color:#ffd93d">you are already root here :)</span>';
        } else if (lower === 'top') {
            out = 'top - 12:34:56 up 999 days<br><br>' +
                  '  PID  COMMAND           CPU%  MEM%<br>' +
                  '    1  bash               0.0   0.1<br>' +
                  '    2  python (ml)       45.2  12.3<br>' +
                  '    3  thinking          99.9  89.7<br>' +
                  '    4  learning          87.3  67.4<br>' +
                  '    5  coffee            23.1   2.1';
        } else if (lower === 'exit') {
            out = '<span style="color:#ffd93d">logout</span><br><br>Session closed. Reconnect anytime.';
            setTimeout(function() { if (twOutput) twOutput.innerHTML = ''; }, 2000);
        } else {
            out = '<span style="color:#ff6b6b">bash: ' + esc(raw) + ': command not found</span><br>' +
                  "Type '<span style=\"color:#c8f7a6\">help</span>' for available commands.";
        }

        addLine(raw, out);
    }

    var cmdKeys = ['help','whoami','date','ls','ls -la','ls projects','cat about.md','cat skills.json','cat updates.log','cat contact.json','cd ~','cd ..','cd /','cd projects','cd home','python ml-suite.py','python heart_predict.py','python cancer_detect.py','hihifetch','pwd','clear','history','echo hello','echo $(whoami)','sudo','top','uname -a','uptime','exit','ls -l','cd about','cd skills'];

    if (cmdInput) {
        cmdInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                exec(cmdInput.value);
                cmdInput.value = '';
                if (cmdHint) cmdHint.classList.remove('show');
            } else if (e.key === 'Tab') {
                e.preventDefault();
                var p = cmdInput.value;
                for (var i = 0; i < cmdKeys.length; i++) {
                    if (cmdKeys[i].startsWith(p) && cmdKeys[i] !== p) {
                        cmdInput.value = cmdKeys[i]; break;
                    }
                }
                if (cmdHint) cmdHint.classList.remove('show');
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) { historyIndex--; cmdInput.value = cmdHistory[historyIndex] || ''; }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < cmdHistory.length - 1) { historyIndex++; cmdInput.value = cmdHistory[historyIndex] || ''; }
                else { historyIndex = cmdHistory.length; cmdInput.value = ''; }
            } else if (e.key === 'Escape') {
                if (keyboardHelp) keyboardHelp.classList.remove('show');
                if (cmdHint) cmdHint.classList.remove('show');
            }
        });

        cmdInput.addEventListener('input', function() {
            var v = cmdInput.value;
            if (v && v.length > 0 && cmdHint && cmdText) {
                var m = null;
                for (var i = 0; i < cmdKeys.length; i++) {
                    if (cmdKeys[i].startsWith(v) && cmdKeys[i] !== v) { m = cmdKeys[i]; break; }
                }
                if (m) { cmdHint.classList.add('show'); cmdText.textContent = m; }
                else { cmdHint.classList.remove('show'); }
            } else { if (cmdHint) cmdHint.classList.remove('show'); }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.ctrlKey && e.key === 'l') { e.preventDefault(); clearTerminal(); return; }

        switch (e.key) {
            case '?': if (keyboardHelp) keyboardHelp.classList.toggle('show'); break;
            case 'a': exec('cat about.md'); break;
            case 's': exec('cat skills.json'); break;
            case 'p': exec('ls'); break;
            case 'm': window.location.href = '/system'; break;
            case '/': e.preventDefault(); if (cmdInput) cmdInput.focus(); break;
            case 'n': showHihifetch(); break;
            case 'Escape': if (keyboardHelp) keyboardHelp.classList.remove('show'); if (cmdHint) cmdHint.classList.remove('show'); break;
        }
    });

    if (helpCloseBtn) {
        helpCloseBtn.addEventListener('click', function() { if (keyboardHelp) keyboardHelp.classList.remove('show'); });
    }

    var hintEls = document.querySelectorAll('[data-cmd]');
    for (var i = 0; i < hintEls.length; i++) {
        (function(el) {
            el.addEventListener('mouseenter', function() {
                if (cmdHint && cmdText) { cmdHint.classList.add('show'); cmdText.textContent = el.getAttribute('data-cmd'); }
            });
            el.addEventListener('mouseleave', function() { if (cmdHint) cmdHint.classList.remove('show'); });
        })(hintEls[i]);
    }

    var qcBtns = document.querySelectorAll('.qc-btn');
    for (var i = 0; i < qcBtns.length; i++) {
        (function(btn) {
            btn.addEventListener('click', function() {
                if (cmdInput) { cmdInput.value = btn.getAttribute('data-cmd'); cmdInput.focus(); }
            });
        })(qcBtns[i]);
    }

    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        var nla = navLinks.querySelectorAll('a');
        for (var i = 0; i < nla.length; i++) {
            nla[i].addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        }
    }

    var tabBtns = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabBtns.length; i++) {
        (function(btn) {
            btn.addEventListener('click', function() {
                var all = document.querySelectorAll('.tab-btn');
                for (var j = 0; j < all.length; j++) all[j].classList.remove('active');
                var allC = document.querySelectorAll('.tab-content');
                for (var j = 0; j < allC.length; j++) allC[j].classList.remove('active');
                btn.classList.add('active');
                var target = document.getElementById(btn.getAttribute('data-tab'));
                if (target) target.classList.add('active');
            });
        })(tabBtns[i]);
    }

    var scrollLinks = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < scrollLinks.length; i++) {
        (function(a) {
            a.addEventListener('click', function(e) {
                var t = document.querySelector(a.getAttribute('href'));
                if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
            });
        })(scrollLinks[i]);
    }

    var animEls = document.querySelectorAll('.skill-card, .p-row');
    for (var i = 0; i < animEls.length; i++) {
        (function(el, idx) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(6px)';
            setTimeout(function() {
                el.style.transition = 'opacity 0.25s, transform 0.25s';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 150 + idx * 40);
        })(animEls[i], i);
    }

    updatePrompt();
})();
