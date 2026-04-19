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
var burger=document.getElementById('burger'),mobileMenu=document.getElementById('mobileMenu');
burger.addEventListener('click',function(){burger.classList.toggle('open');mobileMenu.classList.toggle('open')});
mobileMenu.addEventListener('click',function(e){if(e.target===mobileMenu)closeMenu()});
function closeMenu(){burger.classList.remove('open');mobileMenu.classList.remove('open')}

// ===== DYNAMIC PRICES =====
function updatePrice(weightRow){
  var active=weightRow.querySelector('.weight-tag.active');
  if(!active)return;
  var label=active.textContent.trim();
  var prices=JSON.parse(weightRow.dataset.prices||'{}');
  var olds=JSON.parse(weightRow.dataset.old||'{}');
  var price=prices[label];
  var old=olds[label];
  var card=weightRow.closest('.product-card');
  var display=card.querySelector('.price-display');
  if(!display||price===undefined)return;
  var amountEl=display.querySelector('.price-amount');
  var oldEl=display.querySelector('.price-old');
  var perEl=display.querySelector('.price-per');
  if(amountEl)amountEl.textContent=price+' грн';
  if(oldEl)oldEl.textContent=old?(old+' грн'):'';
  if(perEl&&!oldEl)perEl.textContent='за '+label;
}

document.querySelectorAll('.weight-tag').forEach(function(tag){
  tag.addEventListener('click',function(){
    var row=this.closest('.product-weight');
    row.querySelectorAll('.weight-tag').forEach(function(t){t.classList.remove('active')});
    this.classList.add('active');
    updatePrice(row);
  });
});
// Init all prices
document.querySelectorAll('.product-weight').forEach(function(row){updatePrice(row)});

// ===== ORDER =====
function orderProduct(name){document.getElementById('fproduct').value=name;document.querySelector('#order').scrollIntoView({behavior:'smooth'})}
function submitOrder(){
  var n=document.getElementById('fname').value.trim(),p=document.getElementById('fphone').value.trim();
  if(!n||!p){alert("Будь ласка, вкажіть ім'я та номер телефону");return}
  document.getElementById('orderForm').style.display='none';
  document.getElementById('formSuccess').style.display='block';
}

// ===== SCROLL REVEAL =====
var obs=new IntersectionObserver(function(entries){entries.forEach(function(e,i){if(e.isIntersecting)setTimeout(function(){e.target.classList.add('visible')},i*80)})},{threshold:0.08});
document.querySelectorAll('.reveal').forEach(function(el){obs.observe(el)});


// ===== PRODUCT DATA =====
var PRODUCTS = {
  'acacia': {
    emoji:'🍯', title:'Акацієвий мед',
    tagline:'Найніжніший мед у нашій колекції — майже прозорий, із делікатним квітковим ароматом.',
    badges:['Хіт продажів','Майже не цукриться','Топ для чаю'],
    sale:true,
    prices:{'0.5 кг':75,'1 кг':150,'3 кг':450},
    oldPrices:{'0.5 кг':100,'1 кг':200,'3 кг':600},
    taste:{Солодість:85,Аромат:70,Густота:40,Ніжність:95},
    desc:`<p>Акацієвий мед — перлина нашої пасіки. Його збирають бджоли виключно з цвіту білої акації, яка розцвітає лише кілька тижнів на рік. Саме тому цей мед особливо цінний і обмежений у кількості.</p>
    <p>Завдяки високому вмісту фруктози він практично не кристалізується місяцями і залишається рідким та прозорим. Ідеальний вибір для тих, хто надає перевагу легкому, ненав\'язливому смаку.</p>
    <ul>
      <li>Збирається вручну одного разу на рік</li>
      <li>Колір: від майже прозорого до блідо-жовтого</li>
      <li>Аромат: квітковий, делікатний, з нотами ванілі</li>
      <li>Не містить штучних добавок та консервантів</li>
      <li>Ідеальний для дітей та людей із чутливим шлунком</li>
    </ul>`,
    health:[
      {icon:'🫀',title:'Серцево-судинна система',desc:'Знижує артеріальний тиск, зміцнює стінки судин, підтримує серцевий ритм.'},
      {icon:'😴',title:'Спокійний сон',desc:'Ложечка акацієвого меду перед сном сприяє виробленню мелатоніну.'},
      {icon:'🤧',title:'Проти алергії',desc:'На відміну від інших видів меду, акацієвий значно рідше викликає алергічні реакції.'},
      {icon:'🍽️',title:'ШКТ',desc:'М\'яко регулює роботу шлунково-кишкового тракту, допомагає при гастриті.'},
      {icon:'🧒',title:'Для дітей',desc:'Завдяки м\'якому смаку та низькій алергенності — чудова альтернатива цукру для дітей.'},
      {icon:'✨',title:'Краса та шкіра',desc:'Зволожує та живить шкіру, використовується в домашніх масках і засобах догляду.'},
    ]
  },
  'sunflower': {
    emoji:'🌻', title:'Соняшниковий мед',
    tagline:'Класичний золотий мед — щільний, солодкий, впізнаваний. Справжній смак України.',
    badges:['Класика','Щільна текстура','Золотий колір'],
    prices:{'0.5 кг':90,'1 кг':180,'3 кг':520},
    taste:{Солодість:95,Аромат:60,Густота:80,Ніжність:55},
    desc:`<p>Соняшниковий мед — один із найпоширеніших і найулюбленіших в Україні. Його характерний золотисто-жовтий колір і насолоджений смак знайомі кожному з дитинства.</p>
    <p>Наш соняшниковий мед збирається з полів Полтавщини, далеко від промислових зон. Бджоли працюють виключно на диких соняшниках без пестицидів.</p>
    <ul>
      <li>Колір: яскраво-жовтий, соняшниковий</li>
      <li>Швидко кристалізується — це ознака натуральності!</li>
      <li>Аромат: теплий, медово-квітковий</li>
      <li>Відмінно підходить для випічки та кулінарії</li>
      <li>Найвищий вміст глюкози серед наших медів</li>
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
  'wildflower': {
    emoji:'🌸', title:'Різнотравний мед',
    tagline:'Справжній ботанічний букет — сотні квітів у кожній ложці. Найароматніший мед нашої пасіки.',
    badges:['Найароматніший','Унікальний склад','Сезонний збір'],
    prices:{'0.5 кг':95,'1 кг':190,'3 кг':540},
    taste:{Солодість:78,Аромат:95,Густота:65,Ніжність:70},
    desc:`<p>Різнотравний мед — це симфонія польових квітів. Бджоли збирають нектар одночасно з десятків видів рослин: чебрецю, звіробою, меліси, польових ромашок, конюшини та ще безлічі лугових трав.</p>
    <p>Саме ця різноманітність робить різнотравний мед найбагатшим за складом — він містить найширший спектр вітамінів, мінералів та біологічно активних речовин.</p>
    <ul>
      <li>Склад: нектар 30+ видів лугових рослин</li>
      <li>Колір: від бурштинового до темно-жовтого</li>
      <li>Аромат: складний, квітково-трав\'яний, насичений</li>
      <li>Кожен сезон — унікальний смак залежно від врожаю</li>
      <li>Найбагатший склад мікроелементів</li>
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
  'buckwheat': {
    emoji:'🌲', title:'Гречаний мед',
    tagline:'Темний, густий, з характером. Для тих, хто цінує глибокий смак і максимальну користь.',
    badges:['Рекорд по залізу','Еко-продукт','Насичений смак'],
    prices:{'0.5 кг':105,'1 кг':210,'3 кг':590},
    taste:{Солодість:65,Аромат:88,Густота:90,Ніжність:35},
    desc:`<p>Гречаний мед — король серед медів за показниками користі для організму. Його темний колір — це не недолік, а ознака надзвичайно багатого складу. Він містить у рази більше заліза, білків та антиоксидантів порівняно зі світлими медами.</p>
    <p>Смак гречаного меду — яскравий і характерний, з легкою гіркуватістю і довгим насиченим післясмаком. Це мед для справжніх цінителів.</p>
    <ul>
      <li>Колір: від темно-каштанового до майже чорного</li>
      <li>Смак: насичений, із легкою гіркуватістю</li>
      <li>У 3–4 рази більше заліза, ніж у світлих медах</li>
      <li>Найвищий вміст антиоксидантів і поліфенолів</li>
      <li>Швидко кристалізується в темну однорідну масу</li>
    </ul>`,
    health:[
      {icon:'🩸',title:'Кров і гемоглобін',desc:'Рекордний вміст заліза — незамінний при анемії та для підвищення гемоглобіну.'},
      {icon:'💪',title:'М\'язи та відновлення',desc:'Високий вміст білків підтримує ріст і відновлення м\'язової тканини.'},
      {icon:'🧠',title:'Пам\'ять і мозок',desc:'Рутин зміцнює судини мозку, покращує когнітивні функції та пам\'ять.'},
      {icon:'🫀',title:'Капіляри',desc:'Зміцнює стінки капілярів та дрібних судин, знижує їх ламкість.'},
      {icon:'🛡️',title:'Антиоксидантний рекорд',desc:'Найвища антиоксидантна активність серед усіх видів меду за науковими даними.'},
      {icon:'🌡️',title:'Застуда і грип',desc:'Найефективніший при гострих респіраторних захворюваннях та ангіні.'},
    ]
  },
  'propolis': {
    emoji:'🫧', title:'Прополіс',
    tagline:'Природний антибіотик від бджіл — захист організму в найчистішому вигляді.',
    badges:['Природний антибіотик','Без хімії','Рідкісний продукт'],
    prices:{'50 г':120,'100 г':220},
    taste:{Концентрація:90,'Чистота':95,'Активність':88,Аромат:75},
    desc:`<p>Прополіс — це бджолиний клей, яким бджоли обробляють вулик для стерилізації та захисту від бактерій і грибків. За своєю антибактеріальною дією він перевершує багато синтетичних антибіотиків.</p>
    <p>Наш прополіс збирається вручну зі спеціальних пасток і не містить жодних домішок. Це 100% натуральний продукт у своїй найчистішій формі.</p>
    <ul>
      <li>Вміст флавоноїдів: 15–20% (показник якості)</li>
      <li>Активний проти 100+ видів бактерій</li>
      <li>Збирається вручну зі спеціальних пасток</li>
      <li>Можна розчиняти у меді або алкоголі</li>
      <li>Темно-коричневий колір — ознака зрілості та якості</li>
    </ul>`,
    health:[
      {icon:'🦠',title:'Антибактеріальна дія',desc:'Активний проти 100+ штамів бактерій, включно з резистентними до антибіотиків.'},
      {icon:'🍄',title:'Протигрибковий ефект',desc:'Ефективний проти грибкових інфекцій, у т.ч. кандиди.'},
      {icon:'🛡️',title:'Імунітет',desc:'Активує макрофаги та NK-клітини — перший рубіж захисту організму.'},
      {icon:'🦷',title:'Стоматологія',desc:'Застосовується при стоматиті, пародонтиті та після хірургічного втручання.'},
      {icon:'🔬',title:'Протипухлинний',desc:'Флавоноїди прополісу гальмують ріст аномальних клітин — доведено науково.'},
      {icon:'🌡️',title:'Противірусний',desc:'Ефективний проти вірусів грипу, герпесу та ГРВІ.'},
    ]
  },
  'pollen': {
    emoji:'🌼', title:'Бджолиний пилок',
    tagline:'Суперфуд прямо з квітки — концентрат вітамінів, мінералів та амінокислот.',
    badges:['Суперфуд','200+ речовин','Природна аптека'],
    prices:{'100 г':95,'250 г':220},
    taste:{Концентрація:85,'Свіжість':88,'Активність':80,Аромат:70},
    desc:`<p>Бджолиний пилок — один із найпоживніших природних продуктів на Землі. Бджоли збирають його з квіток, змішують з нектаром та доставляють у вулик як основне джерело білка для колонії.</p>
    <p>У пилку міститься понад 200 різних біологічно активних речовин: всі основні вітаміни, мінерали, 22 амінокислоти та унікальні ферменти, яких немає в жодному іншому продукті.</p>
    <ul>
      <li>Вміст білка: 20–35% — більше ніж у м\'ясі!</li>
      <li>Всі вітаміни групи В, А, С, D, Е</li>
      <li>22 амінокислоти, у т.ч. всі незамінні</li>
      <li>Збирається весною та влітку, сушиться при низькій температурі</li>
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
    emoji:'🕯️', title:'Мед у стільниках',
    tagline:'Мед у своїй найприроднішій формі — прямо з рамки, у восковому стільнику.',
    badges:['100% натуральний','З воском','Максимум свіжості'],
    prices:{'300 г':160,'500 г':250},
    taste:{Солодість:88,Аромат:92,Густота:85,Ніжність:80},
    desc:`<p>Мед у стільниках — це мед у найнатуральнішому вигляді, яким його можна уявити. Ми просто виймаємо рамку з вулика і кладемо в упаковку. Ніякої обробки, ніякого нагрівання, ніякого фільтрування.</p>
    <p>Воскові стільники не лише захищають мед, але й самі є цінним продуктом. Бджолиний віск містить унікальні речовини, які виділяються при жуванні стільника.</p>
    <ul>
      <li>Мед запечатаний бджолами — ознака повної зрілості</li>
      <li>Містить усі ферменти, пилок та прополіс у природному стані</li>
      <li>Воскові стільники можна жувати — це корисно!</li>
      <li>Зберігається довше завдяки захисту воском</li>
      <li>Ідеальний подарунок — красиво виглядає</li>
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
  'royal': {
    emoji:'💛', title:'Бджолине молочко',
    tagline:'Секрет довголіття королів — найрідкісніший і найцінніший бджолиний продукт.',
    badges:['Рідкісний','Преміум','Біостимулятор'],
    prices:{'10 г':350,'20 г':650},
    taste:{Концентрація:98,'Рідкість':99,'Активність':95,Аромат:60},
    desc:`<p>Маточне молочко — це те, чим бджоли годують свою матку впродовж усього її життя. Саме завдяки йому матка живе в 40 разів довше за звичайну бджолу і відкладає тисячі яєць щодня.</p>
    <p>Виробництво маточного молочка — найскладніший процес на пасіці. З одного вулика за сезон отримують лише 200–500 г цього продукту. Це робить його справжнім скарбом.</p>
    <ul>
      <li>Виробляється залозами молодих бджіл-годувальниць</li>
      <li>Містить унікальну речовину 10-HDA, яка не зустрічається в природі більше ніде</li>
      <li>Термін зберігання без заморозки — лише 24–48 год</li>
      <li>Правильне зберігання: у морозилці або у меді</li>
      <li>Дозування: 0.5–1 г на день під язик</li>
    </ul>`,
    health:[
      {icon:'🔬',title:'10-HDA (унікальна кислота)',desc:'Єдиний природний продукт, що містить 10-гідрокси-2-деценову кислоту — потужний регулятор імунітету.'},
      {icon:'👴',title:'Антиейджинг',desc:'Стимулює регенерацію клітин і виробництво колагену — омолоджує на клітинному рівні.'},
      {icon:'🧠',title:'Когнітивні функції',desc:'Захищає нейрони від пошкоджень, покращує пам\'ять та концентрацію.'},
      {icon:'🌺',title:'Гормональна система',desc:'Регулює рівень естрогену та прогестерону, підтримує репродуктивну функцію.'},
      {icon:'💪',title:'Фізична витривалість',desc:'Підвищує витривалість та прискорює відновлення — знають спортсмени та космонавти.'},
      {icon:'🛡️',title:'Протипухлинний',desc:'10-HDA — один із найбільш досліджуваних природних протипухлинних агентів.'},
    ]
  },
  'queens': {
    emoji:'👑', title:'Бджоломатки',
    tagline:'Племінні матки від власної пасіки — запорука здорової та продуктивної бджолосім\'ї.',
    badges:['Власна селекція','Плідні матки','Гарантія якості'],
    prices:{'1 шт':350,'5 шт':1600,'10 шт':3000},
    taste:{Продуктивність:95,'Здоров\'я':90,Спокій:85,'Яйценосність':92},
    desc:`<p>Ми пропонуємо плідних бджоломаток власної селекції з нашої Полтавської пасіки. Матки вирощені в умовах природного відбору серед найпродуктивніших та найспокійніших бджолосімей.</p>
    <p>Кожна матка проходить перевірку якості: оцінюються яйценосність, поведінка сім'ї, стійкість до хвороб і зимівлі. Відправляємо лише перевірений племінний матеріал.</p>
    <ul>
      <li>Карпатська порода — спокійна, продуктивна, зимостійка</li>
      <li>Плідні матки, перевірені на яйцекладку</li>
      <li>Вирощені без застосування антибіотиків</li>
      <li>Відправляємо в спеціальних клітинках з кормовим запасом</li>
      <li>Консультація по підсаджуванню матки включена</li>
    </ul>`,
    health:[
      {icon:'🐝',title:'Продуктивність сім\'ї',desc:'Молода матка підвищує медопродуктивність сім\'ї на 30–50% вже в перший сезон.'},
      {icon:'🛡️',title:'Стійкість до хвороб',desc:'Матки від здорових сімей передають резистентність до нозематозу та варроатозу.'},
      {icon:'❄️',title:'Зимостійкість',desc:'Карпатська порода легко переносить українські зими з мінімальними втратами.'},
      {icon:'😊',title:'Лагідний характер',desc:'Сім\'ї від наших маток не агресивні — комфортно працювати навіть без диму.'},
      {icon:'📈',title:'Активний розплід',desc:'Висока яйценосність (1500–2000 яєць/добу) забезпечує швидкий ріст сім\'ї.'},
      {icon:'🌿',title:'Чистота крові',desc:'Ізольоване спарювання на нашій пасіці — чистота породи гарантована.'},
    ]
  },
  'packages': {
    emoji:'📦', title:'Бджолопакети та маточники',
    tagline:'Готові бджолопакети та зрілі маточники для старту або розширення вашої пасіки.',
    badges:['Старт пасіки','Зрілі маточники','Карпатка'],
    prices:{'Маточник':120,'4-рамковий пакет':1800,'6-рамковий пакет':2600},
    taste:{Зрілість:95,СилаСімї:88,Здоровя:90,Продуктивність:85},
    desc:`<p>Бджолопакети та маточники від нашої пасіки — ідеальний варіант для тих, хто починає бджільництво або хоче розширити існуючу пасіку. Ми готуємо пакети з ранньої весни на карпатській породі.</p>
    <p>Маточники — зрілі, готові до виходу матки, сформовані в умовах природного роїння або штучного виведення. Підходять для аварійного або планового заміщення матки.</p>
    <ul>
      <li>4-рамкові та 6-рамкові пакети з плідною маткою та розплодом</li>
      <li>Зрілі маточники (за 1–2 дні до виходу матки)</li>
      <li>Сформовані у квітні–червні, залежно від сезону</li>
      <li>Пакети містять: рамку з розплодом, кормові рамки, маток</li>
      <li>Доставка або самовивіз, попередній запис обов\'язковий</li>
    </ul>`,
    health:[
      {icon:'🌱',title:'Старт пасіки',desc:'Готовий пакет з маткою — найлегший спосіб розпочати бджільництво без зайвих клопотів.'},
      {icon:'⚡',title:'Швидкий розвиток',desc:'6-рамковий пакет вже до середини літа стає повноцінною медоносною сім\'єю.'},
      {icon:'🔄',title:'Заміна матки',desc:'Зрілий маточник — найшвидший спосіб замінити стару або хвору матку в сім\'ї.'},
      {icon:'📅',title:'Рання весна',desc:'Ранні пакети дозволяють встигнути на акацієвий та ранній різнотравний медозбір.'},
      {icon:'🏡',title:'Місцева порода',desc:'Адаптована до Полтавщини карпатська бджола — мінімальний стрес при переселенні.'},
      {icon:'📞',title:'Підтримка',desc:'Консультуємо по догляду за пакетом та підсаджуванню маточника — завжди на зв\'язку.'},
    ]
  }
};
var PRODUCT_KEYS = ['acacia','sunflower','wildflower','buckwheat','propolis','pollen','comb','royal','queens','packages'];
var currentProduct = null;

function openModal(key) {
  var p = PRODUCTS[key];
  if(!p) return;
  currentProduct = key;

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
  box.scrollTop = 0;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Scroll modal-box (not overlay) to top — both immediately and after slide-up animation
  setTimeout(function(){ box.scrollTop = 0; }, 10);
  setTimeout(function(){ box.scrollTop = 0; }, 420);

  // Animate taste bars after transition
  setTimeout(function(){
    document.querySelectorAll('.modal-taste-fill').forEach(function(el){
      el.style.width = el.dataset.w;
    });
  }, 450);
}

function selectModalWeight(el, key) {
  document.querySelectorAll('.modal-weight-tag').forEach(function(t){t.classList.remove('active')});
  el.classList.add('active');
  updateModalPrice(key, el.dataset.weight);
}

function updateModalPrice(key, weight) {
  var p = PRODUCTS[key];
  var price = p.prices[weight];
  var old = p.oldPrices ? p.oldPrices[weight] : null;
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
    if(noteEl) noteEl.textContent = 'за ' + weight;
  }
}

function closeModal() {
  var overlay = document.getElementById('productModal');
  var box = document.getElementById('modalBox');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
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
        if(e.target.closest('.btn-order') || e.target.closest('.weight-tag')) return;
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
function toggleAcc(head) {
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
