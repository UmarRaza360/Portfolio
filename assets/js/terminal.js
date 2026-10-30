/**
 * TERMINAL & BOOT SEQUENCE ENGINE
 * Muhammad Umar Raza - Ultra-Premium Developer Experience
 */

(function () {
  'use strict';

  // --- 1. BOOT SEQUENCE FOR LOADING SCREEN ---
  const bootLogs = [
    { text: 'system.init() :: starting developer kernel v4.19', type: 't-dim' },
    { text: 'loading hardware abstraction layer & memory maps...', type: 't-dim' },
    { text: 'mounting Shopify Liquid templating engine [OK]', type: 't-success' },
    { text: 'initializing Laravel 10.x MVC backend subsystem [OK]', type: 't-success' },
    { text: 'establishing secure handshake with api.github.com/users/UmarRaza360...', type: 't-accent' },
    { text: 'binding semantic UI grid & high-conversion checkout pipelines...', type: 't-dim' },
    { text: 'ready: Muhammad Umar Raza Portfolio Profile loaded (100%)', type: 't-success' }
  ];

  function runBootSequence() {
    const screen = document.getElementById('loadingScreen');
    const logsContainer = document.getElementById('bootTerminalLogs');
    const progressBar = document.getElementById('bootProgressBar');
    const percentLabel = document.getElementById('bootPercentLabel');
    const skipBtn = document.getElementById('bootSkipBtn');

    if (!screen || !logsContainer) return;

    let currentIndex = 0;
    let progress = 0;
    let isSkipped = false;

    function finish() {
      if (isSkipped) return;
      isSkipped = true;
      if (progressBar) progressBar.style.width = '100%';
      if (percentLabel) percentLabel.textContent = '100%';
      setTimeout(() => {
        screen.classList.add('is-loaded');
        document.body.style.overflow = '';
      }, 350);
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', finish);
    }

    // Auto-advance progress
    const progressInterval = setInterval(() => {
      if (isSkipped) {
        clearInterval(progressInterval);
        return;
      }
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress > 100) progress = 100;
      if (progressBar) progressBar.style.width = `${progress}%`;
      if (percentLabel) percentLabel.textContent = `${progress}%`;

      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(finish, 400);
      }
    }, 90);

    // Stream terminal lines
    function streamNextLine() {
      if (isSkipped || currentIndex >= bootLogs.length) return;
      const log = bootLogs[currentIndex];
      const lineEl = document.createElement('div');
      lineEl.className = 'terminal-line';
      lineEl.innerHTML = `<span class="t-prompt">➜</span> <span class="${log.type}">${log.text}</span>`;
      logsContainer.appendChild(lineEl);
      logsContainer.scrollTop = logsContainer.scrollHeight;

      currentIndex++;
      if (currentIndex < bootLogs.length) {
        setTimeout(streamNextLine, 180);
      }
    }

    setTimeout(streamNextLine, 120);

    // Fallback safe timeout (never block visitor)
    setTimeout(finish, 2400);
  }

  // --- 2. INTERACTIVE HERO TERMINAL CLI ---
  function initInteractiveCli() {
    const cliInput = document.getElementById('devCliInput');
    const cliOutput = document.getElementById('devCliOutput');
    const devChips = document.querySelectorAll('.dev-chip');

    if (!cliInput || !cliOutput) return;

    const COMMANDS = {
      help: `Available commands:
• <span class="t-accent">about</span>    - View background & engineering focus
• <span class="t-accent">skills</span>   - List core technical stack
• <span class="t-accent">projects</span> - View featured production work
• <span class="t-accent">contact</span>  - Display direct contact channels
• <span class="t-accent">resume</span>   - Download verified resume PDF
• <span class="t-accent">hire</span>     - Send an urgent inquiry
• <span class="t-accent">clear</span>    - Clear the terminal console`,

      about: `<span class="t-success">Muhammad Umar Raza</span> - Shopify & E-commerce Specialist | Full Stack Developer
Based in Peshawar, PK. Working at <span class="t-accent">EncoderBytes Pvt Ltd</span>.
Specializes in custom Shopify themes, Liquid, Laravel MVC architectures, and e-commerce growth.`,

      skills: `Frontend:  HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, jQuery
Backend:   PHP 8, Laravel MVC, MySQL, RESTful APIs
Shopify:   Liquid Templating, Theme Customization, Storefront API
Tools:     Git, GitHub, Postman, VS Code, Figma`,

      projects: `1. <span class="t-accent">Trésora & Zahir Luxury Storefronts</span> (Shopify / Liquid)
2. <span class="t-accent">Enterprise Order CRM</span> (Laravel / MySQL / Auth)
3. <span class="t-accent">Green-ETG Platform</span> (Modern Responsive Frontend)
4. <span class="t-accent">FinancePulse Dashboard</span> (Financial UI Architecture)`,

      contact: `• Email:     <a href="mailto:umark23898@gmail.com" class="t-accent">umark23898@gmail.com</a>
• Phone:     +92 315 6616617
• LinkedIn:  <a href="https://www.linkedin.com/in/umar-raza-5b02aa302/" target="_blank" class="t-accent">linkedin.com/in/umar-raza-5b02aa302/</a>
• GitHub:    <a href="https://github.com/UmarRaza360" target="_blank" class="t-accent">github.com/UmarRaza360</a>`,

      resume: `Redirecting to resume download... <span class="t-success">[OK]</span>`,

      hire: `Opening contact section... Ready to build great products together!`,

      clear: 'CLEAR_ACTION'
    };

    function appendOutput(html, isCmd = false) {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      if (isCmd) {
        line.innerHTML = `<span class="t-prompt">raza@commerce-os:~$</span> <span class="t-cmd">${html}</span>`;
      } else {
        line.innerHTML = html;
        line.style.display = 'block';
        line.style.marginBottom = '0.6rem';
      }
      cliOutput.appendChild(line);
      cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    function handleCommand(rawCmd) {
      const cmd = rawCmd.trim().toLowerCase();
      if (!cmd) return;

      appendOutput(rawCmd, true);

      if (cmd === 'clear') {
        cliOutput.innerHTML = '';
        return;
      }

      if (cmd === 'resume') {
        appendOutput(COMMANDS.resume);
        const resumeLink = document.createElement('a');
        resumeLink.href = 'assets/resume/Muhammad_Umar_Raza_Resume.pdf';
        resumeLink.download = 'Muhammad_Umar_Raza_Resume.pdf';
        resumeLink.target = '_blank';
        document.body.appendChild(resumeLink);
        resumeLink.click();
        document.body.removeChild(resumeLink);
        return;
      }

      if (cmd === 'hire') {
        appendOutput(COMMANDS.hire);
        const contactSec = document.getElementById('contact');
        if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      if (COMMANDS[cmd]) {
        appendOutput(COMMANDS[cmd]);
      } else {
        appendOutput(`<span class="t-warn">Command not recognized: "${rawCmd}". Type '<span class="t-accent">help</span>' for available commands.</span>`);
      }
    }

    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleCommand(cliInput.value);
        cliInput.value = '';
      }
    });

    devChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          cliInput.value = cmd;
          handleCommand(cmd);
          cliInput.value = '';
        }
      });
    });
  }

  // --- 3. TERMINAL VS CODE TAB TOGGLE ---
  function initTerminalTabs() {
    const tabs = document.querySelectorAll('.dev-tab');
    const cliPane = document.getElementById('cliTerminalPane');
    const editorPane = document.getElementById('codeEditorPane');

    if (!tabs.length || !cliPane || !editorPane) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.getAttribute('data-pane');
        if (target === 'cli') {
          cliPane.style.display = 'block';
          editorPane.style.display = 'none';
        } else {
          cliPane.style.display = 'none';
          editorPane.style.display = 'block';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    runBootSequence();
    initInteractiveCli();
    initTerminalTabs();
  });
})();
