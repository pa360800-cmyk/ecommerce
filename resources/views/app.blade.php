<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>BSAB — Premium E‑Commerce</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink: #0d0d0d;
      --cream: #f5f0e8;
      --gold: #c9a84c;
      --gold-light: #e8c97a;
      --white: #ffffff;
      --gray: #888;
      --ease: cubic-bezier(.25,.46,.45,.94);
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--ink);
      color: var(--cream);
      font-family: 'DM Sans', sans-serif;
      overflow-x: hidden;
      cursor: none;
    }

    /* CUSTOM CURSOR */
    .cursor {
      position: fixed; top: 0; left: 0;
      width: 12px; height: 12px;
      background: var(--gold);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: transform .15s var(--ease), width .2s, height .2s, background .2s;
      mix-blend-mode: difference;
    }
    .cursor-ring {
      position: fixed; top: 0; left: 0;
      width: 36px; height: 36px;
      border: 1px solid var(--gold);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: transform .35s var(--ease), width .3s, height .3s, opacity .3s;
      opacity: .6;
    }

    /* NAV */
    nav {
      position: fixed; top: 0; left: 0; right: 0;
      z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.4rem 4rem;
      backdrop-filter: blur(12px);
      background: rgba(13,13,13,.7);
      border-bottom: 1px solid rgba(201,168,76,.15);
      transform: translateY(-100%);
      animation: slideDown .8s .3s var(--ease) forwards;
    }
    @keyframes slideDown { to { transform: translateY(0); } }

    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem; font-weight: 900;
      letter-spacing: .08em;
      color: var(--gold);
      text-decoration: none;
    }
    .logo span { color: var(--cream); }

    .nav-links { display: flex; gap: 2.5rem; list-style: none; }
    .nav-links a {
      color: var(--cream); opacity: .7;
      text-decoration: none; font-size: .85rem;
      letter-spacing: .12em; text-transform: uppercase;
      transition: opacity .2s, color .2s;
      position: relative;
    }
    .nav-links a::after {
      content: ''; position: absolute;
      bottom: -4px; left: 0; right: 100%;
      height: 1px; background: var(--gold);
      transition: right .3s var(--ease);
    }
    .nav-links a:hover { opacity: 1; color: var(--gold); }
    .nav-links a:hover::after { right: 0; }

    .nav-actions { display: flex; gap: 1rem; align-items: center; }
    .btn-ghost {
      background: none; border: 1px solid rgba(201,168,76,.4);
      color: var(--cream); padding: .55rem 1.3rem;
      font-family: 'DM Sans', sans-serif;
      font-size: .8rem; letter-spacing: .1em; text-transform: uppercase;
      cursor: none; transition: background .25s, border-color .25s, color .25s;
      border-radius: 2px;
    }
    .btn-ghost:hover { background: var(--gold); border-color: var(--gold); color: var(--ink); }

    /* HERO */
    .hero {
      min-height: 100vh;
      display: grid; place-items: center;
      position: relative; overflow: hidden;
      padding: 7rem 4rem 4rem;
    }

    .hero-bg {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(201,168,76,.08) 0%, transparent 70%),
                  radial-gradient(ellipse 50% 40% at 20% 80%, rgba(201,168,76,.05) 0%, transparent 60%);
    }

    /* Floating circles */
    .orb {
      position: absolute; border-radius: 50%;
      pointer-events: none;
    }
    .orb1 {
      width: 500px; height: 500px;
      right: -120px; top: -60px;
      background: radial-gradient(circle, rgba(201,168,76,.12) 0%, transparent 70%);
      animation: float1 8s ease-in-out infinite;
    }
    .orb2 {
      width: 300px; height: 300px;
      left: 5%; bottom: 10%;
      background: radial-gradient(circle, rgba(201,168,76,.07) 0%, transparent 70%);
      animation: float2 10s ease-in-out infinite;
    }
    @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-30px) rotate(8deg)} }
    @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(20px) rotate(-6deg)} }

    .hero-content {
      position: relative; z-index: 2;
      max-width: 1100px; width: 100%;
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 5rem; align-items: center;
    }

    .hero-text { }
    .hero-tag {
      display: inline-flex; align-items: center; gap: .6rem;
      font-size: .75rem; letter-spacing: .2em; text-transform: uppercase;
      color: var(--gold); margin-bottom: 1.8rem;
      opacity: 0; animation: fadeUp .7s .5s var(--ease) forwards;
    }
    .hero-tag::before { content: ''; display: block; width: 30px; height: 1px; background: var(--gold); }

    h1 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(3rem, 5vw, 5.5rem);
      font-weight: 900;
      line-height: 1.05;
      margin-bottom: 1.6rem;
      opacity: 0; animation: fadeUp .8s .7s var(--ease) forwards;
    }
    h1 em {
      font-style: italic;
      color: var(--gold);
      -webkit-text-stroke: 0px;
    }

    .hero-desc {
      font-size: 1rem; line-height: 1.75;
      color: rgba(245,240,232,.6);
      max-width: 460px; margin-bottom: 2.5rem;
      opacity: 0; animation: fadeUp .8s .9s var(--ease) forwards;
    }

    .hero-btns {
      display: flex; gap: 1rem; flex-wrap: wrap;
      opacity: 0; animation: fadeUp .8s 1.1s var(--ease) forwards;
    }
    .btn-primary {
      background: var(--gold);
      color: var(--ink);
      border: none; padding: .85rem 2.2rem;
      font-family: 'DM Sans', sans-serif;
      font-size: .85rem; font-weight: 500;
      letter-spacing: .1em; text-transform: uppercase;
      cursor: none; border-radius: 2px;
      position: relative; overflow: hidden;
      transition: transform .2s, box-shadow .2s;
    }
    .btn-primary::before {
      content: '';
      position: absolute; inset: 0;
      background: rgba(255,255,255,.2);
      transform: translateX(-100%);
      transition: transform .4s var(--ease);
    }
    .btn-primary:hover::before { transform: translateX(0); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(201,168,76,.3); }

    .btn-outline {
      background: none;
      border: 1px solid rgba(245,240,232,.3);
      color: var(--cream);
      padding: .85rem 2.2rem;
      font-family: 'DM Sans', sans-serif;
      font-size: .85rem; letter-spacing: .1em; text-transform: uppercase;
      cursor: none; border-radius: 2px;
      transition: border-color .2s, color .2s;
    }
    .btn-outline:hover { border-color: var(--cream); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* HERO VISUAL */
    .hero-visual {
      position: relative;
      opacity: 0; animation: fadeIn 1.2s 1s var(--ease) forwards;
    }
    @keyframes fadeIn { to { opacity: 1; } }

    .product-showcase {
      width: 100%; aspect-ratio: 3/4;
      max-height: 520px;
      background: linear-gradient(145deg, #1a1a1a 0%, #111 100%);
      border: 1px solid rgba(201,168,76,.2);
      border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden;
    }
    .product-showcase::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(160deg, rgba(201,168,76,.08) 0%, transparent 60%);
    }
    .product-icon {
      font-size: 8rem;
      filter: drop-shadow(0 20px 40px rgba(201,168,76,.3));
      animation: pulse 3s ease-in-out infinite;
    }
    @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }

    .product-badge {
      position: absolute; top: 1.5rem; right: 1.5rem;
      background: var(--gold); color: var(--ink);
      padding: .35rem .8rem;
      font-size: .7rem; font-weight: 500; letter-spacing: .15em; text-transform: uppercase;
      border-radius: 2px;
    }
    .product-info {
      position: absolute; bottom: 1.5rem; left: 1.5rem; right: 1.5rem;
      background: rgba(13,13,13,.8);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(201,168,76,.15);
      padding: 1rem 1.2rem;
      border-radius: 3px;
    }
    .product-info h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1rem; margin-bottom: .25rem;
    }
    .product-info .price {
      color: var(--gold); font-size: .9rem;
    }

    .floating-cards {
      position: absolute;
      left: -2.5rem;
      display: flex; flex-direction: column; gap: .8rem;
    }
    .f-card {
      background: rgba(20,20,20,.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(201,168,76,.2);
      padding: .7rem 1rem;
      border-radius: 6px;
      font-size: .75rem;
      white-space: nowrap;
      transform: translateX(0);
      animation: slideRight .6s var(--ease) forwards;
      opacity: 0;
    }
    .f-card:nth-child(1) { animation-delay: 1.4s; }
    .f-card:nth-child(2) { animation-delay: 1.6s; }
    .f-card:nth-child(3) { animation-delay: 1.8s; }
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(-20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .f-card .label { color: var(--gray); font-size: .65rem; letter-spacing: .1em; text-transform: uppercase; }
    .f-card .val { color: var(--gold); font-weight: 500; }

    /* STATS BAR */
    .stats-bar {
      display: flex; justify-content: center; gap: 0;
      border-top: 1px solid rgba(201,168,76,.12);
      border-bottom: 1px solid rgba(201,168,76,.12);
      overflow: hidden;
    }
    .stat-item {
      flex: 1; text-align: center;
      padding: 2rem 1rem;
      border-right: 1px solid rgba(201,168,76,.12);
      opacity: 0; transform: translateY(20px);
      transition: background .25s;
    }
    .stat-item:last-child { border-right: none; }
    .stat-item:hover { background: rgba(201,168,76,.04); }
    .stat-item.visible { opacity: 1; transform: translateY(0); transition: opacity .6s var(--ease), transform .6s var(--ease); }
    .stat-num {
      font-family: 'Playfair Display', serif;
      font-size: 2.4rem; font-weight: 700;
      color: var(--gold); line-height: 1;
      margin-bottom: .3rem;
    }
    .stat-label { font-size: .75rem; letter-spacing: .15em; text-transform: uppercase; color: var(--gray); }

    /* FEATURED CATEGORIES */
    .section { padding: 7rem 4rem; max-width: 1200px; margin: 0 auto; }
    .section-head {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 3.5rem;
    }
    .section-tag {
      font-size: .75rem; letter-spacing: .2em; text-transform: uppercase;
      color: var(--gold); margin-bottom: .6rem;
      display: flex; gap: .6rem; align-items: center;
    }
    .section-tag::before { content: ''; display: block; width: 20px; height: 1px; background: var(--gold); }
    .section-head h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2rem, 3vw, 3rem); font-weight: 700;
    }
    .see-all {
      font-size: .8rem; letter-spacing: .12em; text-transform: uppercase;
      color: var(--gold); text-decoration: none;
      border-bottom: 1px solid rgba(201,168,76,.4);
      padding-bottom: 2px;
      transition: border-color .2s;
    }
    .see-all:hover { border-color: var(--gold); }

    .categories {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.2rem;
    }
    .cat-card {
      aspect-ratio: 3/4; border-radius: 4px; overflow: hidden;
      position: relative; cursor: none;
      background: #1a1a1a;
      border: 1px solid rgba(201,168,76,.1);
      transition: transform .35s var(--ease), box-shadow .35s;
    }
    .cat-card:hover { transform: translateY(-8px); box-shadow: 0 24px 50px rgba(0,0,0,.5); }
    .cat-card-bg {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 4.5rem;
      transition: transform .5s var(--ease);
    }
    .cat-card:hover .cat-card-bg { transform: scale(1.08); }
    .cat-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(13,13,13,.9) 0%, rgba(13,13,13,.1) 60%);
    }
    .cat-info {
      position: absolute; bottom: 1.5rem; left: 1.5rem; right: 1.5rem;
    }
    .cat-info h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem; margin-bottom: .3rem;
    }
    .cat-info span { font-size: .75rem; color: var(--gold); letter-spacing: .1em; }

    /* FEATURED PRODUCTS */
    .products { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .prod-card {
      background: #111; border: 1px solid rgba(201,168,76,.1);
      border-radius: 4px; overflow: hidden; cursor: none;
      transition: transform .3s var(--ease), box-shadow .3s;
    }
    .prod-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,.4); }
    .prod-img {
      aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(145deg, #1c1c1c, #141414);
      font-size: 5rem;
      position: relative;
      overflow: hidden;
    }
    .prod-img::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(201,168,76,.06) 0%, transparent 60%);
    }
    .prod-body { padding: 1.4rem; }
    .prod-cat { font-size: .7rem; letter-spacing: .15em; text-transform: uppercase; color: var(--gold); margin-bottom: .4rem; }
    .prod-name { font-family: 'Playfair Display', serif; font-size: 1rem; margin-bottom: .5rem; }
    .prod-footer { display: flex; justify-content: space-between; align-items: center; margin-top: .8rem; }
    .prod-price { font-size: 1rem; color: var(--gold); font-weight: 500; }
    .prod-add {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(201,168,76,.12); border: 1px solid rgba(201,168,76,.3);
      color: var(--gold); font-size: 1.3rem;
      display: flex; align-items: center; justify-content: center;
      cursor: none; transition: background .2s, transform .2s;
    }
    .prod-add:hover { background: var(--gold); color: var(--ink); transform: scale(1.1); }

    /* PROMO BANNER */
    .promo-banner {
      background: linear-gradient(135deg, #1a1500 0%, #0d0d0d 50%, #1a0f00 100%);
      border: 1px solid rgba(201,168,76,.25);
      border-radius: 4px;
      padding: 4rem;
      text-align: center;
      position: relative; overflow: hidden;
      margin: 0 4rem 7rem;
    }
    .promo-banner::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse 70% 70% at 50% 50%, rgba(201,168,76,.08) 0%, transparent 70%);
    }
    .promo-banner h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 900;
      margin-bottom: 1rem; position: relative;
    }
    .promo-banner p { color: rgba(245,240,232,.6); margin-bottom: 2rem; position: relative; }
    .promo-code {
      display: inline-block;
      background: rgba(201,168,76,.12);
      border: 1px dashed rgba(201,168,76,.5);
      color: var(--gold);
      padding: .6rem 1.8rem;
      letter-spacing: .3em;
      font-size: 1.1rem;
      font-weight: 500;
      border-radius: 3px;
      margin-bottom: 2rem;
      position: relative;
    }

    /* FOOTER */
    footer {
      border-top: 1px solid rgba(201,168,76,.12);
      padding: 3rem 4rem;
      display: flex; justify-content: space-between; align-items: center;
    }
    footer .logo { font-size: 1.3rem; }
    footer p { font-size: .8rem; color: var(--gray); }
    .social-links { display: flex; gap: 1rem; }
    .social-links a {
      width: 36px; height: 36px;
      border: 1px solid rgba(201,168,76,.25);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: .9rem; text-decoration: none; color: var(--cream);
      transition: background .2s, border-color .2s;
    }
    .social-links a:hover { background: rgba(201,168,76,.15); border-color: var(--gold); }

    /* MARQUEE */
    .marquee-wrap {
      overflow: hidden; border-top: 1px solid rgba(201,168,76,.1); border-bottom: 1px solid rgba(201,168,76,.1);
      padding: 1rem 0; background: rgba(201,168,76,.02);
    }
    .marquee-track {
      display: flex; gap: 3rem; width: max-content;
      animation: marquee 20s linear infinite;
    }
    .marquee-item {
      display: flex; align-items: center; gap: .8rem;
      font-size: .75rem; letter-spacing: .15em; text-transform: uppercase;
      color: var(--gray); white-space: nowrap;
    }
    .marquee-item span { color: var(--gold); }
    @keyframes marquee { to { transform: translateX(-50%); } }

    @media (max-width: 900px) {
      nav { padding: 1rem 1.5rem; }
      .nav-links { display: none; }
      .hero { padding: 6rem 1.5rem 3rem; }
      .hero-content { grid-template-columns: 1fr; gap: 3rem; }
      .hero-visual { order: -1; }
      .floating-cards { display: none; }
      .section { padding: 4rem 1.5rem; }
      .categories { grid-template-columns: repeat(2, 1fr); }
      .products { grid-template-columns: repeat(2, 1fr); }
      .promo-banner { margin: 0 1.5rem 4rem; padding: 2.5rem 1.5rem; }
      footer { flex-direction: column; gap: 1.5rem; text-align: center; padding: 2rem 1.5rem; }
      .stats-bar { flex-wrap: wrap; }
      .stat-item { flex: 1 1 50%; border-right: none; border-bottom: 1px solid rgba(201,168,76,.12); }
    }
  </style>
</head>
<body>

  <div class="cursor" id="cursor"></div>
  <div class="cursor-ring" id="cursor-ring"></div>

  <!-- NAV -->
  <nav>
    <a href="#" class="logo">BS<span>AB</span></a>
    <ul class="nav-links">
      <li><a href="#">Shop</a></li>
      <li><a href="#">Collections</a></li>
      <li><a href="#">Brands</a></li>
      <li><a href="#">About</a></li>
    </ul>
    <div class="nav-actions">
      <button class="btn-ghost">Sign In</button>
      <button class="btn-ghost" style="border-color:var(--gold);color:var(--gold)">🛒 Cart (0)</button>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="orb orb1"></div>
    <div class="orb orb2"></div>
    <div class="hero-content">
      <div class="hero-text">
        <div class="hero-tag">New Collection 2025</div>
        <h1>Discover <em>Premium</em> Products You'll Love</h1>
        <p class="hero-desc">Welcome to BSAB — where curated luxury meets everyday convenience. Shop exclusive collections with free delivery, easy returns, and world-class service.</p>
        <div class="hero-btns">
          <button class="btn-primary">Shop Now</button>
          <button class="btn-outline">View Lookbook</button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="floating-cards">
          <div class="f-card">
            <div class="label">Happy Customers</div>
            <div class="val">48,200+</div>
          </div>
          <div class="f-card">
            <div class="label">Products</div>
            <div class="val">12,500+</div>
          </div>
          <div class="f-card">
            <div class="label">Rating</div>
            <div class="val">★ 4.9 / 5.0</div>
          </div>
        </div>
        <div class="product-showcase">
          <div class="product-icon">🎁</div>
          <div class="product-badge">New Drop</div>
          <div class="product-info">
            <h3>Signature Gift Set</h3>
            <div class="price">$129.99</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- MARQUEE -->
  <div class="marquee-wrap">
    <div class="marquee-track">
      <div class="marquee-item">✦ <span>Free Shipping</span> Over $50</div>
      <div class="marquee-item">✦ <span>30-Day</span> Returns</div>
      <div class="marquee-item">✦ <span>Secure</span> Checkout</div>
      <div class="marquee-item">✦ <span>24/7</span> Support</div>
      <div class="marquee-item">✦ <span>Exclusive</span> Members Deals</div>
      <div class="marquee-item">✦ <span>New Arrivals</span> Weekly</div>
      <div class="marquee-item">✦ <span>Free Shipping</span> Over $50</div>
      <div class="marquee-item">✦ <span>30-Day</span> Returns</div>
      <div class="marquee-item">✦ <span>Secure</span> Checkout</div>
      <div class="marquee-item">✦ <span>24/7</span> Support</div>
      <div class="marquee-item">✦ <span>Exclusive</span> Members Deals</div>
      <div class="marquee-item">✦ <span>New Arrivals</span> Weekly</div>
    </div>
  </div>

  <!-- STATS -->
  <div class="stats-bar">
    <div class="stat-item">
      <div class="stat-num" data-count="48200">0</div>
      <div class="stat-label">Happy Customers</div>
    </div>
    <div class="stat-item">
      <div class="stat-num" data-count="12500">0</div>
      <div class="stat-label">Products Listed</div>
    </div>
    <div class="stat-item">
      <div class="stat-num" data-count="320">0</div>
      <div class="stat-label">Top Brands</div>
    </div>
    <div class="stat-item">
      <div class="stat-num" data-count="99">0</div>
      <div class="stat-label">% Satisfaction</div>
    </div>
  </div>

  <!-- CATEGORIES -->
  <div class="section">
    <div class="section-head">
      <div>
        <div class="section-tag">Browse</div>
        <h2>Shop by Category</h2>
      </div>
      <a href="#" class="see-all">View All →</a>
    </div>
    <div class="categories">
      <div class="cat-card">
        <div class="cat-card-bg" style="background:linear-gradient(145deg,#1e1a0f,#141414)">👗</div>
        <div class="cat-overlay"></div>
        <div class="cat-info"><h3>Fashion</h3><span>2,400+ Items</span></div>
      </div>
      <div class="cat-card" style="grid-row: span 1;">
        <div class="cat-card-bg" style="background:linear-gradient(145deg,#0f1a1e,#141414)">💻</div>
        <div class="cat-overlay"></div>
        <div class="cat-info"><h3>Electronics</h3><span>1,800+ Items</span></div>
      </div>
      <div class="cat-card">
        <div class="cat-card-bg" style="background:linear-gradient(145deg,#1a0f0f,#141414)">🏠</div>
        <div class="cat-overlay"></div>
        <div class="cat-info"><h3>Home & Living</h3><span>3,100+ Items</span></div>
      </div>
      <div class="cat-card">
        <div class="cat-card-bg" style="background:linear-gradient(145deg,#0f1a10,#141414)">💄</div>
        <div class="cat-overlay"></div>
        <div class="cat-info"><h3>Beauty</h3><span>900+ Items</span></div>
      </div>
    </div>
  </div>

  <!-- PRODUCTS -->
  <div class="section" style="padding-top:0">
    <div class="section-head">
      <div>
        <div class="section-tag">Trending</div>
        <h2>Featured Products</h2>
      </div>
      <a href="#" class="see-all">See More →</a>
    </div>
    <div class="products">
      <div class="prod-card">
        <div class="prod-img">✨</div>
        <div class="prod-body">
          <div class="prod-cat">Beauty</div>
          <div class="prod-name">Luxury Skincare Set</div>
          <div class="prod-footer">
            <span class="prod-price">$89.00</span>
            <button class="prod-add">+</button>
          </div>
        </div>
      </div>
      <div class="prod-card">
        <div class="prod-img">⌚</div>
        <div class="prod-body">
          <div class="prod-cat">Accessories</div>
          <div class="prod-name">Classic Timepiece</div>
          <div class="prod-footer">
            <span class="prod-price">$249.00</span>
            <button class="prod-add">+</button>
          </div>
        </div>
      </div>
      <div class="prod-card">
        <div class="prod-img">🎧</div>
        <div class="prod-body">
          <div class="prod-cat">Electronics</div>
          <div class="prod-name">Noise Cancelling Headset</div>
          <div class="prod-footer">
            <span class="prod-price">$179.00</span>
            <button class="prod-add">+</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- PROMO BANNER -->
  <div class="promo-banner">
    <h2>Get 20% Off Your First Order</h2>
    <p>Join BSAB today and unlock exclusive member discounts, early access to sales, and free shipping on every order.</p>
    <div class="promo-code">BSAB20</div><br/>
    <button class="btn-primary">Claim Your Discount</button>
  </div>

  <!-- FOOTER -->
  <footer>
    <a href="#" class="logo">BS<span>AB</span></a>
    <p>© 2025 BSAB E‑Commerce. All rights reserved.</p>
    <div class="social-links">
      <a href="#">𝕏</a>
      <a href="#">in</a>
      <a href="#">f</a>
      <a href="#">📸</a>
    </div>
  </footer>

  <script>
    // Cursor
    const cur = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx+'px'; cur.style.top = my+'px'; });
    function animRing() { rx += (mx-rx)*.12; ry += (my-ry)*.12; ring.style.left = rx+'px'; ring.style.top = ry+'px'; requestAnimationFrame(animRing); }
    animRing();
    document.querySelectorAll('button, a, .cat-card, .prod-card').forEach(el => {
      el.addEventListener('mouseenter', () => { cur.style.width='20px'; cur.style.height='20px'; ring.style.width='54px'; ring.style.height='54px'; ring.style.opacity='.3'; });
      el.addEventListener('mouseleave', () => { cur.style.width='12px'; cur.style.height='12px'; ring.style.width='36px'; ring.style.height='36px'; ring.style.opacity='.6'; });
    });

    // Counter animation
    function animCount(el, target) {
      const dur = 1800, step = 20;
      let start = null;
      function update(ts) {
        if (!start) start = ts;
        const prog = Math.min((ts-start)/dur, 1);
        const val = Math.round(prog * target);
        const suffix = target > 1000 ? (target > 10000 ? '+' : '+') : (el.textContent.includes('%') ? '%' : '+');
        el.textContent = val.toLocaleString() + (target >= 99 && target <= 100 ? '%' : target >= 100 ? '+' : '+');
        if (prog < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }

    // Scroll reveal for stats
    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.stat-item');
          items.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add('visible');
              const num = item.querySelector('.stat-num');
              animCount(num, parseInt(num.dataset.count));
            }, i * 120);
          });
          statsObs.unobserve(entry.target);
        }
      });
    }, { threshold: .3 });
    statsObs.observe(document.querySelector('.stats-bar'));

    // Cart button
    let count = 0;
    const cartBtn = document.querySelector('.nav-actions button:last-child');
    document.querySelectorAll('.prod-add').forEach(btn => {
      btn.addEventListener('click', () => {
        count++;
        cartBtn.textContent = `🛒 Cart (${count})`;
        btn.textContent = '✓';
        btn.style.background = 'var(--gold)';
        btn.style.color = 'var(--ink)';
        setTimeout(() => { btn.textContent = '+'; btn.style.background=''; btn.style.color=''; }, 1200);
      });
    });
  </script>
</body>
</html>
