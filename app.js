const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const runningAnimations = new Set();
const elementAnimations = new WeakMap();
const pendingReveals = new Set();
let revealObserver;

function animateElements(elements, {distance = 14, duration = 440, stagger = 45, opacity = 0} = {}) {
  if (motionPreference.matches || document.hidden) return;
  Array.from(elements).forEach((element, index) => {
    if (!element.animate) return;
    elementAnimations.get(element)?.cancel();
    const animation = element.animate(
      [{opacity, translate: `0 ${distance}px`}, {opacity: 1, translate: '0 0'}],
      {duration, delay: index * stagger, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'}
    );
    elementAnimations.set(element, animation);
    runningAnimations.add(animation);
    animation.finished.then(() => runningAnimations.delete(animation), () => runningAnimations.delete(animation));
  });
}

function revealImmediately(element) {
  if (!element) return;
  element.classList.add('is-revealed');
  pendingReveals.delete(element);
  revealObserver?.unobserve(element);
}

function initializeMotion() {
  if (motionPreference.matches) return;
  document.body.classList.add('motion-ready');
  if (!('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) revealImmediately(entry.target);
    });
  }, {threshold: 0, rootMargin: '0px 0px -30px 0px'});
  document.querySelectorAll('.section-heading, .career-card, .focus-card, .skills-tabs, .skill-panel, .languages, .approach-layout, .featured-project, .contact-section').forEach(element => {
    revealObserver.observe(element);
    // Never conceal content already on screen, including restored scroll positions.
    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight && bounds.bottom > 0) return;
    element.classList.add('reveal-item');
    if (element.matches('.focus-card')) element.style.setProperty('--reveal-delay', `${Array.from(element.parentElement.children).indexOf(element) * 85}ms`);
    pendingReveals.add(element);
  });
}

document.addEventListener('focusin', event => revealImmediately(event.target.closest('.reveal-item')));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) runningAnimations.forEach(animation => animation.finish());
});
motionPreference.addEventListener('change', event => {
  if (!event.matches) return;
  runningAnimations.forEach(animation => animation.cancel());
  revealObserver?.disconnect();
  pendingReveals.forEach(element => element.classList.add('is-revealed'));
  pendingReveals.clear();
  document.body.classList.remove('motion-ready');
});

const skills = {
  backend: {kicker:'POR TRÁS DA INTERFACE',title:'Estrutura para\ncada aplicação.',description:'Desenvolvimento de APIs e serviços que conectam regras de negócio, dados e interfaces.',points:['Arquitetura de serviços e modelagem de sistemas','Autenticação e operações CRUD','Organização de projetos e APIs','Integração entre front-end e back-end'],tiles:[['JS','Node.js','Runtime JavaScript','green'],['ex','Express.js','APIs e serviços',''],['N','NestJS','Arquitetura modular','purple'],['.NET','.NET','Ecossistema C#','purple'],['C#','ASP.NET Core','Aplicações e APIs',''],['{ }','APIs RESTful','Integração de serviços','green']]},
  dados: {kicker:'INFORMAÇÃO COM CONTEXTO',title:'Dados organizados.\nAnálises claras.',description:'Bancos relacionais, consultas otimizadas e automação para organizar, transformar e analisar informações.',points:['Modelagem de dados e estruturação de bancos relacionais','Consultas SQL, Stored Procedures e otimização de queries','ETL e automação de processos','Desenvolvimento de relatórios e análise de dados'],tiles:[['SQL','SQL Server','Microsoft SQL Server','purple'],['Pg','PostgreSQL','Banco relacional',''],['Ora','Oracle','Banco relacional',''],['Py','Python','Automação e análise','green'],['BI','Power BI','Relatórios e visualização','purple'],['↔','ETL','Extração e transformação','green']]},
  integracoes: {kicker:'SISTEMAS EM SINTONIA',title:'Conectar aplicações.\nIntegrar processos.',description:'Integração entre aplicações, APIs, bancos de dados e ERP TOTVS Protheus.',points:['Customizações e rotinas automatizadas em AdvPL','Consultas a tabelas Protheus','Integração com sistemas externos','Manipulação de JSON e integração entre APIs e bancos'],tiles:[['T','TOTVS Protheus','Integrações de ERP','purple'],['ADV','AdvPL','Customizações e rotinas',''],['API','APIs REST','Comunicação entre sistemas','green'],['{ }','JSON','Intercâmbio de dados',''],['DB','Bancos de dados','Integração com aplicações','purple'],['↻','Automação','Rotinas de integração','green']]},
  interfaces: {kicker:'A SOLUÇÃO NA TELA',title:'Interfaces claras.\nExperiências conectadas.',description:'Aplicações web responsivas e mobile, conectadas ao backend por meio de APIs.',points:['React.js, HTML5, CSS3 e JavaScript','Construção de aplicações web e interfaces responsivas','Flutter e Dart para aplicações multiplataforma','Integração entre interfaces, autenticação e APIs'],tiles:[['⚛','React.js','Interfaces web','purple'],['H5','HTML5','Estrutura semântica',''],['C3','CSS3','Layouts responsivos','green'],['JS','JavaScript','Interação na web',''],['F','Flutter','Aplicações multiplataforma','purple'],['D','Dart','Desenvolvimento mobile','green']]},
  ferramentas: {kicker:'DESENVOLVER E SUSTENTAR',title:'Do desenvolvimento\nà manutenção.',description:'Ferramentas para versionamento, ambientes de desenvolvimento e homologação, diagnóstico e sustentação.',points:['Git e GitFlow para organização do código','Gerenciamento de ambientes de desenvolvimento e homologação','Diagnóstico de falhas, depuração e análise de logs','Correção de bugs e otimização de aplicações'],tiles:[['git','Git & GitFlow','Versionamento de código','purple'],['▤','Docker','Contêineres e ambientes',''],['>_','Linux','Sistemas e ambientes','green'],['WS','Windows Server','Ambientes de servidor',''],['{ }','Swagger','Documentação de APIs','purple'],['↻','Sustentação','Logs, debugging e correções','green']]}
};
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panel = document.getElementById('skill-panel');
function selectCategory(category) {
  const data = skills[category];
  if (!data) return;
  if (panel.getAttribute('aria-labelledby') === `tab-${category}`) return;
  tabs.forEach(tab => {const active = tab.dataset.category === category;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
  panel.setAttribute('aria-labelledby',`tab-${category}`);
  document.getElementById('skill-kicker').textContent = data.kicker;
  document.getElementById('skill-title').replaceChildren(...titleLines(data.title));
  document.getElementById('skill-description').textContent = data.description;
  document.getElementById('skill-points').replaceChildren(...data.points.map(point => {const li=document.createElement('li');li.textContent=point;return li;}));
  document.getElementById('skill-tiles').replaceChildren(...data.tiles.map(([symbol,name,description,color])=>{const tile=document.createElement('div');tile.className='skill-tile';const icon=document.createElement('span');icon.className=`skill-symbol ${color}`;icon.textContent=symbol;icon.setAttribute('aria-hidden','true');const strong=document.createElement('strong');strong.textContent=name;const sub=document.createElement('span');sub.textContent=description;tile.append(icon,strong,sub);return tile;}));
  revealImmediately(panel);
  animateElements(document.querySelectorAll('.skill-tile'), {distance: 10, duration: 360, stagger: 35});
  animateElements(document.querySelectorAll('.skill-detail'), {distance: 8, duration: 400});
}
function titleLines(text){return text.split('\n').flatMap((line,index)=>index?[document.createElement('br'),document.createTextNode(line)]:[document.createTextNode(line)]);}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectCategory(tab.dataset.category));
  tab.addEventListener('keydown',event=>{let target;if(event.key==='ArrowRight')target=(index+1)%tabs.length;else if(event.key==='ArrowLeft')target=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')target=0;else if(event.key==='End')target=tabs.length-1;else return;event.preventDefault();selectCategory(tabs[target].dataset.category);tabs[target].focus();tabs[target].scrollIntoView({block:'nearest',inline:'nearest'});});
});
const steps=[
  {label:'01 / ESTRUTURAR',title:'A solução começa\npela base.',description:'Modelagem de sistemas e bancos relacionais, organização de serviços e desenvolvimento de APIs com regras de negócio claras.',tags:['APIs RESTful','Arquitetura de serviços','Modelagem de dados'],highlight:1},
  {label:'02 / CONECTAR',title:'Cada parte precisa\nconversar com o todo.',description:'Integração entre front-end, backend e bancos de dados, conectando aplicações web, mobile e o ERP TOTVS Protheus.',tags:['React & Flutter','APIs REST','Protheus & AdvPL'],highlight:0},
  {label:'03 / ENTENDER',title:'Informação útil\npara olhar além.',description:'Consultas SQL, ETL e automação com Python para preparar os dados. Relatórios em Power BI para explorar e comunicar as informações.',tags:['SQL & Python','ETL & automação','Power BI'],highlight:2}
];
document.querySelectorAll('.flow-step').forEach(button=>button.addEventListener('click',()=>{if(button.getAttribute('aria-pressed')==='true')return;const data=steps[Number(button.dataset.step)];document.querySelectorAll('.flow-step').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});document.getElementById('flow-label').textContent=data.label;document.getElementById('flow-title').replaceChildren(...titleLines(data.title));document.getElementById('flow-description').textContent=data.description;document.getElementById('flow-tags').replaceChildren(...data.tags.map(tag=>{const span=document.createElement('span');span.textContent=tag;return span;}));document.querySelectorAll('.flow-decoration span').forEach((span,index)=>span.classList.toggle('highlight',index===data.highlight));animateElements(document.querySelectorAll('#flow-label, #flow-title, #flow-description, #flow-tags'),{distance:8,duration:330,stagger:30,opacity:.25});}));
const menu = document.getElementById('menu-toggle');
const navigation = document.getElementById('navigation');
const mobileNav = window.matchMedia('(max-width: 600px)');
const navLinks = Array.from(navigation.querySelectorAll('a[href^="#"]'));

function setMenuOpen(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('open', open);
}

menu.addEventListener('click', () => {
  setMenuOpen(menu.getAttribute('aria-expanded') === 'false');
});

navLinks.forEach(link => link.addEventListener('click', event => {
  if (menu.getAttribute('aria-expanded') !== 'true' || event.defaultPrevented ||
      event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
  setMenuOpen(false);
  target.focus({preventScroll: true});
}));

function dismissMenuOutside(target) {
  if (menu.getAttribute('aria-expanded') === 'true' &&
      !menu.contains(target) && !navigation.contains(target)) setMenuOpen(false);
}

document.addEventListener('focusin', event => dismissMenuOutside(event.target));
document.addEventListener('click', event => {
  if (event.detail > 0) dismissMenuOutside(event.target);
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || menu.getAttribute('aria-expanded') !== 'true') return;
  setMenuOpen(false);
  menu.focus();
});

mobileNav.addEventListener('change', event => {
  if (event.matches && navigation.contains(document.activeElement)) menu.focus();
  if (!event.matches && document.activeElement === menu) navLinks[0]?.focus();
  setMenuOpen(false);
});

document.documentElement.classList.add('menu-ready');
const themeButton=document.getElementById('theme-toggle');
function setTheme(theme){document.documentElement.dataset.theme=theme;themeButton.setAttribute('aria-label',theme==='dark'?'Ativar tema claro':'Ativar tema escuro');document.querySelector('meta[name="theme-color"]').content=theme==='dark'?'#080b10':'#f4f7fb';}
try{const theme=localStorage.getItem('vinicius-portfolio-theme');if(theme==='light'||theme==='dark')setTheme(theme);}catch{}
themeButton.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';setTheme(theme);try{localStorage.setItem('vinicius-portfolio-theme',theme);}catch{}});
document.getElementById('year').textContent=new Date().getFullYear();
const navSections = navLinks.flatMap(link => {
  const section = document.getElementById(link.hash.slice(1));
  return section ? [{link, section}] : [];
});
let activeNavLink;

function updateActiveNavLink() {
  const viewport = document.documentElement;
  const anchorLine = (parseFloat(getComputedStyle(viewport).scrollPaddingTop) || 0) + 1;
  const atPageEnd = window.scrollY > 0 && window.scrollY + window.innerHeight >= viewport.scrollHeight - 1;
  const finalSection = navSections.at(-1);
  // The final section may be too short to reach the anchor line.
  const current = atPageEnd && finalSection?.section.getBoundingClientRect().top < window.innerHeight
    ? finalSection
    : navSections.find(({section}) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= anchorLine && bounds.bottom > anchorLine;
    });

  if (activeNavLink === current?.link) return;
  activeNavLink?.classList.remove('active');
  activeNavLink?.removeAttribute('aria-current');
  activeNavLink = current?.link;
  activeNavLink?.classList.add('active');
  activeNavLink?.setAttribute('aria-current', 'location');
}

window.addEventListener('scroll', updateActiveNavLink, {passive: true});
window.addEventListener('resize', updateActiveNavLink);
updateActiveNavLink();
initializeMotion();
