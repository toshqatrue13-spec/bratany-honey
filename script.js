// ===== 3D HONEYCOMB BG =====
(function(){
  var canvas=document.getElementById('bgCanvas'),ctx=canvas.getContext('2d');
  var W,H,hexes=[],mouse={x:9999,y:9999},time=0;
  var COLORS=[[245,166,35],[232,131,10],[255,107,26],[200,100,0],[180,80,0]];
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;buildGrid()}
  function buildGrid(){
    hexes=[];var size=36,w=size*2,h=Math.sqrt(3)*size;
    var cols=Math.ceil(W/(w*.75))+3,rows=Math.ceil(H/h)+3;
    for(var r=-1;r<rows;r++)for(var c=-1;c<cols;c++){
      hexes.push({x:c*w*.75,y:r*h+(c%2===0?0:h/2),size:size,phase:Math.random()*Math.PI*2,colorIdx:Math.floor(Math.random()*COLORS.length)});
    }
  }
  function hexPath(x,y,s){ctx.beginPath();for(var i=0;i<6;i++){var a=Math.PI/180*(60*i-30);i===0?ctx.moveTo(x+s*Math.cos(a),y+s*Math.sin(a)):ctx.lineTo(x+s*Math.cos(a),y+s*Math.sin(a))}ctx.closePath()}
  function draw(){
    ctx.clearRect(0,0,W,H);time+=.008;
    for(var i=0;i<hexes.length;i++){
      var h=hexes[i],dx=h.x-mouse.x,dy=h.y-mouse.y,dist=Math.sqrt(dx*dx+dy*dy);
      var mw=Math.max(0,1-dist/300)*.6;
      var wave=(Math.sin(time+h.x/120+h.phase)*.5+Math.sin(time*.7+h.y/100)*.3);
      var intensity=Math.min(1,(wave+1)/2+Math.sin(time*3-dist/60)*mw+mw*.3);
      var c=COLORS[h.colorIdx];
      hexPath(h.x,h.y,h.size-2);
      ctx.fillStyle='rgba('+c[0]+','+c[1]+','+c[2]+','+(.04+intensity*.13)+')';ctx.fill();
      ctx.strokeStyle='rgba('+c[0]+','+c[1]+','+c[2]+','+(.06+intensity*.22)+')';ctx.lineWidth=1;ctx.stroke();
      if(intensity>.7){ctx.beginPath();ctx.arc(h.x,h.y,2,0,Math.PI*2);ctx.fillStyle='rgba(255,220,100,'+(intensity*.4)+')';ctx.fill()}
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY+window.scrollY});
  window.addEventListener('touchmove',function(e){if(e.touches[0]){mouse.x=e.touches[0].clientX;mouse.y=e.touches[0].clientY+window.scrollY}},{passive:true});
  window.addEventListener('resize',resize);resize();draw();
})();

// ===== BEES =====
(function(){
  var isMobile=window.innerWidth<=768;
  var count=isMobile?2:5,sizeMin=isMobile?11:22,sizeMax=isMobile?15:32;
  var wrap=document.getElementById('beeWrap'),bees=[];
  for(var i=0;i<count;i++){
    var el=document.createElement('div');el.className='bee';
    var sz=sizeMin+Math.random()*(sizeMax-sizeMin);
    el.style.fontSize=sz+'px';el.style.opacity=isMobile?'.4':'.6';
    el.textContent='🐝';
    bees.push({el:el,x:Math.random()*window.innerWidth,y:80+Math.random()*(window.innerHeight-80),vx:(Math.random()-.5)*1.4,vy:(Math.random()-.5)*.8,wobble:Math.random()*Math.PI*2,wobbleSpeed:.02+Math.random()*.02,wobbleAmp:isMobile?12:28});
    wrap.appendChild(el);
  }
  function animBees(){
    var W=window.innerWidth;
    for(var i=0;i<bees.length;i++){
      var b=bees[i];b.wobble+=b.wobbleSpeed;b.x+=b.vx;b.y+=b.vy+Math.sin(b.wobble)*.4;
      if(b.x<-60){b.x=-60;b.vx=Math.abs(b.vx)}
      if(b.x>W+60){b.x=W+60;b.vx=-Math.abs(b.vx)}
      if(b.y<80){b.y=80;b.vy=Math.abs(b.vy)}
      if(b.y>window.innerHeight-40){b.y=window.innerHeight-40;b.vy=-Math.abs(b.vy)}
      b.vx+=(Math.random()-.5)*.06;b.vy+=(Math.random()-.5)*.04;
      var spd=Math.sqrt(b.vx*b.vx+b.vy*b.vy),maxS=isMobile?1:1.8;
      if(spd>maxS){b.vx=b.vx/spd*maxS;b.vy=b.vy/spd*maxS}
      b.el.style.transform='translate('+b.x+'px,'+(b.y+Math.sin(b.wobble)*b.wobbleAmp-window.scrollY)+'px) scaleX('+(b.vx<0?-1:1)+')';
    }
    requestAnimationFrame(animBees);
  }
  animBees();
})();

// ===== HONEY CURSOR =====
(function(){
  if(window.innerWidth<=768)return;
  var last=0;
  document.addEventListener('mousemove',function(e){
    var now=Date.now();if(now-last<80)return;last=now;
    var d=document.createElement('div');d.className='honey-drop';
    var sz=4+Math.random()*8;
    d.style.cssText='left:'+(e.clientX-sz/2)+'px;top:'+(e.clientY-sz/2)+'px;width:'+sz+'px;height:'+sz+'px;position:fixed;pointer-events:none;z-index:9999;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:radial-gradient(circle at 40% 40%,rgba(255,220,80,.8),rgba(245,166,35,.4));animation:dropFade .8s ease-out forwards';
    document.body.appendChild(d);setTimeout(function(){d.remove()},800);
  });
})();

// ===== BURGER =====
var burger=document.getElementById('burger');
var mobAcc=document.getElementById('mobAccordion');
var mobileMenu=document.getElementById('mobileMenu');

if(burger){
  burger.addEventListener('click',function(){
    if(mobAcc){
      var isOpen=mobAcc.classList.contains('open');
      if(isOpen){ closeMenu(); } else { openMenu(); }
    } else if(mobileMenu){
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    }
  });
}
if(mobileMenu){
  mobileMenu.addEventListener('click',function(e){if(e.target===mobileMenu)closeMenu();});
}

function openMenu(){
  if(burger) burger.classList.add('open');
  if(mobAcc) mobAcc.classList.add('open');
}
function closeMenu(){
  if(burger) burger.classList.remove('open');
  if(mobAcc) mobAcc.classList.remove('open');
  if(mobileMenu) mobileMenu.classList.remove('open');
  document.querySelectorAll('.mob-acc-section').forEach(function(s){s.classList.remove('open');});
}
function toggleMobAcc(idx){
  var sec=document.getElementById('acc-'+idx);
  if(!sec) return;
  var wasOpen=sec.classList.contains('open');
  document.querySelectorAll('.mob-acc-section').forEach(function(s){s.classList.remove('open');});
  if(!wasOpen) sec.classList.add('open');
}

// ===== DYNAMIC PRICES =====
function updatePrice(weightRow){
  var card = weightRow.closest('.product-card');
  var active = weightRow.querySelector('.weight-tag.active');
  if(!active) return;
  var label = active.textContent.trim();
  var prices = JSON.parse(weightRow.dataset.prices || '{}');
  var olds = JSON.parse(weightRow.dataset.old || '{}');
  var glassExtras = JSON.parse(weightRow.dataset.glass || '{}');
  var price = prices[label];
  var old = olds[label];

  // Check container selection
  var activeContainer = card ? card.querySelector('.card-container-tag.active') : null;
  var isGlass = activeContainer && activeContainer.dataset.container === 'glass';
  var glassExtra = (isGlass && glassExtras[label]) ? glassExtras[label] : 0;
  price = price + glassExtra;
  if(old) old = old + glassExtra;

  var display = card ? card.querySelector('.price-display') : null;
  if(!display || price === undefined) return;
  var amountEl = display.querySelector('.price-amount');
  var oldEl = display.querySelector('.price-old');
  var perEl = display.querySelector('.price-per');
  if(amountEl) amountEl.textContent = price + ' грн';
  if(oldEl) oldEl.textContent = old ? (old + ' грн') : '';
  var containerLabel = isGlass ? ' · скло 🫙' : ' · пластик 🥤';
  if(perEl && !oldEl) perEl.textContent = 'за ' + label + (glassExtras[label] ? containerLabel : '');
}

document.querySelectorAll('.weight-tag').forEach(function(tag){
  tag.addEventListener('click', function(){
    var row = this.closest('.product-weight');
    row.querySelectorAll('.weight-tag').forEach(function(t){ t.classList.remove('active'); });
    this.classList.add('active');
    updatePrice(row);
  });
});

// Card container picker
document.querySelectorAll('.card-container-tag').forEach(function(tag){
  tag.addEventListener('click', function(){
    var picker = this.closest('.card-container-picker');
    picker.querySelectorAll('.card-container-tag').forEach(function(t){ t.classList.remove('active'); });
    this.classList.add('active');
    var card = this.closest('.product-card');
    var row = card ? card.querySelector('.product-weight') : null;
    if(row) updatePrice(row);
  });
});

// Init all prices
document.querySelectorAll('.product-weight').forEach(function(row){ updatePrice(row); });

// ===== ORDER =====
function orderProduct(name){document.getElementById('fproduct').value=name;document.querySelector('#order').scrollIntoView({behavior:'smooth'})}

function selectBusinessOption(el) {
  el.closest('.business-card-options').querySelectorAll('.business-option').forEach(function(o){ o.classList.remove('active'); });
  el.classList.add('active');
  var price = el.dataset.price;
  var priceEl = document.getElementById('businessPrice');
  if(priceEl) priceEl.textContent = parseInt(price).toLocaleString('uk-UA') + ' грн';
}
function submitOrder(){
  var n=document.getElementById('fname').value.trim();
  var p=document.getElementById('fphone').value.trim();
  var city=document.getElementById('fcity').value.trim();
  var product=document.getElementById('fproduct').value;
  var comment=document.getElementById('fcomment').value.trim();

  if(!n||!p){alert("Будь ласка, вкажіть ім'я та номер телефону");return;}

  var btn=document.querySelector('.form-submit');
  btn.disabled=true;
  btn.textContent='Відправляємо... 🐝';

  fetch('https://formspree.io/f/xeevzpen',{
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({
      name: n,
      phone: p,
      city: city,
      product: product,
      comment: comment,
      _subject: 'Нове замовлення від ' + n
    })
  })
  .then(function(res){
    if(res.ok){
      document.getElementById('orderForm').style.display='none';
      document.getElementById('formSuccess').style.display='block';
    } else {
      return res.json().then(function(data){
        throw new Error(data.error || 'Помилка сервера');
      });
    }
  })
  .catch(function(err){
    btn.disabled=false;
    btn.textContent='Надіслати замовлення 🍯';
    alert('Не вдалося відправити форму. Будь ласка, зв\'яжіться з нами напряму:\nTelegram: @Marineta_1\nТел: 0667591398');
    console.error('Formspree error:', err);
  });
}

// ===== SCROLL REVEAL =====
var obs=new IntersectionObserver(function(entries){entries.forEach(function(e,i){if(e.isIntersecting)setTimeout(function(){e.target.classList.add('visible')},i*80)})},{threshold:0.08});
document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el)});



// ===== PRODUCT DATA =====
var PRODUCTS = {
  'acacia_pure': {
    emoji:'🍯', title:'Акацієвий мед (чиста)',
    tagline:'Чиста акація — найніжніший та найпрозоріший мед нашої пасіки. Справжня перлина.',
    badges:['Чиста акація','Майже не цукриться','Топ для чаю'],
    prices:{'1 л':600},  glass_extra:{'1 л':20},
    taste:{Солодість:82,Аромат:72,Густота:35,Ніжність:98},
    desc:`<p>Акацієвий мед чистий — зібраний виключно з цвіту білої акації. Найпрозоріший і найніжніший мед нашої колекції.</p>
    <ul>
      <li>Збирається один раз на рік під час цвітіння акації</li>
      <li>Колір: від майже прозорого до світло-жовтого</li>
      <li>Аромат: тонкий, квітковий, з нотами ванілі</li>
      <li>Ціна вказана за 1 літр</li>
    </ul>`,
    health:[
      {icon:'😴',title:'Спокійний сон',desc:'Ложечка перед сном сприяє виробленню мелатоніну — природного гормону сну.'},
      {icon:'🤧',title:'Проти алергії',desc:'Акацієвий рідше за інші меди викликає алергічні реакції.'},
      {icon:'🍽️',title:'ШКТ',desc:'М\'яко регулює роботу шлунково-кишкового тракту, корисний при гастриті.'},
      {icon:'🧒',title:'Для дітей',desc:'Найбезпечніший мед для дітей — мінімальна алергенність.'},
      {icon:'🫀',title:'Серце та судини',desc:'Знижує артеріальний тиск, зміцнює стінки судин.'},
      {icon:'✨',title:'Краса та шкіра',desc:'Зволожує та живить шкіру, використовується в домашніх масках.'},
    ]
  },
  'acacia_mix': {
    emoji:'🍯', title:'Акацієвий мед (мішана)',
    tagline:'Акація з домішкою лугового різнотрав\'я — м\'який смак та доступна ціна.',
    badges:['Акація + різнотрав\'я','Ніжний смак','Вигідна ціна'],
    prices:{'1 л':400},
     glass_extra:{'1 л':20},
    taste:{Солодість:80,Аромат:75,Густота:45,Ніжність:88},
    desc:`<p>Акацієвий мед мішаний — основа акація з природною домішкою лугових квітів. Зберігає основні властивості акацієвого, але має трохи більш насичений аромат.</p>
    <ul>
      <li>Склад: акація + лугове різнотрав\'я</li>
      <li>Колір: світло-жовтий, злегка бурштиновий</li>
      <li>Повільно кристалізується</li>
      <li>Ціна вказана за 1 літр</li>
    </ul>`,
    health:[
      {icon:'🛡️',title:'Імунітет',desc:'Суміш нектарів дає широкий спектр антиоксидантів та вітамінів.'},
      {icon:'😴',title:'Сон та спокій',desc:'Зберігає заспокійливі властивості акацієвого меду.'},
      {icon:'🍽️',title:'ШКТ',desc:'Допомагає при гастриті та нормалізує травлення.'},
      {icon:'⚡',title:'Енергія',desc:'Швидке природне джерело енергії на весь день.'},
      {icon:'🌿',title:'Загальне зміцнення',desc:'Різнотрав\'я збагачує мед вітамінами та мінералами.'},
      {icon:'🧒',title:'Для дітей',desc:'М\'який смак та низька алергенність — добрий вибір для дітей.'},
    ]
  },
  'may': {
    emoji:'🍯', title:'Травневий мед',
    tagline:'Перший мед сезону — зібраний у травні з весняних квітів. Найніжніший аромат року.',
    badges:['Перший мед','Весняний','Рідкісний'],
    prices:{'1 л':400},
     glass_extra:{'1 л':20},
    taste:{Солодість:80,Аромат:90,Густота:50,Ніжність:92},
    desc:`<p>Травневий мед — особливий. Його збирають на самому початку сезону, коли бджоли тільки-но починають роботу після зими. Весняні квіти дають меду неповторний делікатний аромат.</p>
    <ul>
      <li>Збір: травень, перший вихід бджіл</li>
      <li>Колір: світло-золотистий, прозорий</li>
      <li>Аромат: квітково-весняний, свіжий</li>
      <li>Ціна вказана за 1 літр</li>
    </ul>`,
    health:[
      {icon:'🌸',title:'Весняний тонус',desc:'Ідеальний для відновлення після зими — вітаміни та ферменти весняних квітів.'},
      {icon:'🛡️',title:'Імунітет',desc:'Весняні рослини особливо багаті на фітонциди та антиоксиданти.'},
      {icon:'🧠',title:'Мозок та пам\'ять',desc:'Природні цукри живлять мозок, покращують концентрацію.'},
      {icon:'😴',title:'Сон',desc:'Заспокоює нервову систему, сприяє здоровому сну.'},
      {icon:'❤️',title:'Серце',desc:'Підтримує роботу серцево-судинної системи.'},
      {icon:'✨',title:'Шкіра',desc:'Весняні ферменти оновлюють та зволожують шкіру.'},
    ]
  },
  'wildflower': {
    emoji:'🍯', title:'Різнотравний мед',
    tagline:'Справжній ботанічний букет — сотні квітів у кожній ложці. Найароматніший мед нашої пасіки.',
    badges:['Найароматніший','Унікальний склад','Сезонний збір'],
    prices:{'1 л':400},
     glass_extra:{'1 л':20},
    taste:{Солодість:78,Аромат:95,Густота:65,Ніжність:70},
    desc:`<p>Різнотравний мед — це симфонія польових квітів. Бджоли збирають нектар з десятків видів рослин: чебрецю, звіробою, меліси, конюшини та інших лугових трав.</p>
    <ul>
      <li>Склад: нектар 30+ видів лугових рослин</li>
      <li>Колір: від бурштинового до темно-жовтого</li>
      <li>Аромат: складний, квітково-трав\'яний, насичений</li>
      <li>Ціна вказана за 1 літр</li>
    </ul>`,
    health:[
      {icon:'🌿',title:'Загальне зміцнення',desc:'Найширший набір вітамінів, мінералів та ферментів серед усіх видів меду.'},
      {icon:'🧬',title:'Антиоксидантний захист',desc:'Рекордний вміст флавоноїдів захищає клітини від окислювального стресу.'},
      {icon:'🫁',title:'Дихальна система',desc:'Особливо ефективний при бронхітах, кашлі та сезонних застудах.'},
      {icon:'🧘',title:'Нервова система',desc:'Заспокоює нервову систему, допомагає при стресі та перевтомі.'},
      {icon:'🌸',title:'Гормональний баланс',desc:'Фітоестрогени лугових трав підтримують гормональну рівновагу.'},
      {icon:'💊',title:'Природна аптека',desc:'Збір трав з лікарськими рослинами підсилює терапевтичний ефект.'},
    ]
  },
  'linden': {
    emoji:'🍯', title:'Липовий мед',
    tagline:'Класика народної медицини — липовий мед з неповторним ароматом і м\'яким смаком.',
    badges:['Народна медицина','Від застуди','Ніжний аромат'],
    prices:{'1 л':450},
     glass_extra:{'1 л':20},
    taste:{Солодість:83,Аромат:88,Густота:60,Ніжність:85},
    desc:`<p>Липовий мед — один із найвідоміших у народній медицині. Бджоли збирають його під час цвітіння липи — кілька тижнів на рік.</p>
    <ul>
      <li>Збирається під час цвітіння липи (червень-липень)</li>
      <li>Колір: від світло-жовтого до бурштинового</li>
      <li>Аромат: квітково-медовий, з нотами липи</li>
      <li>Ціна вказана за 1 літр</li>
    </ul>`,
    health:[
      {icon:'🌡️',title:'Застуда та грип',desc:'Найкращий мед при застуді — знімає жар, пом\'якшує горло, прискорює одужання.'},
      {icon:'🫁',title:'Бронхіт та кашель',desc:'Має виражену бронхорозширювальну дію, полегшує кашель.'},
      {icon:'😴',title:'Сон',desc:'Традиційний засіб — ложка з теплим молоком перед сном.'},
      {icon:'🛡️',title:'Антибактеріальний',desc:'Містить фарнезол — природну антибактеріальну речовину.'},
      {icon:'🫀',title:'Серце',desc:'Знижує артеріальний тиск, розширює судини.'},
      {icon:'🧘',title:'Нервова система',desc:'Знімає напругу, заспокоює при стресі та тривозі.'},
    ]
  },
  'rapeseed': {
    emoji:'🍯', title:'Ріпаковий мед',
    tagline:'Ніжний, кремовий, дуже солодкий. Швидко кристалізується — це ознака натуральності!',
    badges:['Кремова текстура','Дуже солодкий','Натуральний'],
    prices:{'1 л':280},
     glass_extra:{'1 л':20},
    taste:{Солодість:97,Аромат:45,Густота:88,Ніжність:75},
    desc:`<p>Ріпаковий мед — один із найбільш солодких медів. Має кремово-білий колір після кристалізації та дуже ніжну текстуру, схожу на вершкове масло.</p>
    <ul>
      <li>Колір: від світло-жовтого до кремово-білого після кристалізації</li>
      <li>Смак: дуже солодкий, мягкий, ненав\'язливий</li>
      <li>Кристалізується дуже швидко — 1-2 тижні після відкачки (норма!)</li>
      <li>Ціна вказана за 1 літр</li>
    </ul>`,
    health:[
      {icon:'⚡',title:'Енергія',desc:'Найвищий вміст цукрів серед усіх медів — миттєве відновлення сил.'},
      {icon:'🫀',title:'Серце та судини',desc:'Знижує рівень холестерину, зміцнює серцевий м\'яз.'},
      {icon:'🫁',title:'Печінка',desc:'Допомагає при захворюваннях печінки та жовчного міхура.'},
      {icon:'💪',title:'Спорт',desc:'Ідеальний для спортсменів — швидке відновлення після навантажень.'},
      {icon:'🛡️',title:'Імунітет',desc:'Містить антиоксиданти, які захищають клітини.'},
      {icon:'😊',title:'Настрій',desc:'Стимулює вироблення серотоніну — гормону радості.'},
    ]
  },
  'sunflower': {
    emoji:'🍯', title:'Соняшниковий мед',
    tagline:'Класичний золотий мед — щільний, солодкий, впізнаваний. Справжній смак України.',
    badges:['Класика','Щільна текстура','Золотий колір'],
    prices:{'1 л':270},
     glass_extra:{'1 л':20},
    taste:{Солодість:95,Аромат:60,Густота:80,Ніжність:55},
    desc:`<p>Соняшниковий мед — один із найпоширеніших і найулюбленіших в Україні. Його характерний золотисто-жовтий колір і насолоджений смак знайомі кожному з дитинства.</p>
    <ul>
      <li>Колір: яскраво-жовтий, соняшниковий</li>
      <li>Швидко кристалізується — це ознака натуральності!</li>
      <li>Аромат: теплий, медово-квітковий</li>
      <li>Ціна вказана за 1 літр</li>
    </ul>`,
    health:[
      {icon:'⚡',title:'Енергія',desc:'Найшвидший природний джерело енергії — глюкоза засвоюється за лічені хвилини.'},
      {icon:'💪',title:'Спорт і відновлення',desc:'Ідеальний для спортсменів після тренувань — заповнює запаси глікогену.'},
      {icon:'🛡️',title:'Імунітет',desc:'Містить антиоксиданти та флавоноїди, що захищають клітини від окислення.'},
      {icon:'🦷',title:'Зуби та кістки',desc:'Містить кальцій і фосфор, корисні для кісткової системи та зубів.'},
      {icon:'🧠',title:'Концентрація',desc:'Природний цукор живить мозок і підтримує концентрацію уваги.'},
      {icon:'😊',title:'Настрій',desc:'Стимулює вироблення серотоніну — гормону радості та задоволення.'},
    ]
  },
  'pollen': {
    emoji:'🍯', title:'Бджолиний пилок',
    tagline:'Суперфуд прямо з квітки — концентрат вітамінів, мінералів та амінокислот.',
    badges:['Суперфуд','200+ речовин','Природна аптека'],
    prices:{'100 г':60,'200 г':120,'500 г':250,'1 кг':470},
    taste:{Концентрація:85,Свіжість:88,Активність:80,Аромат:70},
    desc:`<p>Бджолиний пилок — один із найпоживніших природних продуктів на Землі. У пилку міститься понад 200 різних біологічно активних речовин: всі основні вітаміни, мінерали, 22 амінокислоти та унікальні ферменти.</p>
    <ul>
      <li>Вміст білка: 20–35% — більше ніж у м\'ясі</li>
      <li>Всі вітаміни групи В, А, С, D, Е</li>
      <li>22 амінокислоти, у т.ч. всі незамінні</li>
      <li>Гранульована форма для зручного вживання</li>
    </ul>`,
    health:[
      {icon:'💪',title:'Спорт та м\'язи',desc:'Повний набір амінокислот для росту та відновлення м\'язів після тренувань.'},
      {icon:'🧬',title:'Клітинне відновлення',desc:'Унікальні ферменти стимулюють регенерацію клітин і тканин.'},
      {icon:'🧠',title:'Розумова діяльність',desc:'Вітаміни В-групи живлять нервову систему та покращують пам\'ять.'},
      {icon:'🌸',title:'Гормони і фертильність',desc:'Природні стероли підтримують гормональний баланс і репродуктивну функцію.'},
      {icon:'👴',title:'Антиейджинг',desc:'Антиоксиданти гальмують процеси старіння на клітинному рівні.'},
      {icon:'🍽️',title:'Метаболізм',desc:'Ферменти прискорюють обмін речовин та покращують засвоєння їжі.'},
    ]
  },
  'comb': {
    emoji:'🍯', title:'Мед у стільниках',
    tagline:'Мед у своїй найприроднішій формі — прямо з рамки, у восковому стільнику.',
    badges:['100% натуральний','З воском','Максимум свіжості'],
    prices:{'300 г':160,'500 г':250},
    taste:{Солодість:88,Аромат:92,Густота:85,Ніжність:80},
    desc:`<p>Мед у стільниках — це мед у найнатуральнішому вигляді. Ми просто виймаємо рамку з вулика і кладемо в упаковку. Ніякої обробки, ніякого нагрівання, ніякого фільтрування.</p>
    <ul>
      <li>Мед запечатаний бджолами — ознака повної зрілості</li>
      <li>Містить усі ферменти, пилок та прополіс у природному стані</li>
      <li>Воскові стільники можна жувати — це корисно</li>
      <li>Ідеальний подарунок</li>
    </ul>`,
    health:[
      {icon:'🦷',title:'Зуби та ясна',desc:'Жування воску діє як природна жуйка — очищує зуби та масажує ясна.'},
      {icon:'🫁',title:'Дихання',desc:'Прополіс у воску дезінфікує дихальні шляхи при жуванні стільника.'},
      {icon:'💯',title:'Максимальна активність',desc:'Незайманий мед зберігає всі ферменти та корисні речовини в повному обсязі.'},
      {icon:'🛡️',title:'Алергія',desc:'Природний пилок у стільниках діє як імунотерапія проти сезонної алергії.'},
      {icon:'✨',title:'Шкіра',desc:'Бджолиний віск при контакті зі шкірою живить та зволожує її.'},
      {icon:'🎁',title:'Преміум подарунок',desc:'Найкращий подарунок для цінителів натуральних продуктів.'},
    ]
  },
  'perga': {
    emoji:'🍯', title:'Бджолина перга',
    tagline:'Ферментований пилок у стільниках — «хліб бджіл» з максимальною засвоюваністю.',
    badges:['Ферментований','Краще за пилок','Суперфуд'],
    prices:{'100 г':300},
    taste:{Концентрація:92,Засвоюваність:98,Активність:90,Аромат:75},
    desc:`<p>Бджолина перга — це пилок, зібраний бджолами, утрамбований у соти та законсервований медом. Під дією молочнокислого бродіння він перетворюється на продукт з набагато вищою засвоюваністю.</p>
    <ul>
      <li>Засвоюваність до 98% — значно краще за звичайний пилок</li>
      <li>Вміст білка: 21–29%, всі незамінні амінокислоти</li>
      <li>Природна молочна кислота — пробіотичний ефект</li>
      <li>Дозування: 1–2 чайні ложки на день до їжі</li>
    </ul>`,
    health:[
      {icon:'🧬',title:'Максимальна засвоюваність',desc:'На відміну від пилку, перга засвоюється організмом майже повністю завдяки ферментації.'},
      {icon:'🦠',title:'Пробіотик',desc:'Молочна кислота підтримує мікрофлору кишківника та здоров\'я ШКТ.'},
      {icon:'💪',title:'М\'язи та відновлення',desc:'Повний білковий профіль — ідеальна їжа після фізичних навантажень.'},
      {icon:'🛡️',title:'Імунітет',desc:'Флавоноїди та антиоксиданти зміцнюють захисні сили організму.'},
      {icon:'🧠',title:'Нервова система',desc:'Вітаміни групи В та магній знімають втому, покращують сон і настрій.'},
      {icon:'❤️',title:'Серце та судини',desc:'Знижує рівень "поганого" холестерину, зміцнює стінки судин.'},
    ]
  },
  'drone': {
    emoji:'🍯', title:'Трутневий гомогенат 100%',
    tagline:'1 шприц — 80-85 г чистої ваги. Концентрат природних гормонів для здоров\'я та відновлення.',
    badges:['100% чистий','1 шприц = 80-85 г','Природні гормони'],
    prices:{'1 шприц (80-85 г)':300},
    taste:{Концентрація:95,Рідкість:90,Активність:92,Аромат:55},
    desc:`<p><strong>Трутневий гомогенат 100%</strong> — гомогенізований трутневий розплід на стадії личинки. Продається у зручному шприці, чиста вага — 80-85 грамів.</p>

    <p><strong>Що це і для чого?</strong></p>
    <p>Трутні — самці бджіл. Їхній розплід містить надзвичайно багату концентрацію природних гормонів, ферментів та білків. Гомогенат — подрібнений та гомогенізований розплід, максимально придатний для засвоєння організмом.</p>

    <p><strong>Від чого допомагає:</strong></p>
    <ul>
      <li>Підтримка рівня тестостерону у чоловіків — природним шляхом</li>
      <li>Нормалізація гормонального фону у жінок, полегшення клімаксу та ПМС</li>
      <li>Відновлення після травм, операцій та важких навантажень</li>
      <li>Хронічна втома, зниження тонусу та лібідо</li>
      <li>Підтримка нервової системи при стресі</li>
      <li>Антивікова дія — стимуляція вироблення колагену</li>
    </ul>

    <p><strong>Як приймати:</strong></p>
    <ul>
      <li>Дозування: 0,5–1 г на день під язик, вранці натщесерце</li>
      <li>Курс: 30 днів, потім перерва 2 тижні</li>
      <li>Зберігання: тільки заморожений або розчинений у меді (1:100)</li>
    </ul>`,
    health:[
      {icon:'💪',title:'Чоловіче здоров\'я',desc:'Підтримує рівень тестостерону, підвищує витривалість та лібідо природним шляхом.'},
      {icon:'🌺',title:'Жіноче здоров\'я',desc:'Нормалізує гормональний фон, полегшує симптоми клімаксу та ПМС.'},
      {icon:'📈',title:'Ріст і відновлення',desc:'IGF стимулює регенерацію тканин, прискорює відновлення після травм і навантажень.'},
      {icon:'🧠',title:'Нервова система',desc:'Знижує рівень кортизолу (гормону стресу), покращує якість сну та настрій.'},
      {icon:'👴',title:'Антиейджинг',desc:'Активує вироблення власного колагену та омолодження на клітинному рівні.'},
      {icon:'⚡',title:'Енергія і тонус',desc:'Один із найсильніших природних адаптогенів — відновлює сили при хронічній втомі.'},
    ]
  },
  'buckwheat': {
    emoji:'🍯', title:'Гречаний мед',
    tagline:'Темний, густий, з характером. Наразі немає в наявності.',
    badges:['Немає в наявності'],
    outOfStock: true,
    prices:{'—':0},
    taste:{Солодість:65,Аромат:88,Густота:90,Ніжність:35},
    desc:`<p>Гречаний мед наразі <strong>немає в наявності</strong>. Напишіть нам у Telegram або Viber — повідомимо коли буде.</p>`,
    health:[
      {icon:'🩸',title:'Кров і гемоглобін',desc:'Рекордний вміст заліза — незамінний при анемії та для підвищення гемоглобіну.'},
      {icon:'🛡️',title:'Антиоксидантний рекорд',desc:'Найвища антиоксидантна активність серед усіх видів меду за науковими даними.'},
      {icon:'🌡️',title:'Застуда і грип',desc:'Найефективніший при гострих респіраторних захворюваннях та ангіні.'},
      {icon:'💪',title:'М\'язи та відновлення',desc:'Високий вміст білків підтримує ріст і відновлення м\'язової тканини.'},
      {icon:'🧠',title:'Пам\'ять і мозок',desc:'Рутин зміцнює судини мозку, покращує когнітивні функції та пам\'ять.'},
      {icon:'🫀',title:'Капіляри',desc:'Зміцнює стінки капілярів та дрібних судин, знижує їх ламкість.'},
    ]
  },
  'royal': {
    emoji:'🍯', title:'Маточне молочко',
    tagline:'Їжа бджолиної матки. Наразі немає в наявності.',
    badges:['Немає в наявності'],
    outOfStock: true,
    prices:{'—':0},
    taste:{Концентрація:98,Рідкість:99,Активність:95,Аромат:60},
    desc:`<p>Маточне молочко наразі <strong>немає в наявності</strong>. Напишіть нам у Telegram або Viber — повідомимо коли буде.</p>`,
    health:[
      {icon:'🔬',title:'10-HDA — унікальна кислота',desc:'Єдиний природний продукт із 10-гідрокси-2-деценовою кислотою — потужний регулятор імунітету та гормонів.'},
      {icon:'👴',title:'Омолодження',desc:'Стимулює регенерацію клітин і вироблення колагену — уповільнює старіння на клітинному рівні.'},
      {icon:'💪',title:'Енергія і витривалість',desc:'Підвищує фізичну витривалість і прискорює відновлення.'},
      {icon:'🛡️',title:'Імунітет',desc:'Активує вироблення антитіл та природних клітин-кілерів.'},
      {icon:'🧠',title:'Мозок та нерви',desc:'Захищає нейрони, покращує пам\'ять та концентрацію.'},
      {icon:'🌺',title:'Гормональний баланс',desc:'Регулює рівень естрогену і прогестерону, підтримує репродуктивну функцію.'},
    ]
  }
};

// ВАЖЛИВО: порядок тут = порядок карток на сайті
var PRODUCT_KEYS = ['acacia_pure','acacia_mix','may','wildflower','linden','rapeseed','sunflower','pollen','comb','perga','drone','buckwheat','royal'];
var currentProduct = null;
var currentContainer = 'plastic';

function openModal(key) {
  var p = PRODUCTS[key];
  if(!p) return;
  currentProduct = key;
  // currentContainer вже встановлений з картки (або залишається 'plastic' за замовчуванням)

  // Reset tabs
  document.querySelectorAll('.modal-tab').forEach(function(t){t.classList.remove('active')});
  document.querySelectorAll('.modal-tab-content').forEach(function(t){t.classList.remove('active')});
  document.querySelector('.modal-tab').classList.add('active');
  document.getElementById('tab-desc').classList.add('active');

  // Fill basic
  document.getElementById('modalEmoji').textContent = p.emoji;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalTagline').textContent = p.tagline;

  // Badges
  document.getElementById('modalBadges').innerHTML = p.badges.map(function(b){
    return '<span class="modal-badge">'+b+'</span>';
  }).join('');

  // Taste bars
  if(p.taste) {
    document.getElementById('modalTasteWrap').style.display='block';
    document.getElementById('modalTasteBars').innerHTML = Object.keys(p.taste).map(function(k){
      return '<div class="modal-taste-row"><span class="modal-taste-label">'+k+'</span><div class="modal-taste-track"><div class="modal-taste-fill" data-w="'+p.taste[k]+'%" style="width:0%"></div></div><span class="modal-taste-val">'+p.taste[k]+'%</span></div>';
    }).join('');
  }

  // Weight selector
  var weights = Object.keys(p.prices);
  document.getElementById('modalWeights').innerHTML = weights.map(function(w,i){
    var price = p.prices[w];
    var oldPrice = p.oldPrices ? p.oldPrices[w] : null;
    return '<div class="modal-weight-tag'+(i===0?' active':'')+'" data-weight="'+w+'" onclick="selectModalWeight(this,\''+key+'\')"><span class="wt-label">'+w+'</span><span class="wt-price">'+(oldPrice?'<s>'+oldPrice+'</s> ':'')+price+' грн</span></div>';
  }).join('');

  // Container picker — show only for products with glass_extra
  var containerPicker = document.getElementById('modalContainerPicker');
  if(p.glass_extra) {
    containerPicker.style.display = 'block';
    // Відображаємо той самий вибір що був на картці
    document.querySelectorAll('.modal-container-tag').forEach(function(t){
      t.classList.toggle('active', t.dataset.container === currentContainer);
    });
    var weights = Object.keys(p.prices);
    updateGlassNote(key, weights[0]);
  } else {
    containerPicker.style.display = 'none';
    currentContainer = 'plastic'; // скидаємо для продуктів без тари
  }

  // Price
  updateModalPrice(key, weights[0]);

  // Description
  document.getElementById('modalDesc').innerHTML = p.desc;

  // Health
  document.getElementById('modalHealth').innerHTML = p.health.map(function(h){
    return '<div class="modal-health-item"><div class="mhi">'+h.icon+'</div><div><h4>'+h.title+'</h4><p>'+h.desc+'</p></div></div>';
  }).join('');

  // Open
  var overlay = document.getElementById('productModal');
  var box = document.getElementById('modalBox');
  var fixedBtn = document.getElementById('modalCloseFixedBtn');
  box.scrollTop = 0;
  overlay.classList.add('active');
  if(fixedBtn) fixedBtn.classList.add('visible');
  var scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + scrollY + 'px';
  document.body.style.width = '100%';
  document.body.dataset.scrollY = scrollY;
  setTimeout(function(){ box.scrollTop = 0; }, 10);
  setTimeout(function(){ box.scrollTop = 0; }, 420);

  setTimeout(function(){
    document.querySelectorAll('.modal-taste-fill').forEach(function(el){
      el.style.width = el.dataset.w;
    });
  }, 450);
}

function selectModalWeight(el, key) {
  document.querySelectorAll('.modal-weight-tag').forEach(function(t){t.classList.remove('active')});
  el.classList.add('active');
  updateGlassNote(key, el.dataset.weight);
  updateModalPrice(key, el.dataset.weight);
}

function selectContainer(el) {
  document.querySelectorAll('.modal-container-tag').forEach(function(t){t.classList.remove('active')});
  el.classList.add('active');
  currentContainer = el.dataset.container;
  var activeW = document.querySelector('.modal-weight-tag.active');
  if(activeW && currentProduct) updateModalPrice(currentProduct, activeW.dataset.weight);
}

function updateGlassNote(key, weight) {
  var p = PRODUCTS[key];
  var noteEl = document.getElementById('glassNote');
  if(!noteEl || !p.glass_extra) return;
  noteEl.textContent = '+' + (p.glass_extra[weight] || 0) + ' грн';
}

function updateModalPrice(key, weight) {
  var p = PRODUCTS[key];
  var basePrice = p.prices[weight];
  var glassExtra = (currentContainer === 'glass' && p.glass_extra) ? (p.glass_extra[weight] || 0) : 0;
  var price = basePrice + glassExtra;
  var old = p.oldPrices ? (p.oldPrices[weight] + glassExtra) : null;
  var mainEl = document.getElementById('modalPriceMain');
  var oldEl = document.getElementById('modalPriceOld');
  var noteEl = document.getElementById('modalPriceNote');
  mainEl.textContent = price + ' грн';
  if(p.sale) {
    mainEl.classList.add('is-sale');
    if(old && oldEl) { oldEl.textContent = old + ' грн'; oldEl.style.display='block'; }
    if(noteEl) noteEl.textContent = 'До кінця тижня 🔥';
  } else {
    mainEl.classList.remove('is-sale');
    if(oldEl) oldEl.style.display='none';
    var contLabel = (p.glass_extra && currentContainer === 'glass') ? ' · скло 🫙' : (p.glass_extra ? ' · пластик 🥤' : '');
    if(noteEl) noteEl.textContent = 'за ' + weight + contLabel;
  }
}

function closeModal() {
  var overlay = document.getElementById('productModal');
  var box = document.getElementById('modalBox');
  var fixedBtn = document.getElementById('modalCloseFixedBtn');
  overlay.classList.remove('active');
  if(fixedBtn) fixedBtn.classList.remove('visible');
  // Restore background scroll and position
  var scrollY = parseInt(document.body.dataset.scrollY || '0');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollY);
  setTimeout(function(){
    if(box) box.scrollTop = 0;
    document.querySelectorAll('.modal-taste-fill').forEach(function(el){el.style.width='0%'});
  }, 400);
}

function handleModalClick(e) {
  // Close if clicking the overlay backdrop (not the modal box)
  var box = document.getElementById('modalBox');
  if(!box.contains(e.target)) closeModal();
}

function switchTab(el, tabId) {
  document.querySelectorAll('.modal-tab').forEach(function(t){t.classList.remove('active')});
  document.querySelectorAll('.modal-tab-content').forEach(function(t){t.classList.remove('active')});
  el.classList.add('active');
  document.getElementById('tab-'+tabId).classList.add('active');
  // Scroll the tabs row into view so user sees the content just below — no jump to top
  el.scrollIntoView({block:'nearest', inline:'center'});
}

function orderFromModal() {
  if(!currentProduct) return;
  var p = PRODUCTS[currentProduct];
  var activeW = document.querySelector('.modal-weight-tag.active');
  var weight = activeW ? activeW.dataset.weight : '';
  var productName = p.title + (weight ? ' ('+weight+')' : '');
  if(p.sale) productName += ' — зі знижкою!';
  closeModal();
  setTimeout(function(){
    document.getElementById('fproduct').value = p.title;
    document.getElementById('fcomment').value = weight ? 'Вага: ' + weight : '';
    document.querySelector('#order').scrollIntoView({behavior:'smooth'});
  }, 350);
}

// Keyboard close
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

// Assign open handlers to product cards
document.addEventListener('DOMContentLoaded', function(){
  var cards = document.querySelectorAll('.product-card');
  PRODUCT_KEYS.forEach(function(key, i){
    if(cards[i]) {
      cards[i].style.cursor = 'pointer';
      cards[i].addEventListener('click', function(e){
        // Не відкривати модалку при кліку на кнопки/теги всередині картки
        if(e.target.closest('.btn-order') ||
           e.target.closest('.weight-tag') ||
           e.target.closest('.card-container-tag')) return;
        // Зчитуємо поточний вибір тари з картки
        var activeContainer = cards[i].querySelector('.card-container-tag.active');
        currentContainer = (activeContainer && activeContainer.dataset.container === 'glass') ? 'glass' : 'plastic';
        openModal(key);
      });
      // Add hover hint
      var info = cards[i].querySelector('.product-info');
      if(info) {
        var hint = document.createElement('div');
        hint.style.cssText = 'text-align:center;font-family:sans-serif;font-size:11px;color:rgba(245,166,35,.5);letter-spacing:2px;text-transform:uppercase;padding:8px 0 4px;transition:color .2s';
        hint.textContent = '👆 Натисни для деталей';
        hint.className = 'card-hint';
        info.appendChild(hint);
        cards[i].addEventListener('mouseenter', function(){ hint.style.color='rgba(245,166,35,.9)' });
        cards[i].addEventListener('mouseleave', function(){ hint.style.color='rgba(245,166,35,.5)' });
      }
    }
  });
});


// Footer accordion
function toggleFooterAcc(head) {
  var body = head.nextElementSibling;
  var isOpen = body.classList.contains('open');
  // Close all
  document.querySelectorAll('.footer-acc-body').forEach(function(b){ b.classList.remove('open'); });
  document.querySelectorAll('.footer-acc-head').forEach(function(h){ h.classList.remove('open'); });
  if(!isOpen){ body.classList.add('open'); head.classList.add('open'); }
}
/* ===== TELEGRAM BUBBLE ===== */
(function(){
  var popup = document.getElementById('tgPopup');
  var btn   = document.getElementById('tgBtn');
  var badge = document.getElementById('tgBadge');
  var iconTg    = btn && btn.querySelector('.tg-icon-tg');
  var iconClose = btn && btn.querySelector('.tg-icon-close');
  var isOpen = false;

  // Show badge after 3s if user hasn't opened yet
  setTimeout(function(){
    if(!isOpen && badge) badge.classList.remove('hidden');
  }, 3000);

  window.toggleTgPopup = function(){
    isOpen = !isOpen;
    if(isOpen){
      popup.classList.add('open');
      btn.classList.add('is-open');
      if(iconTg)    iconTg.style.display    = 'none';
      if(iconClose) iconClose.style.display = 'flex';
      if(badge)     badge.classList.add('hidden');
    } else {
      popup.classList.remove('open');
      btn.classList.remove('is-open');
      if(iconTg)    iconTg.style.display    = 'flex';
      if(iconClose) iconClose.style.display = 'none';
    }
  };

  window.closeTgPopup = function(){
    if(!isOpen) return;
    isOpen = false;
    popup.classList.remove('open');
    btn.classList.remove('is-open');
    if(iconTg)    iconTg.style.display    = 'flex';
    if(iconClose) iconClose.style.display = 'none';
  };

  // Close on outside click
  document.addEventListener('click', function(e){
    var bubble = document.getElementById('tgBubble');
    if(isOpen && bubble && !bubble.contains(e.target)) closeTgPopup();
  });
})();

// ===== REVIEWS SYSTEM =====
// Відгуки зберігаються у хмарі (JSONBin.io) — видно всім відвідувачам
var JSONBIN_BIN_ID = ''; // буде заповнено при першому запуску
var JSONBIN_API_KEY = '$2a$10$bratanyHoneyReviewsKey2025'; // замінити на свій ключ з jsonbin.io
var JSONBIN_BASE = 'https://api.jsonbin.io/v3/b';

var SEED_REVIEWS = [
  {id:'s1',name:'Олена М.',city:'Полтава',rating:5,product:'Різнотравний мед',text:'Дуже смачний мед! Купила 3 кг різнотравного — аромат неймовірний. Вся сім\'я в захваті. Замовлятиму ще!',date:'2025-03-10',isNew:false},
  {id:'s2',name:'Сергій К.',city:'Харків',rating:5,product:'Акацієвий мед',text:'Акацієвий — просто бомба. Рідкий, прозорий, не занадто солодкий. Відправили швидко, упакували добре — нічого не розлилось.',date:'2025-03-18',isNew:false},
  {id:'s3',name:'Тетяна В.',city:'Київ',rating:4,product:'Гречаний мед',text:'Гречаний дуже насичений і темний, як і має бути. Трохи специфічний смак, але корисний безумовно. Рекомендую для імунітету.',date:'2025-03-25',isNew:false},
  {id:'s4',name:'Микола Д.',city:'Дніпро',rating:5,product:'Бджолиний пилок',text:'Беру пилок вже втретє. Якість стабільна — гранули рівні, сухі, ароматні. Хлопці молодці, відповідають швидко.',date:'2025-04-01',isNew:false},
  {id:'s5',name:'Ірина П.',city:'Запоріжжя',rating:5,product:'Мед у стільниках',text:'Вперше спробувала мед у стільниках — це щось неймовірне! Жую стільники, а смак справжньої природи. Беру ще!',date:'2025-04-05',isNew:false},
  {id:'s6',name:'Андрій Л.',city:'Суми',rating:5,product:'Соняшниковий мед',text:'Соняшниковий — класика. Густий, солодкий, золотистий. Діти їдять з хлібом замість варення. Ціна чесна за таку якість.',date:'2025-04-08',isNew:false},
  {id:'s7',name:'Людмила Г.',city:'Кременчук',rating:4,product:'Маточне молочко',text:'Маточне молочко замовила вперше. Специфічний смак, але ефект відчула — більше енергії. Братани порадили як правильно вживати.',date:'2025-04-10',isNew:false},
  {id:'s8',name:'Василь Т.',city:'Черкаси',rating:5,product:'Різнотравний мед',text:'Давно шукав справжній мед без домішок. Знайшов Братанів — і не пошкодував. Різнотравний пахне літом і квітами. Беру постійно.',date:'2025-04-12',isNew:false}
];

var revState = { reviews:[], page:0, selectedStar:0, binId:null, apiKey:null };

// Читаємо налаштування з мета-тегів (задаються в HTML)
function revLoadConfig(){
  var binMeta = document.querySelector('meta[name="jsonbin-id"]');
  var keyMeta = document.querySelector('meta[name="jsonbin-key"]');
  revState.binId  = binMeta ? binMeta.getAttribute('content') : '';
  revState.apiKey = keyMeta ? keyMeta.getAttribute('content') : '';
}

function revGetPerPage(){
  return window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;
}

// Завантажити відгуки з хмари
function revLoadFromCloud(callback){
  if(!revState.binId || !revState.apiKey){
    // Немає налаштувань — показуємо тільки seed-відгуки
    revState.reviews = SEED_REVIEWS.slice();
    if(callback) callback();
    return;
  }
  var el = document.getElementById('revLoadingMsg');
  if(el) el.style.display = 'block';

  fetch(JSONBIN_BASE + '/' + revState.binId + '/latest', {
    headers: { 'X-Master-Key': revState.apiKey }
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    var cloudReviews = (data.record && Array.isArray(data.record.reviews)) ? data.record.reviews : [];
    // Мержимо: seed + хмарні (без дублів по id)
    var seedIds = SEED_REVIEWS.map(function(r){ return r.id; });
    var newOnes = cloudReviews.filter(function(r){ return seedIds.indexOf(r.id) === -1; });
    revState.reviews = SEED_REVIEWS.concat(newOnes);
    if(el) el.style.display = 'none';
    if(callback) callback();
  })
  .catch(function(){
    // Якщо хмара недоступна — показуємо seed
    revState.reviews = SEED_REVIEWS.slice();
    if(el) el.style.display = 'none';
    if(callback) callback();
  });
}

// Зберегти відгуки в хмару
function revSaveToCloud(newReview, onSuccess, onError){
  if(!revState.binId || !revState.apiKey){
    // Немає налаштувань — просто показуємо локально без збереження
    onSuccess && onSuccess();
    return;
  }
  // Спочатку отримуємо поточний список
  fetch(JSONBIN_BASE + '/' + revState.binId + '/latest', {
    headers: { 'X-Master-Key': revState.apiKey }
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    var cloudReviews = (data.record && Array.isArray(data.record.reviews)) ? data.record.reviews : [];
    cloudReviews.push(newReview);
    return fetch(JSONBIN_BASE + '/' + revState.binId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': revState.apiKey
      },
      body: JSON.stringify({ reviews: cloudReviews })
    });
  })
  .then(function(r){
    if(r.ok){ onSuccess && onSuccess(); }
    else { onError && onError('server'); }
  })
  .catch(function(){ onError && onError('network'); });
}

function revInit(){
  revLoadConfig();
  revLoadFromCloud(function(){
    revRender();
    revUpdateStats();
  });
}

function revRender(){
  var pp=revGetPerPage();
  var reviews=revState.reviews;
  var track=document.getElementById('reviewsTrack');
  var dotsEl=document.getElementById('reviewsDots');
  if(!track) return;
  var totalPages=Math.ceil(reviews.length/pp);
  if(revState.page>=totalPages) revState.page=0;
  var start=revState.page*pp;
  var slice=reviews.slice(start,start+pp);

  track.innerHTML=slice.map(function(r){
    var stars='';
    for(var i=1;i<=5;i++) stars+=i<=r.rating?'★':'☆';
    var initials=(r.name||'?').split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();
    var d=r.date?new Date(r.date).toLocaleDateString('uk-UA',{day:'numeric',month:'long',year:'numeric'}):'';
    return '<div class="review-card">'
      +(r.isNew?'<div class="review-new-badge">Новий</div>':'')
      +'<div class="review-card-top">'
      +'<div class="review-avatar">'+initials+'</div>'
      +'<div class="review-meta">'
      +'<div class="review-author">'+escHtml(r.name)+'</div>'
      +(r.city?'<div class="review-location">📍 '+escHtml(r.city)+'</div>':'')
      +'</div>'
      +'<div class="review-stars">'+stars+'</div>'
      +'</div>'
      +(r.product?'<div class="review-product-tag">🍯 '+escHtml(r.product)+'</div>':'')
      +'<div class="review-text">'+escHtml(r.text)+'</div>'
      +(d?'<div class="review-date">'+d+'</div>':'')
      +'</div>';
  }).join('');

  if(dotsEl){
    dotsEl.innerHTML='';
    for(var i=0;i<totalPages;i++){
      var btn=document.createElement('button');
      btn.className='rev-dot'+(i===revState.page?' active':'');
      btn.setAttribute('aria-label','Сторінка '+(i+1));
      (function(idx){btn.onclick=function(){revState.page=idx;revRender();};})(i);
      dotsEl.appendChild(btn);
    }
  }
}

function revNav(dir){
  var pp=revGetPerPage();
  var totalPages=Math.ceil(revState.reviews.length/pp);
  revState.page=(revState.page+dir+totalPages)%totalPages;
  revRender();
}

function revUpdateStats(){
  var reviews=revState.reviews;
  var total=reviews.length;
  var counts={1:0,2:0,3:0,4:0,5:0};
  var sum=0;
  reviews.forEach(function(r){counts[r.rating]=(counts[r.rating]||0)+1;sum+=r.rating;});
  var avg=total?(sum/total).toFixed(1):'5.0';
  var avgEl=document.getElementById('revAvgRating');
  var cntEl=document.getElementById('revTotalCount');
  if(avgEl) avgEl.textContent=avg;
  if(cntEl) cntEl.textContent=total;
  [1,2,3,4,5].forEach(function(n){
    var bar=document.getElementById('bar'+n);
    var cnt=document.getElementById('cnt'+n);
    if(bar) bar.style.width=(total?Math.round(counts[n]/total*100):0)+'%';
    if(cnt) cnt.textContent=counts[n];
  });
}

function escHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function openReviewForm(){
  document.getElementById('revModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeReviewForm(){
  document.getElementById('revModal').classList.remove('open');
  document.body.style.overflow='';
  var body=document.getElementById('revModalBodyInner');
  var succ=document.getElementById('revModalSuccess');
  if(body) body.style.display='block';
  if(succ) succ.style.display='none';
  var errEl=document.getElementById('revModalError');
  if(errEl) errEl.style.display='none';
  ['revName','revCity'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  var tx=document.getElementById('revText'); if(tx)tx.value='';
  var pr=document.getElementById('revProduct'); if(pr)pr.value='';
  var cc=document.getElementById('revCharCount'); if(cc)cc.textContent='0 / 500';
  revState.selectedStar=0;
  document.querySelectorAll('.rev-star-opt').forEach(function(el){el.classList.remove('active','hover');});
}
function handleRevModalClick(e){
  if(e.target===document.getElementById('revModal')) closeReviewForm();
}

function pickStar(val){
  revState.selectedStar=val;
  var hidden=document.getElementById('revStarVal');
  if(hidden) hidden.value=val;
  document.querySelectorAll('.rev-star-opt').forEach(function(el,i){
    el.classList.toggle('active',i<val);
  });
}

// Star hover
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.rev-star-opt').forEach(function(el){
    el.addEventListener('mouseover',function(){
      var v=parseInt(el.dataset.val);
      document.querySelectorAll('.rev-star-opt').forEach(function(s,i){s.classList.toggle('hover',i<v);});
    });
    el.addEventListener('mouseout',function(){
      document.querySelectorAll('.rev-star-opt').forEach(function(s){s.classList.remove('hover');});
    });
  });
  var revTextEl=document.getElementById('revText');
  if(revTextEl) revTextEl.addEventListener('input',function(){
    var cc=document.getElementById('revCharCount');
    if(cc) cc.textContent=this.value.length+' / 500';
  });
  revInit();
});

function submitReview(){
  var name=(document.getElementById('revName').value||'').trim();
  var city=(document.getElementById('revCity').value||'').trim();
  var text=(document.getElementById('revText').value||'').trim();
  var product=document.getElementById('revProduct').value||'';
  var rating=revState.selectedStar;
  var errEl=document.getElementById('revModalError');
  errEl.style.display='none';
  if(!name){errEl.textContent="Вкажіть ваше ім'я";errEl.style.display='block';return;}
  if(!rating){errEl.textContent='Поставте оцінку (зірочки)';errEl.style.display='block';return;}
  if(!text||text.length<10){errEl.textContent='Напишіть трохи більше (мінімум 10 символів)';errEl.style.display='block';return;}

  var btn=document.getElementById('revSubmitBtn');
  btn.disabled=true;
  btn.textContent='Зберігаємо... 🐝';

  var newRev={
    id:'u_'+Date.now(),
    name:name, city:city, rating:rating, product:product, text:text,
    date:new Date().toISOString().slice(0,10), isNew:true
  };

  revSaveToCloud(newRev,
    function(){ // success
      btn.disabled=false;
      btn.textContent='Надіслати відгук 🍯';
      // Додаємо в поточний список
      revState.reviews.push(newRev);
      revState.page=0;
      revRender();
      revUpdateStats();
      var body=document.getElementById('revModalBodyInner');
      var succ=document.getElementById('revModalSuccess');
      if(body) body.style.display='none';
      if(succ) succ.style.display='block';
    },
    function(type){ // error
      btn.disabled=false;
      btn.textContent='Надіслати відгук 🍯';
      errEl.textContent = type==='network'
        ? 'Немає зв\'язку. Перевірте інтернет і спробуйте знову.'
        : 'Помилка збереження. Спробуйте ще раз.';
      errEl.style.display='block';
    }
  );
}

window.addEventListener('resize',function(){revRender();});


