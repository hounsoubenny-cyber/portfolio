// ─── THEME TOGGLE ───
(function() {
    const html = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    const toggleMobile = document.getElementById('themeToggleMobile');

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const icon = theme === 'dark' ? '☀️' : '🌙';
        if (toggle) toggle.textContent = icon;
        if (toggleMobile) toggleMobile.textContent = icon;
    }

    // Détecter le thème sauvegardé ou préférer le dark
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);

    function switchTheme() {
        const current = html.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    }

    if (toggle) toggle.addEventListener('click', switchTheme);
    if (toggleMobile) toggleMobile.addEventListener('click', switchTheme);
})();

// ─── CANVAS PARTICLES ───
const canvas=document.getElementById('bgCanvas');
const ctx=canvas.getContext('2d');
let W,H,particles=[];
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
resize();window.addEventListener('resize',resize);

class Particle{
    constructor(){this.reset()}
    reset(){
        this.x=Math.random()*W;
        this.y=Math.random()*H;
        this.vx=(Math.random()-0.5)*0.3;
        this.vy=(Math.random()-0.5)*0.3;
        this.r=Math.random()*1.5+0.3;
        this.alpha=Math.random()*0.4+0.05;
        this.color=Math.random()>0.6?'0,212,255':'123,47,255';
    }
    update(){
        this.x+=this.vx;this.y+=this.vy;
        if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset();
    }
    draw(){
        ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${this.color},${this.alpha})`;ctx.fill();
    }
}

for(let i=0;i<120;i++)particles.push(new Particle());

function drawConnections(){
    for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
            const dx=particles[i].x-particles[j].x;
            const dy=particles[i].y-particles[j].y;
            const d=Math.sqrt(dx*dx+dy*dy);
            if(d<120){
                ctx.beginPath();
                ctx.moveTo(particles[i].x,particles[i].y);
                ctx.lineTo(particles[j].x,particles[j].y);
                ctx.strokeStyle=`rgba(0,212,255,${0.04*(1-d/120)})`;
                ctx.lineWidth=0.5;ctx.stroke();
            }
        }
    }
}

function loop(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{p.update();p.draw()});
    drawConnections();
    requestAnimationFrame(loop);
}loop();

// ─── CURSOR ───
const curDot=document.getElementById('curDot');
const curRing=document.getElementById('curRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    curDot.style.left=mx+'px';curDot.style.top=my+'px';
});
(function animRing(){
    rx+=(mx-rx)*0.13;ry+=(my-ry)*0.13;
    curRing.style.left=rx+'px';curRing.style.top=ry+'px';
    requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.skill-card,.proj-card,.service-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
        curDot.querySelector('.cur-dot').style.transform='translate(-50%,-50%) scale(2.5)';
        curRing.querySelector('.cur-ring').style.transform='translate(-50%,-50%) scale(1.6)';
        curRing.querySelector('.cur-ring').style.opacity='0.3';
    });
    el.addEventListener('mouseleave',()=>{
        curDot.querySelector('.cur-dot').style.transform='translate(-50%,-50%) scale(1)';
        curRing.querySelector('.cur-ring').style.transform='translate(-50%,-50%) scale(1)';
        curRing.querySelector('.cur-ring').style.opacity='1';
    });
});

// ─── REVEAL ───
const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
        if(e.isIntersecting){
            e.target.classList.add('visible');
            e.target.querySelectorAll('.lang-fill').forEach(b=>b.classList.add('animate'));
            observer.unobserve(e.target);
        }
    });
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// ─── MOBILE MENU ───
const hamburger=document.getElementById('hamburger');
const mobileMenu=document.getElementById('mobileMenu');
hamburger.addEventListener('click',()=>{
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});
function closeMenu(){
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
}

// ─── LANG ───
function setLang(l){
    document.getElementById('btnEN').classList.toggle('active',l==='en');
    document.getElementById('btnFR').classList.toggle('active',l==='fr');
    document.querySelectorAll('[data-en]').forEach(el=>{
        const txt=el.getAttribute('data-'+l);
        if(txt)el.innerHTML=txt;
    });
}

// ─── NAV ACTIVE ───
const sections=document.querySelectorAll('section[id]');
const navLinks=document.querySelectorAll('.nav-link');
window.addEventListener('scroll',()=>{
    let current='';
    sections.forEach(s=>{
        if(window.scrollY>=s.offsetTop-100)current=s.id;
    });
        navLinks.forEach(l=>{
            l.style.color=l.getAttribute('href')==='#'+current?'var(--cyan)':'';
        });
},{passive:true});

// ─── FLIP AVATAR AUTOMATIQUE ───
setInterval(function(){
    const hex = document.querySelector('.avatar-hex');
    if (hex) hex.classList.toggle('flipped');
}, 4000);
