// KHAIRCHEESEMATCH JS
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Data Produk (contoh) — maksimal 5 untuk slider terlaris
const PRODUCTS = [
  { id:'cm001', name:'Cheesecake Original', price:35000, best:true, img:'assets/img/prod-original.svg' },
  { id:'cm002', name:'Matcha Cheesecake', price:42000, best:true, img:'assets/img/prod-matcha.svg' },
  { id:'cm003', name:'Strawberry Cheesecake', price:38000, best:true, img:'assets/img/prod-strawberry.svg' },
  { id:'cm004', name:'Blueberry Cheesecake', price:38000, best:false, img:'assets/img/prod-blueberry.svg' },
  { id:'cm005', name:'Tiramisu Cheesecake', price:40000, best:true, img:'assets/img/prod-tiramisu.svg' },
  { id:'cm006', name:'Mini Cheesecuit Box (6pc)', price:55000, best:false, img:'assets/img/prod-minibox.svg' }
];

// Local Storage helpers
const store = {
  get(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback }catch{ return fallback }},
  set(key, value){ localStorage.setItem(key, JSON.stringify(value)) }
};

// Currency IDR
const rupiah = (n) => n.toLocaleString('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0});

// CART STATE
const CART_KEY = 'kcm_cart_v1';
let cart = store.get(CART_KEY, {});

function syncCart(){
  store.set(CART_KEY, cart);
  const count = Object.values(cart).reduce((a,b)=>a+b.qty,0);
  $('#cartCount').textContent = count;
  renderCart();
}

function addToCart(id, qty=1){
  if(!cart[id]){
    const p = PRODUCTS.find(p=>p.id===id);
    cart[id] = { id, name:p.name, price:p.price, img:p.img, qty:0 };
  }
  cart[id].qty += qty;
  if(cart[id].qty<=0) delete cart[id];
  syncCart();
}

function renderCart(){
  const wrap = $('#cartItems');
  wrap.innerHTML='';
  let total=0;
  for(const item of Object.values(cart)){
    total += item.price*item.qty;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = \`
      <img src="\${item.img}" alt="\${item.name}" />
      <div>
        <div class="title">\${item.name}</div>
        <div class="price">\${rupiah(item.price)}</div>
      </div>
      <div class="qty">
        <button class="icon-btn" aria-label="Kurangi">-</button>
        <div>\${item.qty}</div>
        <button class="icon-btn" aria-label="Tambah">+</button>
      </div>
    \`;
    const [minusBtn,,plusBtn] = $$('.icon-btn', el);
    minusBtn.addEventListener('click', ()=>addToCart(item.id,-1));
    plusBtn.addEventListener('click', ()=>addToCart(item.id,1));
    wrap.appendChild(el);
  }
  $('#cartTotal').textContent = rupiah(total);
}

function renderMenu(){
  const grid = $('#menuGrid');
  grid.innerHTML='';
  PRODUCTS.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card product-card';
    card.innerHTML = \`
      <div class="thumb"><img src="\${p.img}" alt="\${p.name}" width="220" height="160" loading="lazy"/></div>
      <h4>\${p.name}</h4>
      <div class="price">\${rupiah(p.price)}</div>
      <div class="actions">
        <button class="add-btn">Tambah</button>
      </div>
    \`;
    $('.add-btn', card).addEventListener('click', ()=>addToCart(p.id,1));
    grid.appendChild(card);
  });
}

function renderBestSellers(){
  const container = $('#bestSellerTrack');
  const dots = $('#sliderDots');
  const items = PRODUCTS.filter(p=>p.best).slice(0,5);
  container.innerHTML='';
  dots.innerHTML='';
  items.forEach((p, idx)=>{
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = \`
      <div class="card">
        <div>
          <h3>\${p.name}</h3>
          <p>Nikmati \${p.name} dengan bahan segar & rasa seimbang.</p>
          <div class="price">\${rupiah(p.price)}</div>
          <div class="actions">
            <button class="add-btn">Tambah ke Keranjang</button>
          </div>
        </div>
        <div class="thumb"><img src="\${p.img}" alt="\${p.name}" width="360" height="260"/></div>
      </div>\`;
    $('.add-btn', slide).addEventListener('click', ()=>addToCart(p.id,1));
    container.appendChild(slide);

    const dot = document.createElement('button');
    dot.setAttribute('aria-label', \`Slide \${idx+1}\`);
    dots.appendChild(dot);
  });

  // slider logic
  const track = container;
  const slides = $$('.slide', track);
  const dotEls = $$('#sliderDots button');
  let index = 0;
  function updateDots(){
    dotEls.forEach((d,i)=>d.classList.toggle('active', i===index));
  }
  function goTo(i){
    index = (i+slides.length) % slides.length;
    track.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth'});
    updateDots();
  }
  $('.slider-nav.prev').addEventListener('click', ()=>goTo(index-1));
  $('.slider-nav.next').addEventListener('click', ()=>goTo(index+1));
  dotEls.forEach((d,i)=>d.addEventListener('click', ()=>goTo(i)));
  updateDots();

  // auto play
  const root = $('.slider');
  if(root.dataset.auto === 'true'){
    let timer = setInterval(()=>goTo(index+1), Number(root.dataset.interval||4000));
    root.addEventListener('mouseenter', ()=>clearInterval(timer));
    root.addEventListener('mouseleave', ()=>timer = setInterval(()=>goTo(index+1), Number(root.dataset.interval||4000)));
  }

  // swipe support
  let startX=0;
  track.addEventListener('touchstart', e=> startX = e.touches[0].clientX);
  track.addEventListener('touchend', e=>{
    const delta = e.changedTouches[0].clientX - startX;
    if(delta > 50) goTo(index-1);
    if(delta < -50) goTo(index+1);
  });
}

// Testimonials
const T_KEY='kcm_testimonials_v1';
const defaultTestimonials = [
  {name:'Rani', message:'Cheesecakenya lembut banget, nggak enek. Porsinya pas!', at:Date.now()-86400000*4},
  {name:'Bagas', message:'Matcha cheesecake wajib coba. Aromanya wangi, rasa balance.', at:Date.now()-86400000*2},
  {name:'Luna', message:'Pengiriman cepat, packing rapi. Recommended!', at:Date.now()-86400000},
];
let testimonials = store.get(T_KEY, defaultTestimonials);

function renderTestimonials(){
  const wrap = $('#testimonialList');
  wrap.innerHTML = '';
  testimonials.slice().reverse().forEach(t=>{
    const el = document.createElement('div');
    el.className='testimonial';
    const date = new Date(t.at||Date.now()).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'});
    el.innerHTML = \`
      <div class="who">\${t.name}</div>
      <div class="msg">\${t.message}</div>
      <div class="date" style="color:#6b7280;font-size:12px">\${date}</div>
    \`;
    wrap.appendChild(el);
  });
}

function handleForms(){
  $('#testimonialForm').addEventListener('submit', e=>{
    e.preventDefault();
    const name = $('#tName').value.trim() || 'Anonim';
    const message = $('#tMsg').value.trim();
    if(!message) return;
    testimonials.push({name, message, at: Date.now()});
    store.set(T_KEY, testimonials);
    e.target.reset();
    renderTestimonials();
    alert('Terima kasih untuk testimoni kamu!');
  });

  const FB_KEY = 'kcm_feedback_v1';
  const feedbacks = store.get(FB_KEY, []);
  $('#feedbackForm').addEventListener('submit', e=>{
    e.preventDefault();
    const name = $('#fName').value.trim() || 'Anonim';
    const message = $('#fMsg').value.trim();
    if(!message) return;
    feedbacks.push({name, message, at: Date.now()});
    store.set(FB_KEY, feedbacks);
    e.target.reset();
    alert('Terima kasih! Masukanmu sudah tersimpan di perangkat ini.');
  });
}

// Drawer (Cart)
function initDrawer(){
  const drawer = $('#cartDrawer');
  const backdrop = $('#drawerBackdrop');
  function open(){ drawer.setAttribute('open',''); drawer.setAttribute('aria-hidden','false'); }
  function close(){ drawer.removeAttribute('open'); drawer.setAttribute('aria-hidden','true'); }
  $('#cartButton').addEventListener('click', open);
  $('#closeCart').addEventListener('click', close);
  backdrop.addEventListener('click', close);
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
  $('#checkoutBtn').addEventListener('click', ()=>{
    if(Object.keys(cart).length===0) return alert('Keranjang masih kosong.');
    alert('Checkout simulasi: Silakan lanjutkan pembayaran di kasir atau hubungi kami via WhatsApp.');
  });
}

// Init
window.addEventListener('DOMContentLoaded', ()=>{
  $('#year').textContent = new Date().getFullYear();
  renderMenu();
  renderBestSellers();
  renderTestimonials();
  handleForms();
  initDrawer();
  syncCart();
});
