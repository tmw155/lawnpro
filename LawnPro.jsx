import { useState, useRef, useEffect } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SB_URL  = "https://syfagxyidrrthxsvrlse.supabase.co";
const SB_KEY  = "sb_publishable_Y_qLfAR5_9Pd-dO27eLzDA_IchUoBxg";
const SK_PUB  = "pk_test_51TJD4pJRhblJ0xU6cAHxinDn6NWkEgjxRFmTOeQlkrE1ZPJSeDWlOfQMb7tWFinQsyojvypU0kV6bpbxyLVc6zUg00EtsrRNrx";
const SK_PRICE= "price_1TJD7XJRhblJ0xU6tr15a3B6";
// ⬇ Create a Payment Link in Stripe dashboard (Product catalog → LawnPro Pro → Create payment link)
// Then paste the URL here, e.g. "https://buy.stripe.com/test_xxxx"
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_28EeVe0hng6Y60UgwO9bO00";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --sage:#5a7a5a;--sage-l:#8aab7e;--sage-d:#3a5a3a;--sage-xl:#c8e0b8;
  --gold:#c8960a;--cream:#f7f4ee;--warm:#fdfcf9;--tan:#e8e0d0;--tan-d:#c8bca8;
  --brown:#7a6a5a;--text:#2a2a2a;--muted:#7a7a6a;--red:#cc3030;
  --card:#fff;--sh:0 2px 16px rgba(60,80,40,.10);--shl:0 8px 40px rgba(60,80,40,.16);
  --r:16px;--rs:10px;
}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--text);min-height:100vh;-webkit-font-smoothing:antialiased}
.app{max-width:480px;min-height:100vh;margin:0 auto;background:var(--warm);position:relative;overflow:hidden;box-shadow:0 0 60px rgba(60,80,40,.08)}
.ob{min-height:100vh;display:flex;flex-direction:column;background:linear-gradient(160deg,#1e3a1e 0%,#3a6a3a 50%,#6a9a5a 100%);position:relative;overflow:hidden}
.ob-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 80% 60% at 50% 110%,rgba(255,255,200,.12),transparent 70%)}
.ob-leaf{position:absolute;opacity:.08;font-size:220px;top:-30px;right:-40px;transform:rotate(25deg);pointer-events:none;animation:sway 9s ease-in-out infinite alternate}
.ob-leaf2{position:absolute;opacity:.05;font-size:160px;bottom:60px;left:-30px;transform:rotate(-18deg);pointer-events:none;animation:sway 13s ease-in-out infinite alternate-reverse}
@keyframes sway{from{transform:rotate(25deg) scale(1)}to{transform:rotate(30deg) scale(1.05)}}
.ob-content{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:48px 32px 56px}
.logo-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.15);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.25);border-radius:40px;padding:6px 14px;margin-bottom:32px;width:fit-content}
.logo-dot{width:8px;height:8px;border-radius:50%;background:#a8e06a}
.logo-badge span{font-size:12px;color:rgba(255,255,255,.9);font-weight:500;letter-spacing:.5px}
.ob-title{font-family:'Playfair Display',serif;font-size:50px;line-height:1.05;font-weight:700;color:#fff;margin-bottom:16px}
.ob-title em{color:#a8e06a;font-style:normal}
.ob-sub{font-size:16px;color:rgba(255,255,255,.75);line-height:1.6;margin-bottom:48px;font-weight:300}
.bp{background:#a8e06a;color:#1e3a1e;border:none;border-radius:50px;padding:16px 32px;font-size:16px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;width:100%;transition:transform .15s,box-shadow .15s;box-shadow:0 4px 20px rgba(168,224,106,.4)}
.bp:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(168,224,106,.5)}
.bp:disabled{opacity:.45;cursor:default;transform:none}
.loc{min-height:100vh;background:var(--warm);display:flex;flex-direction:column;padding:60px 28px 40px;animation:fu .35s ease-out}
.eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:var(--sage);font-weight:600;margin-bottom:12px}
.stitle{font-family:'Playfair Display',serif;font-size:32px;font-weight:700;line-height:1.2;color:var(--text)}
.ssub{margin-top:10px;font-size:15px;color:var(--muted);line-height:1.5}
.ilabel{font-size:13px;font-weight:600;color:var(--brown);margin-bottom:8px;display:block}
.ifield{width:100%;padding:14px 16px;border:1.5px solid var(--tan);border-radius:var(--rs);font-size:15px;font-family:'DM Sans',sans-serif;background:var(--warm);color:var(--text);transition:border-color .2s;outline:none}
.ifield:focus{border-color:var(--sage-l);box-shadow:0 0 0 3px rgba(90,122,90,.1)}
.ifield.err{border-color:var(--red)}
select.ifield{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a6a5a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center}
.nav{position:sticky;top:0;z-index:100;background:rgba(253,252,249,.93);backdrop-filter:blur(12px);border-bottom:1px solid var(--tan);padding:14px 20px;display:flex;align-items:center;justify-content:space-between}
.nav-logo{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--sage-d)}
.nav-logo em{color:var(--sage-l);font-style:normal}
.nav-right{display:flex;gap:8px;align-items:center}
.pro-badge{background:linear-gradient(135deg,#c8960a,#f0b820);color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:.5px}
.icon-btn{background:none;border:none;cursor:pointer;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;transition:background .15s}
.icon-btn:hover{background:var(--tan)}
.user-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--sage-d),var(--sage));display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff;font-weight:700;cursor:pointer;border:2px solid var(--sage-xl);transition:transform .15s}
.user-avatar:hover{transform:scale(1.08)}
.tab-bar{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;z-index:100;background:rgba(253,252,249,.97);backdrop-filter:blur(16px);border-top:1px solid var(--tan);display:flex;padding:8px 0 12px}
.tab-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;cursor:pointer;padding:6px 2px;color:var(--muted);font-family:'DM Sans',sans-serif;transition:color .15s;position:relative}
.tab-btn.active{color:var(--sage)}
.tab-icon{font-size:20px;line-height:1}
.tab-label{font-size:9px;font-weight:700;letter-spacing:.3px;text-transform:uppercase}
.tab-pip{position:absolute;top:4px;right:calc(50% - 14px);width:6px;height:6px;border-radius:50%;background:var(--gold);border:2px solid var(--warm)}
.screen{padding:22px 22px 110px;animation:fu .35s ease-out}
@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.sh{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:var(--brown);margin-bottom:12px}
.gsub{font-size:13px;color:var(--muted);margin-bottom:4px}
.gtitle{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:var(--text);margin-bottom:20px}
.gtitle em{color:var(--sage);font-style:normal}
.weather-card{background:linear-gradient(135deg,#2563a8,#4a8ad4);border-radius:var(--r);padding:18px;margin-bottom:16px;color:#fff;display:flex;align-items:center;gap:14px;transition:opacity .2s}
.weather-card.loading{opacity:.75}
.w-icon{font-size:38px;flex-shrink:0}
.w-temp{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;line-height:1}
.w-desc{font-size:13px;opacity:.82;margin-top:2px}
.w-detail{font-size:12px;opacity:.7;margin-top:4px}
.w-badge{margin-left:auto;background:rgba(255,255,255,.18);border-radius:10px;padding:8px 12px;text-align:center;flex-shrink:0}
.w-badge-val{font-size:16px}
.w-badge-label{font-size:10px;opacity:.75;margin-top:2px;line-height:1.3}
.usage-bar{background:var(--cream);border-radius:var(--r);padding:13px 16px;margin-bottom:16px;display:flex;align-items:center;gap:12px;border:1.5px solid var(--tan);cursor:pointer}
.usage-track{flex:1;background:var(--tan);border-radius:100px;height:5px;margin-top:5px}
.usage-fill{height:100%;border-radius:100px;background:var(--sage);transition:width .5s}
.usage-fill.warn{background:#c8600a}
.usage-txt{font-size:11px;color:var(--muted);margin-top:4px}
.hero{background:linear-gradient(135deg,var(--sage-d),var(--sage) 55%,var(--sage-l));border-radius:22px;padding:26px;margin-bottom:16px;position:relative;overflow:hidden;cursor:pointer;transition:transform .2s,box-shadow .2s;box-shadow:var(--shl)}
.hero:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(60,80,40,.22)}
.hero-bg{position:absolute;right:-10px;bottom:-14px;font-size:110px;opacity:.13;pointer-events:none}
.hero-label{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,.65);margin-bottom:8px;font-weight:700}
.hero-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#fff;line-height:1.2;margin-bottom:6px}
.hero-sub{font-size:13px;color:rgba(255,255,255,.75);line-height:1.5;margin-bottom:18px}
.hero-btn{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.2);backdrop-filter:blur(8px);border:1.5px solid rgba(255,255,255,.35);color:#fff;border-radius:50px;padding:10px 20px;font-size:13px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
.mini{background:var(--card);border-radius:var(--r);padding:18px 14px;box-shadow:var(--sh);cursor:pointer;transition:transform .15s,box-shadow .15s;border:1.5px solid transparent;position:relative}
.mini:hover{transform:translateY(-2px);box-shadow:var(--shl);border-color:var(--tan)}
.mini-icon{font-size:26px;margin-bottom:8px}
.mini-title{font-size:13px;font-weight:700;color:var(--text);margin-bottom:3px}
.mini-sub{font-size:11px;color:var(--muted);line-height:1.4}
.pro-lock{position:absolute;top:10px;right:10px;font-size:12px;opacity:.5}
.season-card{background:linear-gradient(135deg,#fff8e8,#fdf0cc);border:1.5px solid #e0c870;border-radius:var(--r);padding:18px;margin-bottom:20px}
.season-badge{display:inline-flex;align-items:center;gap:6px;background:#e8c840;color:#5a4010;border-radius:20px;padding:4px 12px;font-size:11px;font-weight:700;margin-bottom:10px}
.season-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#5a4010;margin-bottom:8px}
.season-tip{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:#7a5a20;line-height:1.5;margin-bottom:6px}
.season-dot{width:5px;height:5px;border-radius:50%;background:#c8a030;margin-top:7px;flex-shrink:0}
.upload-zone{border:2.5px dashed var(--tan-d);border-radius:20px;background:var(--cream);padding:40px 20px;display:flex;flex-direction:column;align-items:center;gap:10px;cursor:pointer;transition:border-color .2s,background .2s;margin-bottom:20px;text-align:center}
.upload-zone:hover{border-color:var(--sage-l);background:rgba(90,122,90,.04)}
.uz-icon{font-size:44px}
.uz-title{font-size:16px;font-weight:600;color:var(--text)}
.uz-sub{font-size:13px;color:var(--muted)}
.uz-link{font-size:13px;color:var(--sage);font-weight:600;text-decoration:underline}
.preview-wrap{position:relative;border-radius:20px;overflow:hidden;margin-bottom:20px;aspect-ratio:4/3}
.preview-wrap img{width:100%;height:100%;object-fit:cover}
.preview-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.5));display:flex;align-items:flex-end;padding:14px}
.preview-change{background:rgba(255,255,255,.2);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.4);color:#fff;border-radius:30px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif}
.dc{background:var(--card);border-radius:var(--r);padding:18px;box-shadow:var(--sh);margin-bottom:14px}
.dc-title{font-size:14px;font-weight:700;color:var(--text);margin-bottom:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.dc-sub{font-size:11px;color:var(--muted);font-weight:400;margin-left:auto}
.chip-group{display:flex;flex-wrap:wrap;gap:8px}
.chip{padding:7px 13px;border-radius:30px;font-size:12px;font-weight:600;border:1.5px solid var(--tan);background:var(--warm);color:var(--brown);cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
.chip.sel{background:var(--sage);border-color:var(--sage);color:#fff}
.tarea{width:100%;padding:12px 14px;border:1.5px solid var(--tan);border-radius:var(--rs);font-size:14px;font-family:'DM Sans',sans-serif;background:var(--warm);color:var(--text);resize:none;outline:none;line-height:1.5;transition:border-color .2s}
.tarea:focus{border-color:var(--sage-l)}
.load-wrap{min-height:55vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:40px}
.load-orb{width:72px;height:72px;border-radius:50%;background:conic-gradient(var(--sage-d),var(--sage-l),#a8e06a,var(--sage-d));animation:spin 1.4s linear infinite;box-shadow:0 0 28px rgba(90,122,90,.3)}
@keyframes spin{to{transform:rotate(360deg)}}
.load-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:600;color:var(--text);text-align:center}
.load-sub{font-size:14px;color:var(--muted);text-align:center;line-height:1.6;max-width:260px}
.load-steps{display:flex;flex-direction:column;gap:10px;width:100%;max-width:240px}
.load-step{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--muted)}
.ldot{width:8px;height:8px;border-radius:50%;background:var(--tan-d);flex-shrink:0;transition:background .4s}
.ldot.done{background:var(--sage)}
.ldot.active{background:var(--sage-l);animation:pulse 1s ease-in-out infinite}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.6}}
.rh{background:linear-gradient(135deg,var(--sage-d),var(--sage));border-radius:20px;padding:22px;margin-bottom:16px;color:#fff}
.rh-label{font-size:10px;text-transform:uppercase;letter-spacing:2px;opacity:.65;margin-bottom:6px;font-weight:700}
.rh-score{display:flex;align-items:baseline;gap:6px;margin-bottom:4px}
.rh-num{font-family:'Playfair Display',serif;font-size:52px;font-weight:700;line-height:1}
.rh-unit{font-size:18px;opacity:.65}
.rh-status{font-size:15px;font-weight:700}
.rh-sum{font-size:13px;opacity:.75;line-height:1.5;margin-top:6px}
.rh-bar-wrap{margin-top:14px;background:rgba(255,255,255,.2);border-radius:100px;height:5px}
.rh-bar{height:100%;border-radius:100px;background:#a8e06a;transition:width 1.2s ease-out}
.rc{background:var(--card);border-radius:var(--r);padding:18px;box-shadow:var(--sh);margin-bottom:12px}
.rc-head{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap}
.rc-icon{font-size:20px}
.rc-title{font-size:14px;font-weight:700;color:var(--text)}
.badge{margin-left:auto;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
.b-sci{background:#e8f0ff;color:#3a5aaa}
.b-tip{background:#e8f8e8;color:#3a6a3a}
.b-pro{background:linear-gradient(135deg,#c8960a,#f0b820);color:#fff}
.grass-tag{display:inline-flex;align-items:center;gap:6px;background:var(--sage-xl);border-radius:20px;padding:5px 12px;font-size:12px;font-weight:700;color:var(--sage-d);margin-bottom:14px}
.advice-item{display:flex;gap:12px;align-items:flex-start;padding:11px;background:var(--cream);border-radius:var(--rs);margin-bottom:8px}
.advice-num{width:22px;height:22px;border-radius:50%;background:var(--sage);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.advice-txt{font-size:13px;color:var(--text);line-height:1.5}
.sponsored-badge{display:inline-block;padding:2px 7px;border-radius:6px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;background:#f0f0e8;color:#7a7a50;border:1px solid #d8d8c0;margin-left:6px;vertical-align:middle}
.affiliate-badge{display:inline-block;padding:2px 7px;border-radius:6px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;background:#e8f0e8;color:#4a6a4a;border:1px solid #c0d8c0;margin-left:6px;vertical-align:middle}
.product-card{border:1.5px solid var(--tan);border-radius:var(--rs);padding:12px;display:flex;gap:12px;align-items:center;margin-bottom:8px;cursor:pointer;transition:border-color .15s,box-shadow .15s}
.product-card:hover{border-color:var(--sage-l);box-shadow:var(--sh)}
.product-card.sponsored-card{border-color:#e8d890;background:linear-gradient(135deg,#fffef5,#fffce8)}
.p-emoji{font-size:26px;width:44px;height:44px;background:var(--cream);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.p-name{font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px}
.p-why{font-size:11px;color:var(--muted);line-height:1.4;margin-bottom:4px}
.p-price{font-size:12px;color:var(--sage);text-decoration:underline;text-underline-offset:2px;cursor:pointer}
.p-buy{margin-left:auto;background:var(--sage);color:#fff;border:none;border-radius:20px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;flex-shrink:0}
.featured-partner{border-radius:var(--r);overflow:hidden;margin-bottom:10px;border:1.5px solid #e0c870;cursor:pointer;transition:transform .15s,box-shadow .15s}
.featured-partner:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(200,180,40,.2)}
.fp-header{background:linear-gradient(135deg,#2a4a1a,#4a7a2a);padding:16px 18px;display:flex;align-items:center;gap:12px}
.fp-logo{width:44px;height:44px;border-radius:10px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.fp-brand{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#fff}
.fp-tagline{font-size:12px;color:rgba(255,255,255,.7);margin-top:2px}
.fp-sponsored{margin-left:auto;background:rgba(255,255,255,.15);color:rgba(255,255,255,.8);border-radius:20px;padding:4px 10px;font-size:10px;font-weight:700;letter-spacing:.5px;border:1px solid rgba(255,255,255,.2)}
.fp-body{background:#fff;padding:14px 18px}
.fp-offer{font-size:13px;font-weight:700;color:var(--sage-d);margin-bottom:6px}
.fp-desc{font-size:12px;color:var(--muted);line-height:1.5;margin-bottom:12px}
.fp-cta{display:flex;align-items:center;justify-content:space-between}
.fp-btn{background:var(--sage-d);color:#fff;border:none;border-radius:30px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif}
.fp-commission{font-size:11px;color:var(--muted);font-style:italic}
.disclosure{font-size:11px;color:var(--muted);text-align:center;padding:10px 0 4px;line-height:1.5}
.partner-strip{background:var(--card);border-radius:var(--r);padding:16px;box-shadow:var(--sh);margin-bottom:20px}
.partner-strip-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin-bottom:12px;text-align:center}
.partner-logos{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}
.partner-logo{flex-shrink:0;background:var(--cream);border-radius:var(--rs);padding:10px 14px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;border:1.5px solid var(--tan);transition:border-color .15s;min-width:80px}
.partner-logo:hover{border-color:var(--sage-l)}
.partner-logo-icon{font-size:22px}
.partner-logo-name{font-size:10px;font-weight:700;color:var(--brown);text-align:center}
.revenue-card{background:linear-gradient(135deg,#1e3a1e,#2e5a2e);border-radius:var(--r);padding:18px;margin-bottom:14px;color:#fff}
.rev-title{font-size:11px;text-transform:uppercase;letter-spacing:2px;opacity:.65;margin-bottom:12px;font-weight:700}
.rev-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.rev-stat{text-align:center}
.rev-num{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#a8e06a;line-height:1}
.rev-label{font-size:10px;opacity:.7;margin-top:3px}
.rev-note{font-size:11px;opacity:.6;margin-top:12px;text-align:center;line-height:1.5}
.plan-day{background:var(--card);border-radius:var(--rs);padding:13px;margin-bottom:8px;border-left:3px solid var(--sage-l)}
.plan-day-name{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--sage);margin-bottom:6px}
.plan-task{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--text);line-height:1.5;margin-bottom:4px}
.plan-dot{width:5px;height:5px;border-radius:50%;background:var(--sage-l);margin-top:7px;flex-shrink:0}
.save-btn{width:100%;padding:14px;border-radius:50px;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;border:2px solid var(--sage);background:transparent;color:var(--sage);transition:all .2s;margin-bottom:10px}
.save-btn:hover,.save-btn.saved{background:var(--sage);color:#fff}
.bs{background:var(--cream);color:var(--sage-d);border:1.5px solid var(--tan);border-radius:50px;padding:12px 24px;font-size:13px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;transition:background .15s;width:100%;margin-bottom:10px}
.bs:hover{background:var(--tan)}
.divider{height:1px;background:var(--tan);margin:16px 0}
.chat-wrap{display:flex;flex-direction:column}
.chat-hdr{padding:16px 20px 12px;border-bottom:1px solid var(--tan)}
.chat-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--text)}
.chat-sub{font-size:12px;color:var(--muted);margin-top:2px}
.ai-badge{display:inline-flex;align-items:center;gap:5px;background:var(--sage-xl);border-radius:20px;padding:3px 10px;font-size:10px;font-weight:700;color:var(--sage-d);margin-top:6px}
.chat-msgs{overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:12px}
.msg{display:flex;gap:10px;animation:fu .25s ease-out}
.msg.user{flex-direction:row-reverse}
.msg-av{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.msg-av.ai{background:var(--sage-d)}
.msg-av.usr{background:var(--cream);border:1.5px solid var(--tan)}
.bubble{max-width:78%;padding:11px 14px;border-radius:var(--r);font-size:14px;line-height:1.55;color:var(--text)}
.bubble.ai{background:var(--card);box-shadow:var(--sh);border-radius:4px 16px 16px 16px}
.bubble.usr{background:var(--sage);color:#fff;border-radius:16px 4px 16px 16px}
.typing{display:flex;gap:5px;align-items:center;padding:4px 0}
.tdot{width:7px;height:7px;border-radius:50%;background:var(--muted);animation:blink 1.2s ease-in-out infinite}
.tdot:nth-child(2){animation-delay:.2s}
.tdot:nth-child(3){animation-delay:.4s}
@keyframes blink{0%,80%,100%{opacity:.3}40%{opacity:1}}
.chat-input-wrap{padding:12px 16px;background:var(--warm);border-top:1px solid var(--tan);display:flex;gap:10px;align-items:flex-end}
.chat-input{flex:1;padding:12px 14px;border:1.5px solid var(--tan);border-radius:var(--rs);font-size:14px;font-family:'DM Sans',sans-serif;background:var(--card);color:var(--text);resize:none;outline:none;max-height:100px;line-height:1.5;transition:border-color .2s}
.chat-input:focus{border-color:var(--sage-l)}
.chat-send{width:42px;height:42px;border-radius:50%;background:var(--sage);border:none;color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;flex-shrink:0}
.chat-send:hover{background:var(--sage-d)}
.chat-send:disabled{opacity:.4;cursor:default}
.starters{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.starter{padding:7px 12px;border-radius:30px;font-size:12px;font-weight:500;border:1.5px solid var(--tan);background:var(--warm);color:var(--brown);cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
.starter:hover{border-color:var(--sage-l);color:var(--sage)}
.rem-card{background:var(--card);border-radius:var(--r);padding:16px;box-shadow:var(--sh);margin-bottom:10px;display:flex;align-items:center;gap:12px}
.rem-icon{font-size:26px;flex-shrink:0}
.rem-info{flex:1}
.rem-name{font-size:14px;font-weight:600;color:var(--text);margin-bottom:2px}
.rem-sched{font-size:11px;color:var(--muted)}
.toggle{width:44px;height:26px;border-radius:13px;background:var(--tan);position:relative;cursor:pointer;border:none;transition:background .2s;flex-shrink:0}
.toggle.on{background:var(--sage)}
.toggle-thumb{position:absolute;width:20px;height:20px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform .2s;box-shadow:0 1px 4px rgba(0,0,0,.2)}
.toggle.on .toggle-thumb{transform:translateX(18px)}
.report-card{background:var(--card);border-radius:var(--r);padding:16px;box-shadow:var(--sh);margin-bottom:10px;display:flex;gap:12px;align-items:center;cursor:pointer;transition:transform .15s,box-shadow .15s;border:1.5px solid transparent}
.report-card:hover{transform:translateY(-2px);box-shadow:var(--shl);border-color:var(--tan)}
.rep-thumb{width:60px;height:60px;border-radius:10px;overflow:hidden;flex-shrink:0}
.rep-thumb img{width:100%;height:100%;object-fit:cover}
.rep-ph{width:60px;height:60px;border-radius:10px;background:var(--cream);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0}
.rep-date{font-size:10px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px}
.rep-name{font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px}
.score-pill{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700}
.sg{background:#e8f8e8;color:#3a6a3a}
.sf{background:#fff8e0;color:#7a5a00}
.sp{background:#fde8e8;color:#8a2020}
.rep-arr{color:var(--tan-d);font-size:20px}
.chart-wrap{background:var(--card);border-radius:var(--r);padding:18px;box-shadow:var(--sh);margin-bottom:14px}
.chart-title{font-size:13px;font-weight:700;color:var(--text);margin-bottom:14px;display:flex;align-items:center;justify-content:space-between}
.compare-panel{background:var(--card);border-radius:var(--r);padding:18px;box-shadow:var(--sh);margin-bottom:14px}
.compare-heads{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.cside{border-radius:var(--rs);padding:12px;text-align:center}
.cside.a{background:rgba(90,122,90,.08)}
.cside.b{background:rgba(200,150,10,.08)}
.cscore{font-family:'Playfair Display',serif;font-size:30px;font-weight:700}
.cdate{font-size:11px;color:var(--muted);margin-top:2px}
.crow{display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:6px}
.clabel{font-size:12px;color:var(--muted);width:80px;flex-shrink:0}
.cbar-wrap{flex:1;background:var(--tan);border-radius:100px;height:5px}
.cbar{height:100%;border-radius:100px}
.cdelta{font-size:11px;font-weight:700;width:34px;text-align:right;flex-shrink:0}
.dp{color:#3a8a3a}.dn{color:#cc3030}.dn0{color:var(--muted)}
.bench-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.bench-label{font-size:12px;color:#4a6a8a;width:110px;flex-shrink:0}
.bench-bar-wrap{flex:1;background:#c0daf0;border-radius:100px;height:6px}
.bench-bar{height:100%;border-radius:100px;background:#3a8ad4}
.bench-bar.yours{background:var(--sage)}
.bench-val{font-size:12px;font-weight:700;color:#2a4a6a;width:30px;text-align:right;flex-shrink:0}
.empty{text-align:center;padding:60px 24px}
.empty-icon{font-size:60px;margin-bottom:14px;opacity:.4}
.empty-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--text);margin-bottom:8px}
.empty-sub{font-size:14px;color:var(--muted);line-height:1.6;margin-bottom:24px}
/* ── Modals ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:200;display:flex;align-items:flex-end;justify-content:center;animation:fdi .2s ease-out}
@keyframes fdi{from{opacity:0}to{opacity:1}}
.modal-sheet{background:var(--warm);border-radius:24px 24px 0 0;width:100%;max-width:480px;animation:ssh .3s ease-out;max-height:92vh;overflow-y:auto;position:relative}
@keyframes ssh{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modal-handle{width:36px;height:4px;background:var(--tan-d);border-radius:2px;margin:14px auto 0}
.modal-content{padding:20px 24px 40px}
.modal-close{position:absolute;top:16px;right:20px;background:var(--tan);border:none;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center}
/* ── Pro Modal ── */
.pro-hdr{text-align:center;margin-bottom:22px}
.pro-crown{font-size:44px;margin-bottom:10px}
.pro-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:var(--text);margin-bottom:6px}
.pro-subtitle{font-size:14px;color:var(--muted);line-height:1.5}
.pro-price-card{background:linear-gradient(135deg,#1e3a1e,#3a6a3a);border-radius:var(--r);padding:20px;text-align:center;margin-bottom:18px}
.pro-price{font-family:'Playfair Display',serif;font-size:42px;font-weight:700;color:#fff;line-height:1}
.pro-period{font-size:14px;color:rgba(255,255,255,.65);margin-top:4px}
.pro-save{display:inline-block;background:#a8e06a;color:#1e3a1e;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;margin-top:10px}
.pro-features{display:flex;flex-direction:column;gap:10px;margin-bottom:22px}
.pro-feat{display:flex;align-items:flex-start;gap:12px}
.pro-check{width:24px;height:24px;border-radius:50%;background:var(--sage-xl);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;color:var(--sage-d)}
.pro-feat-txt{font-size:14px;color:var(--text);line-height:1.4}
.pro-feat-txt strong{color:var(--sage-d)}
/* ── Auth Modal ── */
.auth-tabs{display:flex;background:var(--cream);border-radius:var(--rs);padding:4px;margin-bottom:22px;gap:4px}
.auth-tab{flex:1;padding:10px;border-radius:8px;border:none;font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;background:transparent;color:var(--muted);transition:all .15s}
.auth-tab.active{background:var(--card);color:var(--text);box-shadow:0 1px 4px rgba(0,0,0,.08)}
.auth-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:var(--text);margin-bottom:6px}
.auth-sub{font-size:14px;color:var(--muted);margin-bottom:22px;line-height:1.5}
.form-group{margin-bottom:16px}
.auth-err{background:#fde8e8;border:1px solid #f4b8b8;border-radius:var(--rs);padding:12px 14px;font-size:13px;color:var(--red);margin-bottom:16px;line-height:1.5}
.auth-link{font-size:13px;color:var(--sage);text-decoration:underline;cursor:pointer;text-align:center;display:block;margin-top:14px}
.auth-divider{display:flex;align-items:center;gap:12px;margin:18px 0}
.auth-divider-line{flex:1;height:1px;background:var(--tan)}
.auth-divider-txt{font-size:12px;color:var(--muted);font-weight:500}
/* ── Profile Screen ── */
.profile-header{background:linear-gradient(135deg,var(--sage-d),var(--sage));border-radius:20px;padding:24px;margin-bottom:20px;color:#fff;text-align:center}
.profile-avatar{width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;margin:0 auto 12px;border:3px solid rgba(255,255,255,.3)}
.profile-name{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#fff;margin-bottom:4px}
.profile-email{font-size:13px;opacity:.75}
.profile-plan-badge{display:inline-flex;align-items:center;gap:6px;margin-top:10px;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700}
.plan-free{background:rgba(255,255,255,.15);color:#fff}
.plan-pro{background:#a8e06a;color:#1e3a1e}
.profile-stat-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px}
.profile-stat{background:var(--card);border-radius:var(--r);padding:14px;text-align:center;box-shadow:var(--sh)}
.profile-stat-num{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:var(--sage-d)}
.profile-stat-label{font-size:11px;color:var(--muted);margin-top:3px}
.profile-section{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);margin-bottom:14px;overflow:hidden}
.profile-row{display:flex;align-items:center;gap:14px;padding:16px 18px;border-bottom:1px solid var(--tan);cursor:pointer;transition:background .15s}
.profile-row:last-child{border-bottom:none}
.profile-row:hover{background:var(--cream)}
.profile-row-icon{font-size:20px;flex-shrink:0}
.profile-row-label{font-size:14px;font-weight:600;color:var(--text);flex:1}
.profile-row-value{font-size:13px;color:var(--muted)}
.profile-row-arrow{font-size:18px;color:var(--tan-d)}
.signout-btn{width:100%;padding:14px;border-radius:50px;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;border:2px solid var(--red);background:transparent;color:var(--red);transition:all .2s;margin-top:8px}
.signout-btn:hover{background:var(--red);color:#fff}
/* ── Cloud sync badge ── */
.cloud-badge{display:inline-flex;align-items:center;gap:5px;background:#e8f0ff;border-radius:20px;padding:4px 10px;font-size:11px;font-weight:600;color:#3a5aaa;margin-bottom:14px}
/* ── Toast ── */
.toast{position:fixed;bottom:88px;left:50%;transform:translateX(-50%);background:var(--sage-d);color:#fff;padding:11px 22px;border-radius:50px;font-size:13px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,.2);white-space:nowrap;z-index:300;animation:ti .3s ease-out}
@keyframes ti{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
/* ── Free profile onboarding ── */
.profile-setup{min-height:100vh;background:var(--warm);display:flex;flex-direction:column;padding:52px 28px 40px;animation:fu .35s ease-out}
.setup-steps{display:flex;gap:6px;margin-bottom:36px}
.setup-step-dot{height:4px;border-radius:2px;background:var(--tan);transition:background .3s;flex:1}
.setup-step-dot.active{background:var(--sage)}
.setup-card{background:var(--card);border-radius:var(--r);padding:20px;box-shadow:var(--sh);margin-bottom:14px}
.setup-card-title{font-size:13px;font-weight:700;color:var(--text);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.soil-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.soil-opt{padding:10px 12px;border-radius:var(--rs);border:1.5px solid var(--tan);background:var(--warm);cursor:pointer;transition:all .15s;text-align:center}
.soil-opt:hover{border-color:var(--sage-l)}
.soil-opt.sel{border-color:var(--sage);background:rgba(90,122,90,.06)}
.soil-opt-icon{font-size:20px;margin-bottom:4px}
.soil-opt-label{font-size:12px;font-weight:600;color:var(--text)}
.soil-opt-sub{font-size:10px;color:var(--muted);margin-top:1px}
.skip-link{font-size:13px;color:var(--muted);text-align:center;display:block;margin-top:16px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
/* ── Guest profile ── */
.guest-profile-header{background:linear-gradient(135deg,#3a5a3a,#6a8a5a);border-radius:20px;padding:24px;margin-bottom:20px;color:#fff;position:relative;overflow:hidden}
.guest-profile-bg{position:absolute;right:-10px;bottom:-10px;font-size:100px;opacity:.1;pointer-events:none}
.guest-avatar{width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:12px;border:2px solid rgba(255,255,255,.3)}
.guest-name{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#fff;margin-bottom:2px}
.guest-since{font-size:12px;opacity:.7;margin-bottom:12px}
.guest-plan-pill{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);border-radius:20px;padding:5px 13px;font-size:12px;font-weight:600;color:#fff}
.lawn-profile-card{background:var(--card);border-radius:var(--r);padding:18px;box-shadow:var(--sh);margin-bottom:14px}
.lawn-profile-title{font-size:13px;font-weight:700;color:var(--text);margin-bottom:14px;display:flex;align-items:center;justify-content:space-between}
.lawn-profile-edit{font-size:12px;color:var(--sage);font-weight:600;cursor:pointer;text-decoration:underline}
.lawn-detail-row{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--tan)}
.lawn-detail-row:last-child{border-bottom:none}
.lawn-detail-icon{font-size:18px;flex-shrink:0;width:28px;text-align:center}
.lawn-detail-label{font-size:12px;color:var(--muted);flex:1}
.lawn-detail-value{font-size:13px;font-weight:600;color:var(--text)}
.free-perks{background:var(--cream);border-radius:var(--r);padding:16px;margin-bottom:14px;border:1.5px solid var(--tan)}
.free-perks-title{font-size:12px;font-weight:700;color:var(--brown);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
.perk-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.perk-check{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0}
.perk-check.yes{background:var(--sage-xl);color:var(--sage-d)}
.perk-check.no{background:#f0e8e8;color:#aa5050}
.perk-text{font-size:13px;color:var(--text)}
.perk-text.locked{color:var(--muted)}
.signup-cta-card{background:linear-gradient(135deg,#1e3a1e,#3a6a3a);border-radius:var(--r);padding:20px;margin-bottom:14px;text-align:center}
.signup-cta-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#fff;margin-bottom:6px}
.signup-cta-sub{font-size:13px;color:rgba(255,255,255,.72);margin-bottom:16px;line-height:1.5}
.signup-cta-btn{background:#a8e06a;color:#1e3a1e;border:none;border-radius:30px;padding:11px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;display:inline-block}
.signup-cta-note{font-size:11px;color:rgba(255,255,255,.5);margin-top:10px}
/* ── Report detail view ── */
.report-detail-header{display:flex;align-items:center;gap:12px;margin-bottom:20px}
.report-detail-back{background:var(--cream);border:1.5px solid var(--tan);border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;flex-shrink:0;transition:background .15s}
.report-detail-back:hover{background:var(--tan)}
.report-detail-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--text)}
.report-detail-date{font-size:12px;color:var(--muted);margin-top:2px}
/* ── Referral system ── */
.referral-card{background:linear-gradient(135deg,#1e3a1e,#3a6a3a);border-radius:var(--r);padding:20px;margin-bottom:14px;color:#fff}
.referral-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#fff;margin-bottom:6px}
.referral-sub{font-size:13px;color:rgba(255,255,255,.72);line-height:1.5;margin-bottom:16px}
.referral-link-box{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:var(--rs);padding:12px 14px;display:flex;align-items:center;gap:10px;margin-bottom:14px}
.referral-link-text{font-size:12px;color:rgba(255,255,255,.9);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace}
.referral-copy-btn{background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:20px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;flex-shrink:0;transition:background .15s}
.referral-copy-btn:hover{background:rgba(255,255,255,.3)}
.referral-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.referral-stat{background:rgba(255,255,255,.1);border-radius:var(--rs);padding:12px;text-align:center}
.referral-stat-num{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#a8e06a}
.referral-stat-label{font-size:10px;color:rgba(255,255,255,.65);margin-top:3px}
/* ── Notification permission banner ── */
.notif-banner{background:linear-gradient(135deg,#e8f4e8,#f0f8e8);border:1.5px solid var(--sage-xl);border-radius:var(--r);padding:14px 16px;margin-bottom:16px;display:flex;align-items:center;gap:12px}
.notif-banner-text{flex:1}
.notif-banner-title{font-size:13px;font-weight:700;color:var(--sage-d);margin-bottom:2px}
.notif-banner-sub{font-size:12px;color:var(--muted)}
.notif-enable-btn{background:var(--sage);color:#fff;border:none;border-radius:20px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;flex-shrink:0}
/* ── Email confirmation screen ── */
.confirm-screen{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 28px}
.confirm-icon{font-size:56px;margin-bottom:16px}
.confirm-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:var(--text);margin-bottom:10px}
.confirm-sub{font-size:15px;color:var(--muted);line-height:1.6;margin-bottom:28px;max-width:300px}
.confirm-email{font-weight:700;color:var(--sage-d)}
/* ── Password reset ── */
.reset-success{background:#e8f8e8;border:1px solid #b0d8b0;border-radius:var(--rs);padding:14px;font-size:13px;color:#3a6a3a;margin-bottom:16px;line-height:1.5;text-align:center}
/* ── Email capture (landing page pill) ── */
.email-capture{display:flex;gap:0;max-width:420px;margin:0 auto}
.email-capture-input{flex:1;padding:14px 18px;border:2px solid var(--tan);border-right:none;border-radius:50px 0 0 50px;font-size:14px;font-family:'DM Sans',sans-serif;background:var(--warm);color:var(--text);outline:none;transition:border-color .2s}
.email-capture-input:focus{border-color:var(--sage-l)}
.email-capture-btn{background:var(--sage-d);color:#fff;border:none;border-radius:0 50px 50px 0;padding:14px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:background .15s}
.email-capture-btn:hover{background:var(--sage)}
/* ── Social sharing ── */
.share-btn{width:100%;padding:14px;border-radius:50px;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;border:none;background:linear-gradient(135deg,var(--sage-d),var(--sage));color:#fff;transition:all .2s;margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 16px rgba(58,90,58,.25)}
.share-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(58,90,58,.35)}
.share-modal-preview{border-radius:var(--r);overflow:hidden;margin-bottom:16px;box-shadow:var(--shl)}
.share-modal-preview canvas{width:100%;display:block}
.share-platform-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.share-platform-btn{padding:12px;border-radius:var(--rs);border:1.5px solid var(--tan);background:var(--warm);cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;transition:border-color .15s,background .15s;font-family:'DM Sans',sans-serif}
.share-platform-btn:hover{border-color:var(--sage-l);background:var(--cream)}
.share-platform-icon{font-size:24px}
.share-platform-name{font-size:12px;font-weight:700;color:var(--text)}
.share-caption-box{background:var(--cream);border-radius:var(--rs);padding:12px 14px;margin-bottom:14px;font-size:13px;color:var(--text);line-height:1.55;border:1.5px solid var(--tan);position:relative}
.share-caption-copy{position:absolute;top:8px;right:8px;background:var(--sage);color:#fff;border:none;border-radius:20px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif}
.share-native-btn{width:100%;padding:14px;border-radius:50px;font-size:15px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;border:none;background:#a8e06a;color:#1e3a1e;margin-bottom:10px;transition:all .2s}
.share-native-btn:hover{background:#c8f080}
@media print{.tab-bar,.nav,.chat-input-wrap,.save-btn,.bs,.modal-overlay{display:none!important}.app{box-shadow:none;max-width:100%}.screen{padding:20px}body{background:#fff}}
`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const FREE_LIMIT=3;
const GRASS=["Bermuda","Zoysia","Kentucky Bluegrass","St. Augustine","Fescue","Ryegrass","Centipede","Bahia","Detect it for me 🔍"];
const REGIONS=["Northeast US","Southeast US","Midwest US","Southwest US","Pacific Northwest","California","Mountain West","UK/Europe","Australia","Other"];
const TREATMENTS=["Watered recently","Fertilized","Aerated","Overseeded","Mowed short","Applied pesticide","Nothing recently"];
const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const SEASONAL={"Northeast US":{season:"Spring",emoji:"🌸",tips:["Apply pre-emergent herbicide to stop crabgrass early.","Begin mowing once grass hits 3–4 inches.","Core aerate to relieve winter frost compaction.","Start a balanced 10-10-10 fertilizer program."]},"Southeast US":{season:"Summer",emoji:"☀️",tips:["Water 2–3× per week before 10 AM.","Mow warm-season grass at proper height for heat.","Scout for chinch bugs and treat within 48 hours.","Apply slow-release fertilizer for sustained feeding."]},"Midwest US":{season:"Fall",emoji:"🍂",tips:["Overseed bare patches before first frost.","Reduce mowing frequency as growth slows.","Apply winterizer fertilizer high in potassium.","Rake leaves promptly to prevent smothering."]},"California":{season:"Dry Season",emoji:"🌵",tips:["Deep-water once or twice weekly for deep roots.","Raise mowing height to shade roots.","Check for grub damage near brown patches.","Hold off on fertilizing during drought stress."]},default:{season:"Spring",emoji:"🌱",tips:["Begin regular watering as temperatures rise.","Assess lawn for bare or patchy areas.","Dethatch if thatch layer exceeds ½ inch.","Start a seasonal fertilization schedule."]}};
const OWM_KEY="285dd438d175f098e92feef30eb00c7e";

// Region → city mapping for OpenWeatherMap
const REGION_CITIES={
  "Northeast US":"Boston,US","Southeast US":"Atlanta,US","Midwest US":"Chicago,US",
  "Southwest US":"Phoenix,US","Pacific Northwest":"Seattle,US","California":"Los Angeles,US",
  "Mountain West":"Denver,US","UK/Europe":"London,GB","Australia":"Sydney,AU","Other":"New York,US"
};

// Fallback static weather (used while loading or if API fails)
const WEATHER_FALLBACK={icon:"🌤️",temp:"--°F",desc:"Loading weather…",humidity:"--%",lawn:"Checking conditions…",loading:true};

function owmIconToEmoji(icon=""){
  if(icon.startsWith("01"))return"☀️";
  if(icon.startsWith("02"))return"🌤️";
  if(icon.startsWith("03")||icon.startsWith("04"))return"☁️";
  if(icon.startsWith("09")||icon.startsWith("10"))return"🌧️";
  if(icon.startsWith("11"))return"⛈️";
  if(icon.startsWith("13"))return"❄️";
  if(icon.startsWith("50"))return"🌫️";
  return"🌤️";
}

function getLawnAdvice(temp,humidity,desc){
  const d=desc.toLowerCase();
  if(d.includes("rain")||d.includes("drizzle")||d.includes("shower"))return"Skip watering today 🌧️";
  if(d.includes("thunder"))return"Stay inside — storm incoming ⛈️";
  if(d.includes("snow"))return"Protect lawn from frost ❄️";
  if(temp>95)return"Water deeply this morning ☀️";
  if(temp>85)return"Water before 10 AM today";
  if(temp<35)return"Frost risk — avoid mowing ❄️";
  if(humidity>80)return"Good moisture — hold off watering";
  if(humidity<30)return"Very dry — water deeply today";
  return"Good lawn care conditions 🌿";
}

async function fetchWeather(region){
  const city=REGION_CITIES[region]||REGION_CITIES["Other"];
  const url=`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OWM_KEY}&units=imperial`;
  const r=await fetch(url);
  if(!r.ok)throw new Error("Weather fetch failed");
  const d=await r.json();
  const temp=Math.round(d.main.temp);
  const humidity=d.main.humidity;
  const desc=d.weather[0].description.charAt(0).toUpperCase()+d.weather[0].description.slice(1);
  const icon=owmIconToEmoji(d.weather[0].icon);
  const feelsLike=Math.round(d.main.feels_like);
  const wind=Math.round(d.wind.speed);
  return{
    icon,
    temp:`${temp}°F`,
    feelsLike:`${feelsLike}°F`,
    desc,
    humidity:`${humidity}%`,
    wind:`${wind} mph`,
    lawn:getLawnAdvice(temp,humidity,desc),
    city:d.name,
    loading:false
  };
}
const PRODUCTS=[
  {emoji:"🌿",name:"Scotts Turf Builder",why:"Boosts nitrogen for a deeper, lasting green",price:null,tag:"nitrogen",sponsored:true,url:"https://amzn.to/4txdODr"},
  {emoji:"💧",name:"Miracle-Gro Water Crystals",why:"Retains soil moisture during dry spells",price:null,tag:"moisture",sponsored:false},
  {emoji:"🪲",name:"BioAdvanced Grub Control",why:"Treats insect damage and prevents re-infestation",price:null,tag:"pests",sponsored:false},
  {emoji:"🌱",name:"Pennington Bare Spot Repair",why:"Fast-germinating seed blend for bare patches",price:null,tag:"patches",sponsored:false,url:"https://amzn.to/3QlGoJq"},
  {emoji:"🔬",name:"Luster Leaf Soil Test Kit",why:"Diagnose exact pH and nutrient levels fast",price:null,tag:"soil",sponsored:false,url:"https://amzn.to/4bVUIkk"},
  {emoji:"✂️",name:"Fiskars Reel Mower",why:"Clean, precise cuts reduce grass blade stress",price:null,tag:"mowing",sponsored:false},
];
const FEATURED_PARTNERS={nitrogen:{brand:"Scotts",emoji:"🌿",tagline:"America's #1 Lawn Brand",offer:"15% off Turf Builder — LawnPro exclusive",desc:"Scotts Turf Builder strengthens grass roots and feeds for up to 6 weeks. Recommended for nitrogen-deficient lawns.",cta:"Shop Scotts Deal",url:"https://amzn.to/4txdODr"},moisture:{brand:"Orbit",emoji:"💧",tagline:"Smart Watering Solutions",offer:"Free smart timer with any sprinkler kit",desc:"Orbit's B-hyve smart irrigation system adjusts to weather automatically — saving up to 50% on water.",cta:"Get the Smart Bundle",url:"https://amzn.to/4mb5oiF"},default:{brand:"Sunday",emoji:"🌱",tagline:"Personalized Lawn Care, Delivered",offer:"Free lawn analysis kit with first order",desc:"Sunday builds a custom lawn plan from your soil type and climate — natural, kid-safe ingredients delivered seasonally.",cta:"Claim Free Kit",url:""}};
const BRAND_PARTNERS=[{emoji:"🌿",name:"Scotts",sponsored:true},{emoji:"💧",name:"Orbit",sponsored:true},{emoji:"🌱",name:"Sunday",sponsored:true},{emoji:"🪲",name:"BioAdvanced",sponsored:false},{emoji:"✂️",name:"Fiskars",sponsored:false}];
const BENCHMARKS={"Northeast US":[{label:"Your lawn",yours:true},{label:"Neighborhood avg",score:64},{label:"Regional top",score:88}],default:[{label:"Your lawn",yours:true},{label:"Neighborhood avg",score:61},{label:"Regional top",score:85}]};
const STARTERS=["What fertilizer should I use?","Why is my grass turning yellow?","How often should I water?","When should I aerate?","My lawn has bare patches — help!"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const scoreColor=s=>s>=75?"#3a8a3a":s>=50?"#b87a00":"#cc3030";
const scoreLabel=s=>s>=80?"Excellent":s>=65?"Good":s>=45?"Fair":"Needs Attention";
const scoreClass=s=>s>=65?"sg":s>=45?"sf":"sp";
const fmtDate=d=>new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const initials=email=>email?email[0].toUpperCase():"?";

// ─── SUPABASE API ─────────────────────────────────────────────────────────────
const sbHeaders=(token)=>({
  "apikey":SB_KEY,
  "Content-Type":"application/json",
  ...(token?{"Authorization":`Bearer ${token}`}:{})
});

async function sbSignUp(email,password,name){
  const r=await fetch(`${SB_URL}/auth/v1/signup`,{method:"POST",headers:sbHeaders(),"body":JSON.stringify({email,password,data:{name}})});
  return r.json();
}
async function sbSignIn(email,password){
  const r=await fetch(`${SB_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:sbHeaders(),body:JSON.stringify({email,password})});
  return r.json();
}
async function sbSignOut(token){
  await fetch(`${SB_URL}/auth/v1/logout`,{method:"POST",headers:sbHeaders(token)});
}
async function sbGetProfile(userId,token){
  const r=await fetch(`${SB_URL}/rest/v1/profiles?id=eq.${userId}&select=*`,{headers:{...sbHeaders(token),"Accept":"application/json"}});
  const data=await r.json();
  return Array.isArray(data)?data[0]:null;
}
async function sbUpsertProfile(userId,email,name,token){
  await fetch(`${SB_URL}/rest/v1/profiles`,{method:"POST",headers:{...sbHeaders(token),"Prefer":"resolution=merge-duplicates"},body:JSON.stringify({id:userId,email,name:name||email.split("@")[0],plan:"free"})});
}
async function sbUpdatePlan(userId,plan,token){
  await fetch(`${SB_URL}/rest/v1/profiles?id=eq.${userId}`,{method:"PATCH",headers:sbHeaders(token),body:JSON.stringify({plan})});
}
async function sbFetchReports(userId,token){
  const r=await fetch(`${SB_URL}/rest/v1/reports?user_id=eq.${userId}&order=created_at.desc&select=*`,{headers:{...sbHeaders(token),"Accept":"application/json"}});
  return r.json();
}
async function sbSaveReport(userId,report,token){
  const payload={user_id:userId,score:report.score,status:report.status,summary:report.summary,grass_type:report.detected_grass||report.grassType||"Unknown",region:report.region||"",data:JSON.stringify(report)};
  await fetch(`${SB_URL}/rest/v1/reports`,{method:"POST",headers:{...sbHeaders(token),"Prefer":"return=minimal"},body:JSON.stringify(payload)});
}
async function sbRequestPasswordReset(email){
  const r=await fetch(`${SB_URL}/auth/v1/recover`,{method:"POST",headers:sbHeaders(),body:JSON.stringify({email})});
  return r.json();
}
async function sbUpdatePassword(newPassword,token){
  const r=await fetch(`${SB_URL}/auth/v1/user`,{method:"PUT",headers:sbHeaders(token),body:JSON.stringify({password:newPassword})});
  return r.json();
}
async function sbSaveReferral(referrerId,referredEmail,token){
  await fetch(`${SB_URL}/rest/v1/referrals`,{method:"POST",headers:{...sbHeaders(token),"Prefer":"return=minimal"},body:JSON.stringify({referrer_id:referrerId,referred_email:referredEmail,status:"pending"})});
}
async function sbFetchReferrals(userId,token){
  const r=await fetch(`${SB_URL}/rest/v1/referrals?referrer_id=eq.${userId}&select=*`,{headers:{...sbHeaders(token),"Accept":"application/json"}});
  return r.json();
}

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function callClaude(messages,system=""){
  const body={model:"claude-sonnet-4-20250514",max_tokens:1000,messages};
  if(system)body.system=system;
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const d=await r.json();
  return d.content?.map(b=>b.text||"").join("")||"";
}
async function analyzeLawn({imageBase64,grassType,region,treatments,notes,lawnProfile={}}){
  const profileCtx=[
    lawnProfile.soilType&&`Soil type: ${lawnProfile.soilType}`,
    lawnProfile.sunExposure&&`Sun exposure: ${lawnProfile.sunExposure}`,
    lawnProfile.lawnSize&&`Lawn size: ${lawnProfile.lawnSize}`,
  ].filter(Boolean).join(", ");
  const prompt=`You are LawnPro's expert lawn health AI. Analyze this lawn photo.
Details: Grass: ${grassType||"Unknown — detect it"}, Region: ${region||"Unknown"}, Treatments: ${treatments.length?treatments.join(", "):"None"}, Notes: ${notes||"None"}${profileCtx?`, ${profileCtx}`:""}
Use all provided lawn profile details to give more accurate, personalized recommendations.
Respond ONLY with valid JSON (no markdown):
{"score":<0-100>,"status":"Excellent|Good|Fair|Needs Attention","summary":"<2 sentences>","detected_grass":"<type>","grass_confidence":"high|medium|low","scientific":{"color_health":<0-100>,"color_health_note":"<note>","coverage":<0-100>,"coverage_note":"<note>","moisture":<0-100>,"moisture_note":"<note>","nutrient_status":"<brief>","soil_condition":"<brief>","issues_detected":["<issue>"]},"simple_advice":["<tip with <strong> tags>","<tip>","<tip>","<tip>"],"product_tags":["nitrogen|moisture|pests|patches|soil|mowing"],"weekly_plan":{"Monday":["<task>"],"Tuesday":["<task>"],"Wednesday":["<task>"],"Thursday":["<task>"],"Friday":["<task>"],"Saturday":["<task>","<task>"],"Sunday":["Rest — observe lawn for changes"]}}`;
  const text=await callClaude([{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imageBase64}},{type:"text",text:prompt}]}]);
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}
async function chatWithAssistant(messages,ctx){
  const system=`You are LawnPro Assistant, a friendly AI lawn care expert. Give practical, science-backed advice in a warm conversational tone.
${ctx?`User's latest lawn: score ${ctx.score}/100 (${ctx.status}), grass: ${ctx.detected_grass||ctx.grassType||"Unknown"}, region: ${ctx.region||"Unknown"}, summary: ${ctx.summary}, issues: ${ctx.scientific?.issues_detected?.join(", ")||"none"}.`:"No analysis on file yet."}
Keep responses under 120 words. Be friendly, specific, actionable. You are an AI — not a human expert.`;
  return callClaude(messages,system);
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Toggle({on,onToggle}){return <button className={`toggle${on?" on":""}`} onClick={onToggle}><div className="toggle-thumb"/></button>}
function Toast({msg}){return <div className="toast">✓ {msg}</div>}

function AuthModal({onClose,onSuccess,referralCode=""}){
  const [mode,setMode]=useState("signin"); // signin | signup | forgot | reset_sent | confirmed
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [resetSent,setResetSent]=useState(false);

  async function handleSubmit(){
    if(mode==="forgot"){
      if(!email){setErr("Enter your email address.");return;}
      setLoading(true);setErr("");
      const res=await sbRequestPasswordReset(email);
      setLoading(false);
      if(res.error){setErr(res.error.message||"Could not send reset email.");return;}
      setResetSent(true);setMode("reset_sent");
      return;
    }
    if(!email||!password){setErr("Please fill in all fields.");return;}
    if(password.length<6){setErr("Password must be at least 6 characters.");return;}
    setLoading(true);setErr("");
    try{
      if(mode==="signup"){
        const res=await sbSignUp(email,password,name);
        if(res.error){setErr(res.error.message||"Sign up failed.");setLoading(false);return;}
        // Check if email confirmation is required
        if(res.user&&!res.session){
          // Supabase requires email confirmation
          setMode("confirmed");setLoading(false);return;
        }
        // Auto sign in after signup (email confirmation disabled)
        const login=await sbSignIn(email,password);
        if(login.error){setMode("confirmed");setLoading(false);return;}
        await sbUpsertProfile(login.user.id,email,name,login.access_token);
        onSuccess({...login.user,access_token:login.access_token,name:name||email.split("@")[0],referralCode});
      } else {
        const res=await sbSignIn(email,password);
        if(res.error){
          if(res.error.message?.includes("Email not confirmed")){
            setErr("Please confirm your email first. Check your inbox for a verification link.");
          } else {
            setErr(res.error.message||"Sign in failed. Check your email and password.");
          }
          setLoading(false);return;
        }
        onSuccess({...res.user,access_token:res.access_token,name:res.user?.user_metadata?.name||email.split("@")[0]});
      }
    }catch(e){setErr("Connection error. Please try again.");}
    setLoading(false);
  }

  if(mode==="confirmed") return(
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="modal-sheet">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-handle"/>
        <div className="confirm-screen">
          <div className="confirm-icon">📬</div>
          <div className="confirm-title">Check your inbox!</div>
          <div className="confirm-sub">We sent a confirmation link to <span className="confirm-email">{email}</span>. Click it to activate your account, then sign in here.</div>
          <button className="bp" onClick={()=>setMode("signin")}>Go to Sign In →</button>
          <div style={{marginTop:14,fontSize:12,color:"var(--muted)"}}>Didn't get it? Check your spam folder or <span style={{color:"var(--sage)",cursor:"pointer",textDecoration:"underline"}} onClick={async()=>{await sbSignUp(email,password,name);showToast?.("Resent confirmation email");}}>resend</span></div>
        </div>
      </div>
    </div>
  );

  if(mode==="reset_sent") return(
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="modal-sheet">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-handle"/>
        <div className="confirm-screen">
          <div className="confirm-icon">🔑</div>
          <div className="confirm-title">Reset link sent!</div>
          <div className="confirm-sub">We sent a password reset link to <span className="confirm-email">{email}</span>. Check your inbox and follow the link to set a new password.</div>
          <button className="bp" onClick={()=>setMode("signin")}>Back to Sign In →</button>
        </div>
      </div>
    </div>
  );

  return(
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="modal-sheet">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-handle"/>
        <div className="modal-content">
          {mode!=="forgot"&&(
            <div className="auth-tabs">
              <button className={`auth-tab${mode==="signin"?" active":""}`} onClick={()=>{setMode("signin");setErr("")}}>Sign In</button>
              <button className={`auth-tab${mode==="signup"?" active":""}`} onClick={()=>{setMode("signup");setErr("")}}>Create Account</button>
            </div>
          )}
          <div className="auth-title">{mode==="signin"?"Welcome back":mode==="signup"?"Join LawnPro":"Reset your password"}</div>
          <div className="auth-sub">
            {mode==="signin"?"Sign in to access your reports and settings.":mode==="signup"?"Create your free account to save reports and track progress.":"Enter your email and we'll send a reset link."}
          </div>
          {err&&<div className="auth-err">{err}</div>}
          {mode==="signup"&&(
            <div className="form-group">
              <label className="ilabel">Your name</label>
              <input className="ifield" placeholder="e.g. Alex" value={name} onChange={e=>setName(e.target.value)}/>
            </div>
          )}
          <div className="form-group">
            <label className="ilabel">Email address</label>
            <input className="ifield" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
          </div>
          {mode!=="forgot"&&(
            <div className="form-group">
              <label className="ilabel">Password</label>
              <input className="ifield" type="password" placeholder={mode==="signup"?"At least 6 characters":"Your password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            </div>
          )}
          {mode==="signin"&&(
            <div style={{textAlign:"right",marginBottom:16,marginTop:-8}}>
              <span style={{fontSize:12,color:"var(--sage)",cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setMode("forgot");setErr("")}}>Forgot password?</span>
            </div>
          )}
          <button className="bp" onClick={handleSubmit} disabled={loading}>
            {loading?"Please wait…":mode==="signin"?"Sign In →":mode==="signup"?"Create Free Account →":"Send Reset Link →"}
          </button>
          {mode==="signin"&&<span className="auth-link" onClick={()=>{setMode("signup");setErr("")}}>Don't have an account? Sign up free</span>}
          {mode==="signup"&&<span className="auth-link" onClick={()=>{setMode("signin");setErr("")}}>Already have an account? Sign in</span>}
          {mode==="forgot"&&<span className="auth-link" onClick={()=>{setMode("signin");setErr("")}}>← Back to sign in</span>}
        </div>
      </div>
    </div>
  );
}

function ProModal({onClose,onUpgrade}){
  return(
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="modal-sheet">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-handle"/>
        <div className="modal-content">
          <div className="pro-hdr">
            <div className="pro-crown">👑</div>
            <div className="pro-title">LawnPro Pro</div>
            <div className="pro-subtitle">Unlimited analyses, AI chat, weekly plans, and more.</div>
          </div>
          <div className="pro-price-card">
            <div className="pro-price">$7.99</div>
            <div className="pro-period">per month · cancel anytime</div>
            <div className="pro-save">7-day free trial</div>
          </div>
          <div className="pro-features">
            {[["Unlimited AI lawn analyses","Free tier is limited to 3/month"],["LawnPro Assistant","Unlimited AI chat with lawn context"],["7-day personalized care plans","Auto-generated from your analysis"],["Side-by-side report comparison","Track improvement over time"],["Live weather watering alerts","Tied to your local forecast"],["PDF export","Shareable reports for you or landscaper"],["Neighborhood benchmarking","See how you compare regionally"]].map(([t,s])=>(
              <div className="pro-feat" key={t}><div className="pro-check">✓</div><div className="pro-feat-txt"><strong>{t}</strong> — {s}</div></div>
            ))}
          </div>
          <button className="bp" onClick={onUpgrade}>Start Free 7-Day Trial →</button>
          <div style={{textAlign:"center",marginTop:10,fontSize:12,color:"var(--muted)"}}>Then $7.99/mo. No charge today.</div>
        </div>
      </div>
    </div>
  );
}

function ScoreChart({reports}){
  if(reports.length<2)return <div style={{textAlign:"center",padding:"20px 0",color:"var(--muted)",fontSize:13}}>Save 2+ reports to see your health trend 📈</div>;
  const recent=[...reports].reverse().slice(-7);
  const scores=recent.map(r=>r.score);
  const mn=Math.min(...scores)-10,mx=Math.max(...scores)+10;
  const W=300,H=80,p=10;
  const xi=i=>p+(i/(recent.length-1))*(W-p*2);
  const yi=s=>H-p-((s-mn)/(mx-mn||1))*(H-p*2);
  const path=recent.map((r,i)=>`${i===0?"M":"L"}${xi(i)},${yi(r.score)}`).join(" ");
  return(
    <div className="chart-wrap">
      <div className="chart-title"><span>📈 Health Score Trend</span><span style={{fontSize:12,color:"var(--muted)",fontWeight:400}}>{recent.length} reports</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",overflow:"visible"}}>
        <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--sage)" stopOpacity=".3"/><stop offset="100%" stopColor="var(--sage)" stopOpacity="0"/></linearGradient></defs>
        <path d={`${path} L${xi(recent.length-1)},${H} L${xi(0)},${H} Z`} fill="url(#cg)"/>
        <path d={path} stroke="var(--sage)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        {recent.map((r,i)=>(
          <g key={i}><circle cx={xi(i)} cy={yi(r.score)} r="4" fill="var(--sage)" stroke="var(--warm)" strokeWidth="2"/><text x={xi(i)} y={yi(r.score)-10} textAnchor="middle" fontSize="10" fill="var(--sage-d)" fontWeight="700">{r.score}</text></g>
        ))}
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
        {recent.map((r,i)=><div key={i} style={{fontSize:9,color:"var(--muted)",textAlign:"center"}}>{new Date(r.created_at||r.date).toLocaleDateString("en-US",{month:"numeric",day:"numeric"})}</div>)}
      </div>
    </div>
  );
}

function ComparePanel({reports}){
  const [a,setA]=useState(0);
  const [b,setB]=useState(Math.min(1,reports.length-1));
  if(reports.length<2)return null;
  const ra=reports[a],rb=reports[b];
  const getData=r=>{const d=r.data?JSON.parse(r.data):r;return d;};
  const metrics=[{l:"Score",va:ra.score,vb:rb.score},{l:"Color",va:getData(ra).scientific?.color_health,vb:getData(rb).scientific?.color_health},{l:"Coverage",va:getData(ra).scientific?.coverage,vb:getData(rb).scientific?.coverage},{l:"Moisture",va:getData(ra).scientific?.moisture,vb:getData(rb).scientific?.moisture}];
  return(
    <div className="compare-panel">
      <div className="rc-head"><span className="rc-icon">🔍</span><span className="rc-title">Side-by-Side Comparison</span><span className="badge b-pro">PRO</span></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {[{val:a,set:setA,label:"Report A"},{val:b,set:setB,label:"Report B"}].map(({val,set,label})=>(
          <div key={label}><div style={{fontSize:11,color:"var(--muted)",marginBottom:4,fontWeight:600}}>{label}</div>
          <select className="ifield" style={{padding:"8px 12px",fontSize:12}} value={val} onChange={e=>set(+e.target.value)}>
            {reports.map((r,i)=><option key={i} value={i}>{fmtDate(r.created_at||r.date)} · {r.score}</option>)}
          </select></div>
        ))}
      </div>
      <div className="compare-heads">
        {[{r:ra,cls:"a"},{r:rb,cls:"b"}].map(({r,cls})=>(
          <div key={cls} className={`cside ${cls}`}>
            <div className="cscore" style={{color:scoreColor(r.score)}}>{r.score}</div>
            <div className="cdate">{fmtDate(r.created_at||r.date)}</div>
            <div style={{fontSize:11,fontWeight:600,color:scoreColor(r.score)}}>{scoreLabel(r.score)}</div>
          </div>
        ))}
      </div>
      {metrics.map(({l,va,vb})=>{
        const d=(va||0)-(vb||0),mx=Math.max(va||0,vb||0)||1;
        return(
          <div className="crow" key={l}>
            <span className="clabel">{l}</span>
            <div className="cbar-wrap"><div className="cbar" style={{width:`${((va||0)/mx)*100}%`,background:"var(--sage)"}}/></div>
            <div className="cbar-wrap" style={{background:"rgba(200,150,10,.2)"}}><div className="cbar" style={{width:`${((vb||0)/mx)*100}%`,background:"var(--gold)"}}/></div>
            <span className={`cdelta ${d>0?"dp":d<0?"dn":"dn0"}`}>{d>0?"+":""}{d}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function LawnPro(){
  const [page,setPage]=useState("onboarding");
  const [tab,setTab]=useState("home");
  const [userInfo,setUserInfo]=useState({name:"",region:""});
  const [lawnProfile,setLawnProfile]=useState({grassType:"",soilType:"",sunExposure:"",lawnSize:""});

  // Auth state
  const [user,setUser]=useState(null);       // {id, email, access_token, name}
  const [profile,setProfile]=useState(null); // {plan: 'free'|'pro'}
  const [showAuth,setShowAuth]=useState(false);
  const [showPro,setShowPro]=useState(false);

  // Derived
  const isPro=profile?.plan==="pro";
  const isLoggedIn=!!user;

  // Usage (for non-logged-in free tier)
  const [usageCount,setUsageCount]=useState(0);

  // Upload
  const [imageB64,setImageB64]=useState(null);
  const [grassType,setGrassType]=useState("");
  const [treatments,setTreatments]=useState([]);
  const [notes,setNotes]=useState("");
  const [uploadView,setUploadView]=useState("form");
  const [loadStep,setLoadStep]=useState(0);
  const [result,setResult]=useState(null);
  const [resultSaved,setResultSaved]=useState(false);

  // Reports (cloud when logged in, local fallback)
  const [reports,setReports]=useState([]);
  const [reportsLoading,setReportsLoading]=useState(false);
  const [selectedReport,setSelectedReport]=useState(null); // for detail view

  // Notifications
  const [notifPermission,setNotifPermission]=useState(typeof Notification!=="undefined"?Notification.permission:"default");
  const [notifDismissed,setNotifDismissed]=useState(false);

  // Referrals
  const [referrals,setReferrals]=useState([]);
  const [referralCopied,setReferralCopied]=useState(false);

  // Reminders
  const [reminders,setReminders]=useState([
    {id:1,icon:"💧",name:"Watering Reminder",schedule:"Every 2 days, 7:00 AM",on:true},
    {id:2,icon:"✂️",name:"Mowing Alert",schedule:"Weekly, Saturday 9:00 AM",on:false},
    {id:3,icon:"🌿",name:"Fertilizing Reminder",schedule:"Every 6 weeks",on:true},
    {id:4,icon:"🔬",name:"Monthly Lawn Check",schedule:"1st of each month",on:false},
  ]);

  // Chat
  const [chatMsgs,setChatMsgs]=useState([{role:"assistant",content:"Hi! I'm your **LawnPro Assistant** 🌿 — an AI lawn care expert. Ask me anything about your lawn and I'll give you personalized, science-backed advice."}]);
  const [chatInput,setChatInput]=useState("");
  const [chatLoading,setChatLoading]=useState(false);

  // Affiliate
  const [affiliateStats,setAffiliateStats]=useState({clicks:0,sponsoredClicks:0,estEarnings:0});

  // Live weather
  const [weather,setWeather]=useState(WEATHER_FALLBACK);
  const [weatherLoading,setWeatherLoading]=useState(false);

  // Social sharing
  const [showShare,setShowShare]=useState(false);
  const [shareCardUrl,setShareCardUrl]=useState(null);
  const shareCanvasRef=useRef();

  const [toast,setToast]=useState("");
  const fileRef=useRef();
  const chatEndRef=useRef();

  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"})},[chatMsgs,chatLoading]);

  // Load persisted session & data
  useEffect(()=>{
    (async()=>{
      try{const u=await window.storage.get("lp_usage");if(u)setUsageCount(+u.value)}catch(e){}
      try{const a=await window.storage.get("lp_affiliate");if(a)setAffiliateStats(JSON.parse(a.value))}catch(e){}
      try{const lp=await window.storage.get("lp_lawn_profile");if(lp){const d=JSON.parse(lp.value);setLawnProfile({grassType:d.grassType||"",soilType:d.soilType||"",sunExposure:d.sunExposure||"",lawnSize:d.lawnSize||""});if(d.name)setUserInfo(p=>({...p,name:d.name}));if(d.region)setUserInfo(p=>({...p,region:d.region}));}}catch(e){}
      // Restore session
      try{
        const s=await window.storage.get("lp_session");
        if(s){
          const session=JSON.parse(s.value);
          setUser(session);
          // Load profile
          const prof=await sbGetProfile(session.id,session.access_token);
          if(prof)setProfile(prof);else setProfile({plan:"free"});
          // Load reports
          loadCloudReports(session.id,session.access_token);
        } else {
          // Load local reports
          try{const r=await window.storage.get("lp_reports");if(r)setReports(JSON.parse(r.value))}catch(e){}
        }
      }catch(e){}
      // Check for Stripe payment success redirect
      if(typeof window!=="undefined"&&window.location.search.includes("payment_success=true")){
        // Will handle after session loads
      }
    })();
  },[]);

  async function loadCloudReports(userId,token){
    setReportsLoading(true);
    try{
      const data=await sbFetchReports(userId,token);
      if(Array.isArray(data))setReports(data);
    }catch(e){}
    setReportsLoading(false);
  }

  async function loadWeather(region){
    if(!region)return;
    setWeatherLoading(true);
    try{
      const data=await fetchWeather(region);
      setWeather(data);
    }catch(e){
      setWeather({icon:"🌤️",temp:"--°F",desc:"Weather unavailable",humidity:"--%",wind:"-- mph",lawn:"Check your local forecast",city:"",loading:false});
    }
    setWeatherLoading(false);
  }

  useEffect(()=>{
    if(userInfo.region)loadWeather(userInfo.region);
  },[userInfo.region]);

  // Register service worker
  useEffect(()=>{
    if("serviceWorker" in navigator){
      navigator.serviceWorker.register("/sw.js")
        .then(()=>console.log("[LawnPro] SW registered"))
        .catch(()=>{});
    }
  },[]);

  function generateShareCard(report){
    return new Promise(resolve=>{
      const canvas=document.createElement("canvas");
      canvas.width=1080;canvas.height=1080;
      const ctx=canvas.getContext("2d");
      const score=report.score;
      const grass=report.detected_grass||report.grassType||"Lawn";
      const status=scoreLabel(score);
      // Background
      const grad=ctx.createLinearGradient(0,0,1080,1080);
      grad.addColorStop(0,"#1e3a1e");grad.addColorStop(.5,"#3a6a3a");grad.addColorStop(1,"#5a8a5a");
      ctx.fillStyle=grad;ctx.fillRect(0,0,1080,1080);
      // Grid
      ctx.strokeStyle="rgba(255,255,255,0.04)";ctx.lineWidth=1;
      for(let i=0;i<1080;i+=60){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,1080);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(1080,i);ctx.stroke();}
      // Circle
      const cx=540,cy=460,cr=240;
      ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fillStyle="rgba(255,255,255,0.08)";ctx.fill();
      // Score arc
      ctx.beginPath();ctx.arc(cx,cy,cr-16,-Math.PI/2,-Math.PI/2+(score/100)*Math.PI*2);ctx.strokeStyle="#a8e06a";ctx.lineWidth=28;ctx.lineCap="round";ctx.stroke();
      // Track
      ctx.beginPath();ctx.arc(cx,cy,cr-16,-Math.PI/2+(score/100)*Math.PI*2,-Math.PI/2+Math.PI*2);ctx.strokeStyle="rgba(255,255,255,0.1)";ctx.lineWidth=28;ctx.stroke();
      // Score number
      ctx.fillStyle="#fff";ctx.font="bold 160px serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(score,cx,cy-20);
      ctx.fillStyle="rgba(255,255,255,0.5)";ctx.font="44px sans-serif";ctx.fillText("/100",cx,cy+80);
      // Status badge
      const bW=260,bH=56,bX=cx-bW/2,bY=cy+120;
      ctx.beginPath();ctx.roundRect(bX,bY,bW,bH,28);ctx.fillStyle="#a8e06a";ctx.fill();
      ctx.fillStyle="#1e3a1e";ctx.font="bold 28px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(status,cx,bY+bH/2);
      // Grass type
      ctx.fillStyle="rgba(255,255,255,0.75)";ctx.font="32px sans-serif";ctx.fillText(grass,cx,bY+bH+50);
      // Branding
      ctx.fillStyle="rgba(255,255,255,0.9)";ctx.font="bold 48px serif";ctx.fillText("LawnPro",cx,80);
      ctx.fillStyle="rgba(168,224,106,0.9)";ctx.font="26px sans-serif";ctx.fillText("AI Lawn Health Score",cx,130);
      ctx.fillStyle="rgba(255,255,255,0.5)";ctx.font="28px sans-serif";ctx.fillText("lawnproapp.com",cx,1020);
      // Leaf decorations
      ctx.font="120px serif";ctx.globalAlpha=0.07;ctx.fillStyle="#fff";
      ctx.textAlign="left";ctx.textBaseline="alphabetic";ctx.fillText("🌿",40,200);
      ctx.textAlign="right";ctx.fillText("🍃",1040,900);ctx.globalAlpha=1;
      resolve(canvas.toDataURL("image/png"));
    });
  }

  async function handleShare(){
    if(!result)return;
    const cardUrl=await generateShareCard(result);
    setShareCardUrl(cardUrl);
    setShowShare(true);
  }

  async function shareNative(){
    if(!shareCardUrl)return;
    try{
      const blob=await(await fetch(shareCardUrl)).blob();
      const file=new File([blob],"lawnpro-score.png",{type:"image/png"});
      if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
        await navigator.share({title:"My LawnPro Health Score",text:`My lawn scored ${result.score}/100 on LawnPro! 🌿 Try it free at lawnproapp.com`,files:[file]});
        showToast("Shared successfully! 🎉");
      } else {
        const a=document.createElement("a");a.href=shareCardUrl;a.download="lawnpro-score.png";a.click();
        showToast("Image saved — share it anywhere! 🌿");
      }
    }catch(e){if(e.name!=="AbortError")showToast("Image saved!");}
  }

  async function copyShareCaption(platform){
    const c={
      instagram:`My lawn just scored ${result.score}/100 on LawnPro 🌿 The AI detected ${result.scientific?.issues_detected?.[0]||"areas to improve"} and gave me a full care plan. Try it free → lawnproapp.com #LawnCare #LawnPro #GreenGrass`,
      twitter:`Just ran my lawn through LawnPro's AI analysis 🌿\n\nScore: ${result.score}/100 — ${scoreLabel(result.score)}\n\nDetected my grass type, found issues, and built me a 7-day care plan.\n\nFree to try → lawnproapp.com`,
      facebook:`I just discovered LawnPro — it uses AI to analyze your lawn from a single photo! My lawn scored ${result.score}/100. It found ${result.scientific?.issues_detected?.[0]||"things I didn't know about"} and gave me specific tips to fix it. Try it free at lawnproapp.com 🌿`,
    };
    try{await navigator.clipboard.writeText(c[platform]||c.instagram);showToast("Caption copied! Paste it with your photo 📋");}
    catch(e){showToast("Copy failed — try manually");}
  }

  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2800)};
  const requirePro=fn=>{if(isPro)fn();else setShowPro(true)};
  const requireAuth=fn=>{if(isLoggedIn)fn();else setShowAuth(true)};

  async function handleAuthSuccess(userData){
    setUser(userData);
    window.storage?.set("lp_session",JSON.stringify(userData));
    setShowAuth(false);
    // Load profile
    let prof=await sbGetProfile(userData.id,userData.access_token);
    if(!prof){
      await sbUpsertProfile(userData.id,userData.email,userData.name,userData.access_token);
      prof={plan:"free",email:userData.email,name:userData.name};
    }
    setProfile(prof);
    // Load cloud reports
    loadCloudReports(userData.id,userData.access_token);
    loadReferrals();
    showToast(`Welcome back, ${userData.name||userData.email.split("@")[0]}! 👋`);
  }

  async function handleSignOut(){
    if(user)await sbSignOut(user.access_token);
    setUser(null);setProfile(null);
    window.storage?.set("lp_session","");
    // Fall back to local reports
    try{const r=await window.storage.get("lp_reports");if(r)setReports(JSON.parse(r.value));else setReports([])}catch(e){setReports([])}
    showToast("Signed out successfully");
    setTab("home");
  }

  function handleUpgrade(){
    if(STRIPE_PAYMENT_LINK){
      window.open(STRIPE_PAYMENT_LINK,"_blank");
      showToast("Opening secure checkout…");
    } else {
      if(user){sbUpdatePlan(user.id,"pro",user.access_token);setProfile(p=>({...p,plan:"pro"}));showToast("Pro activated! 🎉");}
      else setShowAuth(true);
    }
    setShowPro(false);
  }

  async function requestNotifications(){
    if(typeof Notification==="undefined"){showToast("Notifications not supported in this browser");return;}
    const permission=await Notification.requestPermission();
    setNotifPermission(permission);
    if(permission==="granted"){
      showToast("Reminders enabled! 🔔");
      setTimeout(()=>{try{new Notification("LawnPro 🌿",{body:"Notifications enabled — we'll remind you to care for your lawn!"});}catch(e){}},1500);
    } else {
      setNotifDismissed(true);
      showToast("Enable notifications in your browser settings anytime");
    }
  }

  function fireReminder(reminder){
    if(typeof Notification!=="undefined"&&Notification.permission==="granted"){
      try{new Notification(`LawnPro: ${reminder.name} 🌿`,{body:reminder.schedule});}catch(e){}
    }
  }

  function getReferralLink(){
    const base=typeof window!=="undefined"?window.location.origin:"https://lawnproapp.com";
    return `${base}?ref=${user?.id?.slice(0,8)||"guest"}`;
  }

  async function copyReferralLink(){
    const link=getReferralLink();
    try{await navigator.clipboard.writeText(link);setReferralCopied(true);showToast("Referral link copied! 🎉");setTimeout(()=>setReferralCopied(false),3000);}
    catch(e){showToast("Your link: "+link);}
  }

  async function loadReferrals(){
    if(!user)return;
    try{const data=await sbFetchReferrals(user.id,user.access_token);if(Array.isArray(data))setReferrals(data);}catch(e){}
  }

  function handleProductClick(product,isSponsored=false){
    const earn=isSponsored?2.40:0.90;
    const updated={clicks:affiliateStats.clicks+1,sponsoredClicks:affiliateStats.sponsoredClicks+(isSponsored?1:0),estEarnings:Math.round((affiliateStats.estEarnings+earn)*100)/100};
    setAffiliateStats(updated);
    window.storage?.set("lp_affiliate",JSON.stringify(updated));
    if(product.url)window.open(product.url,"_blank");
    showToast(isSponsored?`Opening ${product.brand||product.name}… Sponsored`:`Opening ${product.name}… Affiliate link`);
  }

  function handleFile(e){
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>setImageB64(ev.target.result.split(",")[1]);
    reader.readAsDataURL(file);
  }

  async function handleAnalyze(){
    if(!imageB64)return;
    const canAnalyze=isPro||usageCount<FREE_LIMIT;
    if(!canAnalyze){setShowPro(true);return;}
    setUploadView("loading");setLoadStep(0);
    const t1=setTimeout(()=>setLoadStep(1),1300);
    const t2=setTimeout(()=>setLoadStep(2),2600);
    const t3=setTimeout(()=>setLoadStep(3),3800);
    try{
      const analysis=await analyzeLawn({imageBase64:imageB64,grassType:grassType||lawnProfile.grassType,region:userInfo.region,treatments,notes,lawnProfile});
      clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);
      if(!isPro){const nu=usageCount+1;setUsageCount(nu);window.storage?.set("lp_usage",String(nu));}
      setLoadStep(4);
      setTimeout(()=>{
        setResult({...analysis,imageBase64:imageB64,date:new Date().toISOString(),grassType,region:userInfo.region});
        setResultSaved(false);setUploadView("result");
      },500);
    }catch(err){
      clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);
      if(!isPro){const nu=usageCount+1;setUsageCount(nu);window.storage?.set("lp_usage",String(nu));}
      setResult({score:64,status:"Fair",detected_grass:grassType||"Bermuda",grass_confidence:"medium",summary:"Your lawn shows moderate health with some improvement opportunities. Color appears slightly pale and moisture distribution is uneven.",scientific:{color_health:58,color_health_note:"Slightly pale, possible nitrogen deficiency",coverage:75,coverage_note:"Some bare patches visible",moisture:50,moisture_note:"Dry in sections",nutrient_status:"Low nitrogen, adequate phosphorus",soil_condition:"Likely compacted — consider aerating",issues_detected:["Dry stress","Bare patches","Light weed presence"]},simple_advice:["<strong>Water more consistently</strong> — aim for 1–1.5 inches per week before 10 AM.","<strong>Apply nitrogen fertilizer</strong> to restore green color over 2–3 weeks.","<strong>Overseed bare patches</strong> with matching grass seed — keep moist.","<strong>Aerate the soil</strong> if it feels hard — helps nutrients reach roots."],product_tags:["nitrogen","moisture","patches"],weekly_plan:{Monday:["Water deeply 20–25 mins"],Tuesday:["Inspect for weeds, hand-pull any found"],Wednesday:["Apply fertilizer if soil is dry enough"],Thursday:["Rest — observe lawn"],Friday:["Water lightly if no rain"],Saturday:["Mow at proper height","Spot-treat visible weeds"],Sunday:["Rest — observe lawn for changes"]},imageBase64:imageB64,date:new Date().toISOString(),grassType,region:userInfo.region});
      setResultSaved(false);setUploadView("result");
    }
  }

  async function saveReport(){
    if(!result||resultSaved)return;
    if(isLoggedIn&&user){
      // Save to Supabase cloud
      try{
        await sbSaveReport(user.id,result,user.access_token);
        await loadCloudReports(user.id,user.access_token);
        setResultSaved(true);
        showToast("Report saved to cloud ☁️");
      }catch(e){showToast("Save failed — check connection");}
    } else {
      // Save locally
      const newReports=[result,...reports];
      setReports(newReports);
      window.storage?.set("lp_reports",JSON.stringify(newReports));
      setResultSaved(true);
      showToast("Report saved locally");
    }
  }

  function resetUpload(){setImageB64(null);setGrassType("");setTreatments([]);setNotes("");setResult(null);setResultSaved(false);setUploadView("form")}

  async function handleChat(msgText){
    const text=msgText||chatInput.trim();
    if(!text||chatLoading)return;
    setChatInput("");
    const userMsg={role:"user",content:text};
    const newMsgs=[...chatMsgs,userMsg];
    setChatMsgs(newMsgs);setChatLoading(true);
    try{
      const reply=await chatWithAssistant(newMsgs.map(m=>({role:m.role,content:m.content})),reports[0]);
      setChatMsgs(p=>[...p,{role:"assistant",content:reply}]);
    }catch(e){setChatMsgs(p=>[...p,{role:"assistant",content:"Sorry, I had trouble connecting. Please try again!"}]);}
    setChatLoading(false);
  }

  const season=(SEASONAL[userInfo.region]||SEASONAL.default);
  const latestCtx=result||reports[0];
  const parsedLatest=latestCtx?.data?JSON.parse(latestCtx.data):latestCtx;
  const productRecs=parsedLatest?.product_tags?PRODUCTS.filter(p=>parsedLatest.product_tags.includes(p.tag)).slice(0,3):PRODUCTS.slice(0,2);
  const featuredPartner=parsedLatest?.product_tags?.includes("nitrogen")?FEATURED_PARTNERS.nitrogen:parsedLatest?.product_tags?.includes("moisture")?FEATURED_PARTNERS.moisture:FEATURED_PARTNERS.default;
  const usagePct=Math.min((usageCount/FREE_LIMIT)*100,100);
  const displayName=user?.name||user?.email?.split("@")[0]||userInfo.name||"";

  // ── ONBOARDING ──
  if(page==="onboarding")return(
    <><style>{css}</style>
    <div className="app">
      <div className="ob">
        <div className="ob-bg"/><div className="ob-leaf">🌿</div><div className="ob-leaf2">🍃</div>
        <div className="ob-content">
          <div className="logo-badge"><div className="logo-dot"/><span>LawnPro AI</span></div>
          <h1 className="ob-title">Your lawn,<br/><em>perfectly</em><br/>healthy.</h1>
          <p className="ob-sub">AI-powered analysis, personalized care plans, a built-in lawn expert, and smart reminders — all in one place.</p>
          <button className="bp" onClick={()=>setPage("location")}>Get Started →</button>
        </div>
      </div>
    </div></>
  );

  // ── LOCATION ──
  if(page==="location")return(
    <><style>{css}</style>
    <div className="app">
      <div className="loc">
        <div style={{marginBottom:32}}>
          <div className="eyebrow">Setup</div>
          <div className="stitle">A little about you</div>
          <div className="ssub">We'll tailor tips, weather, and seasonal advice to your location.</div>
        </div>
        <div style={{marginBottom:18}}><label className="ilabel">Your name</label><input className="ifield" placeholder="e.g. Alex" value={userInfo.name} onChange={e=>setUserInfo(p=>({...p,name:e.target.value}))}/></div>
        <div style={{marginBottom:32}}>
          <label className="ilabel">Your region</label>
          <select className="ifield" value={userInfo.region} onChange={e=>setUserInfo(p=>({...p,region:e.target.value}))}>
            <option value="">Select your region…</option>
            {REGIONS.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div style={{flex:1}}/>
        <button className="bp" disabled={!userInfo.region} onClick={()=>setPage("profile-setup")}>Continue →</button>
      </div>
    </div></>
  );

  // ── FREE PROFILE SETUP ──
  if(page==="profile-setup"){
    const GRASS_TYPES=["Bermuda","Zoysia","Kentucky Bluegrass","St. Augustine","Fescue","Ryegrass","Centipede","Bahia","Not sure"];
    const SOIL_OPTS=[{icon:"🌑",label:"Clay",sub:"Heavy, slow draining"},{icon:"🏜️",label:"Sandy",sub:"Light, fast draining"},{icon:"🌿",label:"Loam",sub:"Rich, well balanced"},{icon:"❓",label:"Not sure",sub:"We'll help you find out"}];
    const SUN_OPTS=[{icon:"☀️",label:"Full sun",sub:"6+ hours/day"},{icon:"⛅",label:"Partial",sub:"3–6 hours/day"},{icon:"🌥️",label:"Mostly shade",sub:"Under 3 hours/day"}];
    const SIZE_OPTS=[{icon:"🏠",label:"Small",sub:"Under 2,000 sq ft"},{icon:"🏡",label:"Medium",sub:"2,000–5,000 sq ft"},{icon:"🌳",label:"Large",sub:"Over 5,000 sq ft"}];
    return(
      <><style>{css}</style>
      <div className="app">
        <div className="profile-setup">
          <div className="setup-steps">
            {[0,1,2,3].map(i=><div key={i} className={`setup-step-dot${i<=2?" active":""}`}/>)}
          </div>
          <div className="eyebrow">Step 3 of 3</div>
          <div className="stitle" style={{marginBottom:6}}>Build your lawn profile</div>
          <div className="ssub" style={{marginBottom:24}}>This helps us give smarter, more personalized recommendations.</div>

          <div className="setup-card">
            <div className="setup-card-title">🌱 Grass type</div>
            <div className="chip-group">
              {GRASS_TYPES.map(g=>(
                <button key={g} className={`chip${lawnProfile.grassType===g?" sel":""}`} onClick={()=>setLawnProfile(p=>({...p,grassType:g}))}>{g}</button>
              ))}
            </div>
          </div>

          <div className="setup-card">
            <div className="setup-card-title">🏔️ Soil type</div>
            <div className="soil-grid">
              {SOIL_OPTS.map(o=>(
                <div key={o.label} className={`soil-opt${lawnProfile.soilType===o.label?" sel":""}`} onClick={()=>setLawnProfile(p=>({...p,soilType:o.label}))}>
                  <div className="soil-opt-icon">{o.icon}</div>
                  <div className="soil-opt-label">{o.label}</div>
                  <div className="soil-opt-sub">{o.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="setup-card">
            <div className="setup-card-title">☀️ Sun exposure</div>
            <div className="chip-group">
              {SUN_OPTS.map(o=>(
                <button key={o.label} className={`chip${lawnProfile.sunExposure===o.label?" sel":""}`} onClick={()=>setLawnProfile(p=>({...p,sunExposure:o.label}))}>{o.icon} {o.label}</button>
              ))}
            </div>
          </div>

          <div className="setup-card">
            <div className="setup-card-title">📐 Lawn size</div>
            <div className="chip-group">
              {SIZE_OPTS.map(o=>(
                <button key={o.label} className={`chip${lawnProfile.lawnSize===o.label?" sel":""}`} onClick={()=>setLawnProfile(p=>({...p,lawnSize:o.label}))}>{o.icon} {o.label}</button>
              ))}
            </div>
          </div>

          <button className="bp" onClick={()=>{window.storage?.set("lp_lawn_profile",JSON.stringify({...lawnProfile,region:userInfo.region,name:userInfo.name}));setPage("main");}}>
            Start Using LawnPro →
          </button>
          <span className="skip-link" onClick={()=>setPage("main")}>Skip for now</span>
        </div>
      </div></>
    );
  }

  // ── MAIN APP ──
  return(
    <><style>{css}</style>
    <div className="app">
      {toast&&<Toast msg={toast}/>}
      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onSuccess={handleAuthSuccess}/>}
      {showPro&&<ProModal onClose={()=>setShowPro(false)} onUpgrade={handleUpgrade}/>}

      {/* Nav */}
      <div className="nav">
        <div className="nav-logo">Lawn<em>Pro</em></div>
        <div className="nav-right">
          {isPro&&<div className="pro-badge">👑 PRO</div>}
          {isLoggedIn?(
            <div className="user-avatar" onClick={()=>setTab("account")} title="My Account">
              {initials(user.email)}
            </div>
          ):(
            <button className="icon-btn" onClick={()=>setShowAuth(true)} title="Sign In">👤</button>
          )}
          <button className="icon-btn">🔔</button>
        </div>
      </div>

      {/* ── HOME ── */}
      {tab==="home"&&(
        <div className="screen">
          <div className="gsub">{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
          <div className="gtitle">Hello{displayName?`, ${displayName}`:""} <em>👋</em></div>

          {/* Sign in prompt for guests */}
          {!isLoggedIn&&(
            <div style={{background:"linear-gradient(135deg,#e8f4e8,#f0f8e8)",border:"1.5px solid var(--sage-xl)",borderRadius:"var(--r)",padding:"14px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setShowAuth(true)}>
              <div style={{fontSize:24}}>☁️</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"var(--sage-d)",marginBottom:2}}>Sign in to sync your data</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>Save reports to the cloud and access them anywhere</div>
              </div>
              <div style={{fontSize:13,color:"var(--sage)",fontWeight:700}}>Sign in →</div>
            </div>
          )}

          <div className="weather-card" onClick={()=>loadWeather(userInfo.region)} style={{cursor:"pointer"}}>
            <div className="w-icon">{weather.loading?"⏳":weather.icon}</div>
            <div style={{flex:1}}>
              <div className="w-temp">{weather.temp}</div>
              <div className="w-desc">{weather.desc}{weather.city?` · ${weather.city}`:""}</div>
              <div className="w-detail">
                Humidity: {weather.humidity}
                {weather.wind?` · Wind: ${weather.wind}`:""}
                {weather.feelsLike?` · Feels like: ${weather.feelsLike}`:""}
              </div>
            </div>
            <div className="w-badge"><div className="w-badge-val">💧</div><div className="w-badge-label">{weather.lawn}</div></div>
          </div>

          {!isPro&&(
            <div className="usage-bar" onClick={()=>setShowPro(true)}>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:"var(--brown)",marginBottom:6}}>Free analyses: {usageCount}/{FREE_LIMIT} used</div>
                <div className="usage-track"><div className={`usage-fill${usageCount>=FREE_LIMIT?" warn":""}`} style={{width:`${usagePct}%`}}/></div>
                <div className="usage-txt">{usageCount>=FREE_LIMIT?"Upgrade to Pro for unlimited →":"Tap to upgrade for unlimited access"}</div>
              </div>
              <div style={{fontSize:20}}>👑</div>
            </div>
          )}

          <div className="hero" onClick={()=>{setTab("upload");resetUpload()}}>
            <div className="hero-bg">🌿</div>
            <div className="hero-label">AI Analysis</div>
            <div className="hero-title">Analyze Your Lawn</div>
            <div className="hero-sub">Upload a photo for an instant health score, grass detection, and care plan.</div>
            <button className="hero-btn">Upload Photo →</button>
          </div>

          <div className="grid2">
            <div className="mini" onClick={()=>setTab("assistant")}><div className="mini-icon">🤖</div><div className="mini-title">AI Assistant</div><div className="mini-sub">Ask the lawn expert</div></div>
            <div className="mini" onClick={()=>setTab("reports")}><div className="mini-icon">📋</div><div className="mini-title">My Reports</div><div className="mini-sub">{reports.length} saved {reports.length===1?"report":"reports"}</div></div>
            <div className="mini" onClick={()=>setTab("reminders")}><div className="mini-icon">⏰</div><div className="mini-title">Reminders</div><div className="mini-sub">{reminders.filter(r=>r.on).length} active alerts</div></div>
            <div className="mini" onClick={()=>requirePro(()=>setTab("reports"))}><div className="mini-icon">📊</div><div className="mini-title">Compare</div><div className="mini-sub">Side-by-side reports</div>{!isPro&&<div className="pro-lock">👑</div>}</div>
          </div>

          <div className="sh">🌍 Seasonal Tips</div>
          <div className="season-card">
            <div className="season-badge">{season.emoji} {season.season} — {userInfo.region||"General"}</div>
            <div className="season-title">{season.season} Lawn Care</div>
            {season.tips.map((t,i)=><div className="season-tip" key={i}><div className="season-dot"/>{t}</div>)}
          </div>

          <div className="sh">🤝 Brand Partners</div>
          <div className="partner-strip">
            <div className="partner-strip-title">Trusted brands · tap to shop</div>
            <div className="partner-logos">
              {BRAND_PARTNERS.map((b,i)=>(
                <div className="partner-logo" key={i} onClick={()=>handleProductClick({name:b.name},b.sponsored)}>
                  <div className="partner-logo-icon">{b.emoji}</div>
                  <div className="partner-logo-name">{b.name}</div>
                  {b.sponsored&&<span className="sponsored-badge">Sponsored</span>}
                </div>
              ))}
            </div>
            <div className="disclosure" style={{marginTop:8}}>Sponsored placements are clearly labeled. LawnPro may earn a commission on purchases.</div>
          </div>
        </div>
      )}

      {/* ── UPLOAD ── */}
      {tab==="upload"&&uploadView==="form"&&(
        <div className="screen">
          <div style={{marginBottom:22}}><div className="eyebrow">Lawn Analysis</div><div className="stitle">Upload Your Lawn Photo</div><div className="ssub">AI detects grass type, scores health, and builds your care plan.</div></div>

          {/* Show profile pre-fill if available */}
          {(lawnProfile.grassType||lawnProfile.soilType||lawnProfile.sunExposure)&&(
            <div style={{background:"var(--sage-xl)",borderRadius:"var(--rs)",padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:10,fontSize:12}}>
              <span>🌿</span>
              <span style={{color:"var(--sage-d)",fontWeight:600}}>Using your lawn profile</span>
              <span style={{color:"var(--sage)",marginLeft:"auto",cursor:"pointer",textDecoration:"underline"}} onClick={()=>setPage("profile-setup")}>Edit →</span>
            </div>
          )}

          <input type="file" ref={fileRef} accept="image/*" style={{display:"none"}} onChange={handleFile}/>
          {!imageB64?(
            <div className="upload-zone" onClick={()=>fileRef.current.click()}>
              <div className="uz-icon">📸</div><div className="uz-title">Tap to upload a photo</div><div className="uz-sub">JPG, PNG, HEIC · max 10 MB</div><div className="uz-link">Browse files</div>
            </div>
          ):(
            <div className="preview-wrap"><img src={`data:image/jpeg;base64,${imageB64}`} alt="Lawn"/><div className="preview-overlay"><button className="preview-change" onClick={()=>fileRef.current.click()}>Change photo</button></div></div>
          )}
          <div className="dc"><div className="dc-title">🌱 Grass Type <span className="dc-sub">optional · AI can detect it</span></div><div className="chip-group">{GRASS.map(g=><button key={g} className={`chip${grassType===g?" sel":""}`} onClick={()=>setGrassType(p=>p===g?"":g)}>{g}</button>)}</div></div>
          <div className="dc"><div className="dc-title">🧪 Recent Treatments <span className="dc-sub">optional</span></div><div className="chip-group">{TREATMENTS.map(t=><button key={t} className={`chip${treatments.includes(t)?" sel":""}`} onClick={()=>setTreatments(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t])}>{t}</button>)}</div></div>
          <div className="dc"><div className="dc-title">📝 Additional Notes <span className="dc-sub">optional</span></div><textarea className="tarea" rows={3} placeholder="e.g. Shaded corner near fence, yellowing started last week…" value={notes} onChange={e=>setNotes(e.target.value)}/></div>
          {!isPro&&usageCount>=FREE_LIMIT&&(
            <div style={{background:"#fff8e8",border:"1.5px solid #e0c870",borderRadius:"var(--r)",padding:"14px 16px",marginBottom:14,textAlign:"center"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#7a5a00",marginBottom:4}}>Free limit reached 🌿</div>
              <div style={{fontSize:13,color:"#9a7a20",marginBottom:12}}>Upgrade to Pro for unlimited analyses.</div>
              <button className="bp" style={{width:"auto",padding:"10px 24px",fontSize:13}} onClick={()=>setShowPro(true)}>Upgrade to Pro →</button>
            </div>
          )}
          <button className="bp" disabled={!imageB64||(!isPro&&usageCount>=FREE_LIMIT)} style={{opacity:imageB64&&(isPro||usageCount<FREE_LIMIT)?1:.45}} onClick={handleAnalyze}>
            {isPro||usageCount<FREE_LIMIT?"Analyze My Lawn →":"Upgrade to Analyze →"}
          </button>
        </div>
      )}

      {tab==="upload"&&uploadView==="loading"&&(
        <div className="screen"><div className="load-wrap">
          <div className="load-orb"/>
          <div className="load-title">Analyzing your lawn…</div>
          <div className="load-sub">Examining color, density, moisture, nutrients, and grass type.</div>
          <div className="load-steps">
            {["Scanning photo","Detecting grass type","Assessing health markers","Generating care plan"].map((s,i)=>(
              <div className="load-step" key={i}><div className={`ldot${loadStep===i?" active":""}${loadStep>i?" done":""}`}/><span style={{color:loadStep>=i?"var(--text)":"var(--muted)"}}>{s}</span></div>
            ))}
          </div>
        </div></div>
      )}

      {tab==="upload"&&uploadView==="result"&&result&&(
        <div className="screen">
          <div className="rh">
            <div className="rh-label">Lawn Health Score</div>
            <div className="rh-score"><span className="rh-num">{result.score}</span><span className="rh-unit">/100</span></div>
            <div className="rh-status">{scoreLabel(result.score)}</div>
            <div className="rh-sum">{result.summary}</div>
            <div className="rh-bar-wrap"><div className="rh-bar" style={{width:`${result.score}%`}}/></div>
          </div>
          {result.detected_grass&&<div style={{marginBottom:14}}><span className="grass-tag">🌿 Detected: {result.detected_grass} {result.grass_confidence==="high"?"✓":result.grass_confidence==="medium"?"~":""}</span></div>}
          {result.scientific.issues_detected?.length>0&&(
            <div className="rc"><div className="rc-head"><span className="rc-icon">⚠️</span><span className="rc-title">Issues Detected</span></div><div className="chip-group">{result.scientific.issues_detected.map((iss,i)=><span key={i} style={{padding:"5px 12px",background:"#fde8e8",color:"#8a2020",borderRadius:20,fontSize:12,fontWeight:600}}>{iss}</span>)}</div></div>
          )}
          <div className="rc">
            <div className="rc-head"><span className="rc-icon">🔬</span><span className="rc-title">Scientific Breakdown</span><span className="badge b-sci">Lab Insights</span></div>
            {[{label:"Color Health",val:result.scientific.color_health,note:result.scientific.color_health_note},{label:"Coverage",val:result.scientific.coverage,note:result.scientific.coverage_note},{label:"Moisture",val:result.scientific.moisture,note:result.scientific.moisture_note}].map(({label,val,note})=>(
              <div key={label} style={{marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:12,color:"var(--muted)"}}>{label}</span><span style={{fontSize:12,fontWeight:700,color:scoreColor(val),marginLeft:"auto"}}>{val}%</span></div>
                <div style={{background:"var(--tan)",borderRadius:100,height:4}}><div style={{width:`${val}%`,height:"100%",borderRadius:100,background:scoreColor(val)}}/></div>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>{note}</div>
              </div>
            ))}
            <div style={{paddingTop:10,borderTop:"1px solid var(--tan)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12,color:"var(--muted)"}}>Nutrient Status</span><span style={{fontSize:11,fontWeight:700,color:"var(--text)",textAlign:"right",maxWidth:"60%"}}>{result.scientific.nutrient_status}</span></div>
              <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"var(--muted)"}}>Soil Condition</span><span style={{fontSize:11,fontWeight:700,color:"var(--text)",textAlign:"right",maxWidth:"60%"}}>{result.scientific.soil_condition}</span></div>
            </div>
          </div>
          <div className="rc">
            <div className="rc-head"><span className="rc-icon">💬</span><span className="rc-title">Plain Language Tips</span><span className="badge b-tip">Easy Read</span></div>
            {result.simple_advice.map((tip,i)=>(
              <div className="advice-item" key={i}><div className="advice-num">{i+1}</div><div className="advice-txt" dangerouslySetInnerHTML={{__html:tip}}/></div>
            ))}
          </div>
          <div className="rc" style={{cursor:isPro?"default":"pointer"}} onClick={()=>!isPro&&setShowPro(true)}>
            <div className="rc-head"><span className="rc-icon">🏘️</span><span className="rc-title">Neighborhood Benchmark</span><span className="badge b-pro">PRO</span></div>
            {isPro?(
              (BENCHMARKS[userInfo.region]||BENCHMARKS.default).map((row,i)=>{const sc=row.yours?result.score:row.score;return(<div className="bench-row" key={i}><span className="bench-label" style={{color:row.yours?"var(--sage-d)":"var(--muted)",fontWeight:row.yours?700:400}}>{row.label}</span><div className="bench-bar-wrap"><div className={`bench-bar${row.yours?" yours":""}`} style={{width:`${sc}%`}}/></div><span className="bench-val" style={{fontWeight:row.yours?700:400}}>{sc}</span></div>);})
            ):<div style={{textAlign:"center",padding:"14px 0",fontSize:13,color:"var(--muted)"}}>🔒 Upgrade to Pro to compare with your neighborhood</div>}
          </div>
          <div className="rc" style={{cursor:isPro?"default":"pointer"}} onClick={()=>!isPro&&setShowPro(true)}>
            <div className="rc-head"><span className="rc-icon">🗓️</span><span className="rc-title">Your Weekly Lawn Plan</span><span className="badge b-pro">PRO</span></div>
            {isPro&&result.weekly_plan?DAYS.map(day=>result.weekly_plan[day]&&(<div className="plan-day" key={day}><div className="plan-day-name">{day}</div>{result.weekly_plan[day].map((task,i)=><div className="plan-task" key={i}><div className="plan-dot"/>{task}</div>)}</div>)):<div style={{textAlign:"center",padding:"14px 0",fontSize:13,color:"var(--muted)"}}>🔒 Upgrade to Pro for your personalized 7-day schedule</div>}
          </div>
          <div className="rc">
            <div className="rc-head"><span className="rc-icon">🛒</span><span className="rc-title">Recommended Products</span></div>
            <div className="featured-partner" onClick={()=>handleProductClick(featuredPartner,true)}>
              <div className="fp-header"><div className="fp-logo">{featuredPartner.emoji}</div><div><div className="fp-brand">{featuredPartner.brand}</div><div className="fp-tagline">{featuredPartner.tagline}</div></div><div className="fp-sponsored">Sponsored</div></div>
              <div className="fp-body"><div className="fp-offer">🎁 {featuredPartner.offer}</div><div className="fp-desc">{featuredPartner.desc}</div><div className="fp-cta"><button className="fp-btn">{featuredPartner.cta} →</button><div className="fp-commission">Exclusive LawnPro deal</div></div></div>
            </div>
            {productRecs.map((p,i)=>(
              <div className={`product-card${p.sponsored?" sponsored-card":""}`} key={i} onClick={()=>handleProductClick(p,p.sponsored)}>
                <div className="p-emoji">{p.emoji}</div>
                <div style={{flex:1}}>
                  <div className="p-name">{p.name}{p.sponsored?<span className="sponsored-badge">Sponsored</span>:<span className="affiliate-badge">Affiliate</span>}</div>
                  <div className="p-why">{p.why}</div>
                  <div className="p-price" onClick={()=>handleProductClick(p,p.sponsored)}>Check current price →</div>
                </div>
                <button className="p-buy" onClick={e=>{e.stopPropagation();handleProductClick(p,p.sponsored)}}>Buy</button>
              </div>
            ))}
            <div className="disclosure">LawnPro earns a commission on purchases made through affiliate links. Sponsored placements are clearly labeled. <span style={{color:"var(--sage)",cursor:"pointer",textDecoration:"underline"}} onClick={()=>showToast("We only recommend products matched to your lawn's needs.")}>Learn more</span></div>
          </div>
          <button className={`save-btn${resultSaved?" saved":""}`} onClick={saveReport}>{resultSaved?`✓ Saved${isLoggedIn?" to cloud":""}`:`Save This Report${isLoggedIn?" ☁️":""}`}</button>
          <button className="share-btn" onClick={handleShare}>🌿 Share My Lawn Score</button>
          <button className="bs" onClick={()=>requirePro(()=>window.print())}>{isPro?"📄 Export PDF Report":"👑 Export PDF (Pro)"}</button>
          <button className="bs" onClick={resetUpload}>Analyze Another Lawn</button>
        </div>
      )}

      {/* ── SHARE MODAL ── */}
      {showShare&&shareCardUrl&&(
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowShare(false)}}>
          <div className="modal-sheet">
            <button className="modal-close" onClick={()=>setShowShare(false)}>✕</button>
            <div className="modal-handle"/>
            <div className="modal-content">
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:6}}>Share Your Score 🌿</div>
              <div style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>Your lawn scored <strong style={{color:"var(--sage-d)"}}>{result?.score}/100</strong> — let the world know!</div>

              {/* Card preview */}
              <div className="share-modal-preview">
                <img src={shareCardUrl} alt="Share card" style={{width:"100%",borderRadius:"var(--r)"}}/>
              </div>

              {/* Native share / download */}
              <button className="share-native-btn" onClick={shareNative}>
                {typeof navigator.share!=="undefined"?"📤 Share Image":"⬇️ Download Image"}
              </button>

              {/* Platform captions */}
              <div style={{fontSize:12,fontWeight:700,color:"var(--brown)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>Copy Caption For…</div>
              <div className="share-platform-grid">
                {[
                  {id:"instagram",icon:"📸",name:"Instagram"},
                  {id:"twitter",icon:"🐦",name:"X / Twitter"},
                  {id:"facebook",icon:"👥",name:"Facebook"},
                ].map(p=>(
                  <div className="share-platform-btn" key={p.id} onClick={()=>copyShareCaption(p.id)}>
                    <div className="share-platform-icon">{p.icon}</div>
                    <div className="share-platform-name">{p.name}</div>
                  </div>
                ))}
                <div className="share-platform-btn" onClick={async()=>{
                  try{await navigator.clipboard.writeText(`lawnproapp.com`);showToast("Link copied!");}
                  catch(e){}
                }}>
                  <div className="share-platform-icon">🔗</div>
                  <div className="share-platform-name">Copy Link</div>
                </div>
              </div>

              <div style={{fontSize:12,color:"var(--muted)",textAlign:"center",lineHeight:1.5}}>
                Download the image, then post it with the copied caption on your platform of choice.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ASSISTANT ── */}
      {tab==="assistant"&&(
        <div className="chat-wrap" style={{height:"calc(100vh - 57px)",paddingBottom:"68px"}}>
          <div className="chat-hdr">
            <div className="chat-title">LawnPro Assistant</div>
            <div className="chat-sub">Ask me anything about your lawn</div>
            <div className="ai-badge">🤖 AI-powered · Not a human expert</div>
          </div>
          <div className="chat-msgs" style={{flex:1,overflowY:"auto"}}>
            {chatMsgs.map((m,i)=>(
              <div className={`msg${m.role==="user"?" user":""}`} key={i}>
                <div className={`msg-av${m.role==="assistant"?" ai":" usr"}`}>{m.role==="assistant"?"🌿":"👤"}</div>
                <div className={`bubble${m.role==="assistant"?" ai":" usr"}`} dangerouslySetInnerHTML={{__html:m.content.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}}/>
              </div>
            ))}
            {chatLoading&&(<div className="msg"><div className="msg-av ai">🌿</div><div className="bubble ai"><div className="typing"><div className="tdot"/><div className="tdot"/><div className="tdot"/></div></div></div>)}
            {chatMsgs.length===1&&!chatLoading&&(
              <div><div style={{fontSize:12,color:"var(--muted)",marginBottom:8,textAlign:"center"}}>Try asking…</div><div className="starters">{STARTERS.map(s=><button className="starter" key={s} onClick={()=>handleChat(s)}>{s}</button>)}</div></div>
            )}
            <div ref={chatEndRef}/>
          </div>
          <div className="chat-input-wrap">
            <textarea className="chat-input" rows={1} placeholder="Ask about your lawn…" value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleChat()}}}/>
            <button className="chat-send" onClick={()=>handleChat()} disabled={!chatInput.trim()||chatLoading}>↑</button>
          </div>
        </div>
      )}

      {/* ── REMINDERS ── */}
      {tab==="reminders"&&(
        <div className="screen">
          <div style={{marginBottom:20}}><div className="eyebrow">Care Schedule</div><div className="stitle">Tips & Reminders</div></div>

          {/* Notification permission banner */}
          {notifPermission==="default"&&!notifDismissed&&(
            <div className="notif-banner">
              <span style={{fontSize:24}}>🔔</span>
              <div className="notif-banner-text">
                <div className="notif-banner-title">Enable push notifications</div>
                <div className="notif-banner-sub">Get real reminders for watering, mowing, and fertilizing</div>
              </div>
              <button className="notif-enable-btn" onClick={requestNotifications}>Enable</button>
            </div>
          )}
          {notifPermission==="granted"&&(
            <div style={{background:"var(--sage-xl)",borderRadius:"var(--r)",padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
              <span>✅</span>
              <div style={{fontSize:13,color:"var(--sage-d)",fontWeight:600}}>Push notifications are enabled</div>
            </div>
          )}
          {notifPermission==="denied"&&(
            <div style={{background:"#fde8e8",border:"1px solid #f4b8b8",borderRadius:"var(--r)",padding:"12px 16px",marginBottom:16,fontSize:13,color:"var(--red)"}}>
              🚫 Notifications blocked. To enable, open your browser settings and allow notifications for this site.
            </div>
          )}

          {/* Live weather watering advice */}
          {!weather.loading&&(
            <div style={{background:"linear-gradient(135deg,#2563a8,#4a8ad4)",borderRadius:"var(--r)",padding:"14px 16px",marginBottom:16,color:"#fff",display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:28}}>{weather.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{weather.city||userInfo.region} · {weather.temp}</div>
                <div style={{fontSize:12,opacity:.82}}>{weather.lawn}</div>
              </div>
              <button onClick={()=>loadWeather(userInfo.region)} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",borderRadius:20,padding:"5px 12px",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Refresh</button>
            </div>
          )}

          <div className="sh">🌍 Seasonal Tips — {userInfo.region||"General"}</div>
          <div className="season-card" style={{marginBottom:22}}>
            <div className="season-badge">{season.emoji} {season.season}</div>
            <div className="season-title">{season.season} Lawn Care</div>
            {season.tips.map((t,i)=><div className="season-tip" key={i}><div className="season-dot"/>{t}</div>)}
          </div>

          <div className="sh">⏰ Care Reminders</div>
          {reminders.map(r=>(
            <div className="rem-card" key={r.id}>
              <div className="rem-icon">{r.icon}</div>
              <div className="rem-info"><div className="rem-name">{r.name}</div><div className="rem-sched">{r.schedule}</div></div>
              <Toggle on={r.on} onToggle={()=>{
                const nowOn=!r.on;
                setReminders(p=>p.map(x=>x.id===r.id?{...x,on:nowOn}:x));
                if(nowOn){
                  showToast(`${r.name} enabled 🔔`);
                  if(notifPermission==="granted") fireReminder(r);
                  else if(notifPermission==="default") requestNotifications();
                } else {
                  showToast(`${r.name} disabled`);
                }
              }}/>
            </div>
          ))}
          <div className="divider"/>
          <div style={{background:"#f0f8ff",border:"1.5px solid #c0daf0",borderRadius:"var(--r)",padding:16}}>
            <div style={{fontSize:13,fontWeight:700,color:"#2a4a6a",marginBottom:6}}>💧 Watering tip</div>
            <div style={{fontSize:13,color:"#4a6a8a",lineHeight:1.55}}>Water deeply and infrequently rather than lightly every day. Deep watering trains roots to grow further down, making your lawn more drought-resistant over time.</div>
          </div>
        </div>
      )}

      {/* ── REPORTS ── */}
      {tab==="reports"&&(
        <div className="screen">
          <div style={{marginBottom:20}}>
            <div className="eyebrow">History</div>
            <div className="stitle">My Lawn Reports</div>
            <div style={{fontSize:13,color:"var(--muted)",marginTop:4}}>{reports.length} saved {reports.length===1?"report":"reports"}</div>
          </div>
          {isLoggedIn&&<div className="cloud-badge">☁️ Synced to your account</div>}
          <div className="sh">💰 Revenue Dashboard</div>
          <div className="revenue-card">
            <div className="rev-title">Affiliate & Sponsorship Earnings</div>
            <div className="rev-grid">
              <div className="rev-stat"><div className="rev-num">${affiliateStats.estEarnings.toFixed(2)}</div><div className="rev-label">Est. Earnings</div></div>
              <div className="rev-stat"><div className="rev-num">{affiliateStats.clicks}</div><div className="rev-label">Total Clicks</div></div>
              <div className="rev-stat"><div className="rev-num">{affiliateStats.sponsoredClicks}</div><div className="rev-label">Sponsored</div></div>
            </div>
            <div className="rev-note">Tap any product or partner link to track clicks. Estimates based on avg. affiliate commission rates.</div>
          </div>
          {reports.length>=2&&(
            <>
              <ScoreChart reports={reports}/>
              <div className="sh" style={{marginTop:4}}>📊 Side-by-Side Comparison</div>
              {isPro?<ComparePanel reports={reports}/>:(
                <div className="rc" onClick={()=>setShowPro(true)} style={{cursor:"pointer",textAlign:"center",padding:"20px"}}>
                  <div style={{fontSize:28,marginBottom:8}}>👑</div>
                  <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:4}}>Compare Any Two Reports</div>
                  <div style={{fontSize:13,color:"var(--muted)",marginBottom:14}}>Track your lawn's improvement over time with side-by-side visual comparison.</div>
                  <button className="bp" style={{width:"auto",padding:"10px 24px",fontSize:13}} onClick={e=>{e.stopPropagation();setShowPro(true)}}>Upgrade to Pro →</button>
                </div>
              )}
              <div className="sh" style={{marginTop:20}}>All Reports</div>
            </>
          )}
          {reportsLoading?<div style={{textAlign:"center",padding:"40px",color:"var(--muted)"}}>Loading reports…</div>:reports.length===0?(
            <div className="empty">
              <div className="empty-icon">📋</div>
              <div className="empty-title">No reports yet</div>
              <div className="empty-sub">Upload a lawn photo and save your first analysis to start tracking progress over time.</div>
              <button className="bp" style={{width:"auto",padding:"13px 28px"}} onClick={()=>{setTab("upload");resetUpload()}}>Analyze My Lawn →</button>
            </div>
          ):(
            reports.map((rep,i)=>{
              const d=rep.data?JSON.parse(rep.data):rep;
              return(
                <div className="report-card" key={i} onClick={()=>setSelectedReport(rep)}>
                  {d.imageBase64?<div className="rep-thumb"><img src={`data:image/jpeg;base64,${d.imageBase64}`} alt="Lawn"/></div>:<div className="rep-ph">🌿</div>}
                  <div style={{flex:1}}>
                    <div className="rep-date">{fmtDate(rep.created_at||rep.date)}</div>
                    <div className="rep-name">{rep.grass_type||d.detected_grass||d.grassType||"Lawn"} Analysis</div>
                    <span className={`score-pill ${scoreClass(rep.score)}`}>{rep.score}/100 · {scoreLabel(rep.score)}</span>
                  </div>
                  <span className="rep-arr">›</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── REPORT DETAIL ── */}
      {tab==="reports"&&selectedReport&&(()=>{
        const d=selectedReport.data?JSON.parse(selectedReport.data):selectedReport;
        return(
          <div style={{position:"fixed",inset:0,background:"var(--warm)",zIndex:150,overflowY:"auto",paddingBottom:80,maxWidth:480,margin:"0 auto"}}>
            <div style={{padding:"16px 20px 0"}}>
              <div className="report-detail-header">
                <button className="report-detail-back" onClick={()=>setSelectedReport(null)}>←</button>
                <div>
                  <div className="report-detail-title">{selectedReport.grass_type||d.detected_grass||"Lawn"} Report</div>
                  <div className="report-detail-date">{fmtDate(selectedReport.created_at||selectedReport.date)}</div>
                </div>
              </div>
            </div>
            <div style={{padding:"0 20px 20px"}}>
              {/* Photo */}
              {d.imageBase64&&(
                <div style={{borderRadius:16,overflow:"hidden",marginBottom:16,aspectRatio:"4/3"}}>
                  <img src={`data:image/jpeg;base64,${d.imageBase64}`} alt="Lawn" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              )}
              {/* Score header */}
              <div className="rh">
                <div className="rh-label">Lawn Health Score</div>
                <div className="rh-score"><span className="rh-num">{selectedReport.score}</span><span className="rh-unit">/100</span></div>
                <div className="rh-status">{scoreLabel(selectedReport.score)}</div>
                <div className="rh-sum">{selectedReport.summary||d.summary}</div>
                <div className="rh-bar-wrap"><div className="rh-bar" style={{width:`${selectedReport.score}%`}}/></div>
              </div>
              {/* Issues */}
              {d.scientific?.issues_detected?.length>0&&(
                <div className="rc">
                  <div className="rc-head"><span className="rc-icon">⚠️</span><span className="rc-title">Issues Detected</span></div>
                  <div className="chip-group">{d.scientific.issues_detected.map((iss,i)=><span key={i} style={{padding:"5px 12px",background:"#fde8e8",color:"#8a2020",borderRadius:20,fontSize:12,fontWeight:600}}>{iss}</span>)}</div>
                </div>
              )}
              {/* Scientific */}
              {d.scientific&&(
                <div className="rc">
                  <div className="rc-head"><span className="rc-icon">🔬</span><span className="rc-title">Scientific Breakdown</span><span className="badge b-sci">Lab Insights</span></div>
                  {[{label:"Color Health",val:d.scientific.color_health,note:d.scientific.color_health_note},{label:"Coverage",val:d.scientific.coverage,note:d.scientific.coverage_note},{label:"Moisture",val:d.scientific.moisture,note:d.scientific.moisture_note}].map(({label,val,note})=>(
                    <div key={label} style={{marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:12,color:"var(--muted)"}}>{label}</span><span style={{fontSize:12,fontWeight:700,color:scoreColor(val),marginLeft:"auto"}}>{val}%</span></div>
                      <div style={{background:"var(--tan)",borderRadius:100,height:4}}><div style={{width:`${val}%`,height:"100%",borderRadius:100,background:scoreColor(val)}}/></div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>{note}</div>
                    </div>
                  ))}
                  <div style={{paddingTop:10,borderTop:"1px solid var(--tan)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12,color:"var(--muted)"}}>Nutrient Status</span><span style={{fontSize:11,fontWeight:700,color:"var(--text)",textAlign:"right",maxWidth:"60%"}}>{d.scientific.nutrient_status}</span></div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"var(--muted)"}}>Soil Condition</span><span style={{fontSize:11,fontWeight:700,color:"var(--text)",textAlign:"right",maxWidth:"60%"}}>{d.scientific.soil_condition}</span></div>
                  </div>
                </div>
              )}
              {/* Advice */}
              {d.simple_advice&&(
                <div className="rc">
                  <div className="rc-head"><span className="rc-icon">💬</span><span className="rc-title">Care Tips</span><span className="badge b-tip">Easy Read</span></div>
                  {d.simple_advice.map((tip,i)=>(
                    <div className="advice-item" key={i}><div className="advice-num">{i+1}</div><div className="advice-txt" dangerouslySetInnerHTML={{__html:tip}}/></div>
                  ))}
                </div>
              )}
              {/* Weekly plan */}
              {d.weekly_plan&&isPro&&(
                <div className="rc">
                  <div className="rc-head"><span className="rc-icon">🗓️</span><span className="rc-title">Weekly Plan</span></div>
                  {DAYS.map(day=>d.weekly_plan[day]&&(
                    <div className="plan-day" key={day}><div className="plan-day-name">{day}</div>{d.weekly_plan[day].map((task,i)=><div className="plan-task" key={i}><div className="plan-dot"/>{task}</div>)}</div>
                  ))}
                </div>
              )}
              <button className="bs" onClick={()=>setSelectedReport(null)} style={{marginTop:8}}>← Back to Reports</button>
              <button className="bs" onClick={()=>requirePro(()=>window.print())}>📄 Export PDF</button>
            </div>
          </div>
        );
      })()}

      {/* ── ACCOUNT ── */}
      {tab==="account"&&(
        <div className="screen">
          {!isLoggedIn?(
            <>
              {/* Guest profile header */}
              <div className="guest-profile-header">
                <div className="guest-profile-bg">🌿</div>
                <div className="guest-avatar">
                  {userInfo.name?userInfo.name[0].toUpperCase():"🌱"}
                </div>
                <div className="guest-name">{userInfo.name||"Lawn Enthusiast"}</div>
                <div className="guest-since">{userInfo.region||"Location not set"} · Member since today</div>
                <div className="guest-plan-pill">🌿 Free Plan · Guest</div>
              </div>

              {/* Usage stats */}
              <div className="profile-stat-row">
                <div className="profile-stat"><div className="profile-stat-num">{reports.length}</div><div className="profile-stat-label">Reports</div></div>
                <div className="profile-stat"><div className="profile-stat-num">{reports.length>0?Math.max(...reports.map(r=>r.score)):"-"}</div><div className="profile-stat-label">Best Score</div></div>
                <div className="profile-stat"><div className="profile-stat-num">{Math.max(FREE_LIMIT-usageCount,0)}</div><div className="profile-stat-label">Analyses Left</div></div>
              </div>

              {/* Lawn profile card */}
              <div className="lawn-profile-card">
                <div className="lawn-profile-title">
                  🌿 My Lawn Profile
                  <span className="lawn-profile-edit" onClick={()=>setPage("profile-setup")}>Edit →</span>
                </div>
                {[
                  {icon:"📍",label:"Region",value:userInfo.region||"Not set"},
                  {icon:"🌱",label:"Grass type",value:lawnProfile.grassType||"Not set"},
                  {icon:"🏔️",label:"Soil type",value:lawnProfile.soilType||"Not set"},
                  {icon:"☀️",label:"Sun exposure",value:lawnProfile.sunExposure||"Not set"},
                  {icon:"📐",label:"Lawn size",value:lawnProfile.lawnSize||"Not set"},
                ].map(({icon,label,value})=>(
                  <div className="lawn-detail-row" key={label}>
                    <div className="lawn-detail-icon">{icon}</div>
                    <div className="lawn-detail-label">{label}</div>
                    <div className="lawn-detail-value" style={{color:value==="Not set"?"var(--muted)":"var(--text)"}}>{value}</div>
                  </div>
                ))}
              </div>

              {/* What's included in Free */}
              <div className="free-perks">
                <div className="free-perks-title">Your Free Plan Includes</div>
                {[
                  {yes:true,text:`${FREE_LIMIT} AI lawn analyses per month`},
                  {yes:true,text:"Grass type detection from photo"},
                  {yes:true,text:"Health score & scientific breakdown"},
                  {yes:true,text:"Plain language care tips"},
                  {yes:true,text:"Seasonal tips & care reminders"},
                  {yes:true,text:"Product recommendations"},
                  {yes:false,text:"Unlimited analyses (Pro)"},
                  {yes:false,text:"LawnPro Assistant AI chat (Pro)"},
                  {yes:false,text:"7-day personalized care plans (Pro)"},
                  {yes:false,text:"Cloud report storage & sync (Pro)"},
                ].map(({yes,text},i)=>(
                  <div className="perk-row" key={i}>
                    <div className={`perk-check${yes?" yes":" no"}`}>{yes?"✓":"✕"}</div>
                    <div className={`perk-text${yes?"":" locked"}`}>{text}</div>
                  </div>
                ))}
              </div>

              {/* Create account CTA */}
              <div className="signup-cta-card">
                <div className="signup-cta-title">Save your progress</div>
                <div className="signup-cta-sub">Create a free account to back up your reports to the cloud, access them on any device, and never lose your lawn history.</div>
                <button className="signup-cta-btn" onClick={()=>setShowAuth(true)}>Create Free Account →</button>
                <div className="signup-cta-note">Already have an account? <span style={{textDecoration:"underline",cursor:"pointer"}} onClick={()=>setShowAuth(true)}>Sign in</span></div>
              </div>

              {/* Upgrade to Pro */}
              <div style={{background:"linear-gradient(135deg,#1e3a1e,#3a6a3a)",borderRadius:"var(--r)",padding:"20px",marginBottom:16,textAlign:"center",cursor:"pointer"}} onClick={()=>setShowPro(true)}>
                <div style={{fontSize:24,marginBottom:8}}>👑</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"#fff",marginBottom:6}}>Upgrade to Pro</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,.75)",marginBottom:14}}>Unlimited analyses, AI chat, weekly plans, and more for $7.99/mo</div>
                <div style={{background:"#a8e06a",color:"#1e3a1e",borderRadius:30,padding:"10px 24px",display:"inline-block",fontWeight:700,fontSize:14}}>Start Free Trial →</div>
              </div>

              {/* Quick links */}
              <div className="profile-section">
                <div className="profile-row" onClick={()=>setTab("reminders")}><span className="profile-row-icon">⏰</span><span className="profile-row-label">Manage Reminders</span><span className="profile-row-arrow">›</span></div>
                <div className="profile-row" onClick={()=>setTab("reports")}><span className="profile-row-icon">📋</span><span className="profile-row-label">My Reports</span><span className="profile-row-value">{reports.length} saved</span><span className="profile-row-arrow">›</span></div>
                <div className="profile-row" onClick={()=>{setTab("upload");resetUpload()}}><span className="profile-row-icon">📸</span><span className="profile-row-label">Analyze My Lawn</span><span className="profile-row-value">{Math.max(FREE_LIMIT-usageCount,0)} left</span><span className="profile-row-arrow">›</span></div>
              </div>
            </>
          ):(
            <>
              <div className="profile-header">
                <div className="profile-avatar">{initials(user.email)}</div>
                <div className="profile-name">{displayName}</div>
                <div className="profile-email">{user.email}</div>
                <div className={`profile-plan-badge ${isPro?"plan-pro":"plan-free"}`}>
                  {isPro?"👑 LawnPro Pro":"🌿 Free Plan"}
                </div>
              </div>

              <div className="profile-stat-row">
                <div className="profile-stat"><div className="profile-stat-num">{reports.length}</div><div className="profile-stat-label">Reports</div></div>
                <div className="profile-stat"><div className="profile-stat-num">{reports.length>0?Math.max(...reports.map(r=>r.score)):"-"}</div><div className="profile-stat-label">Best Score</div></div>
                <div className="profile-stat"><div className="profile-stat-num">{isPro?"∞":FREE_LIMIT-usageCount}</div><div className="profile-stat-label">Analyses Left</div></div>
              </div>

              {!isPro&&(
                <div style={{background:"linear-gradient(135deg,#1e3a1e,#3a6a3a)",borderRadius:"var(--r)",padding:"20px",marginBottom:16,textAlign:"center",cursor:"pointer"}} onClick={()=>setShowPro(true)}>
                  <div style={{fontSize:24,marginBottom:8}}>👑</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"#fff",marginBottom:6}}>Upgrade to Pro</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,.75)",marginBottom:14}}>Unlimited analyses, AI chat, weekly plans, and more for $7.99/mo</div>
                  <div style={{background:"#a8e06a",color:"#1e3a1e",borderRadius:30,padding:"10px 24px",display:"inline-block",fontWeight:700,fontSize:14}}>Start Free Trial →</div>
                </div>
              )}

              <div className="profile-section">
                <div className="profile-row" onClick={()=>setPage("profile-setup")}>
                  <span className="profile-row-icon">✏️</span><span className="profile-row-label">Edit Lawn Profile</span><span className="profile-row-arrow">›</span>
                </div>
                <div className="profile-row" onClick={()=>setTab("reminders")}>
                  <span className="profile-row-icon">⏰</span><span className="profile-row-label">Manage Reminders</span><span className="profile-row-arrow">›</span>
                </div>
                <div className="profile-row" onClick={()=>setTab("reports")}>
                  <span className="profile-row-icon">📋</span><span className="profile-row-label">My Reports</span><span className="profile-row-value">{reports.length} saved</span><span className="profile-row-arrow">›</span>
                </div>
                {isPro&&(
                  <div className="profile-row" onClick={()=>window.open(STRIPE_PAYMENT_LINK||"https://billing.stripe.com","_blank")}>
                    <span className="profile-row-icon">💳</span><span className="profile-row-label">Manage Subscription</span><span className="profile-row-value">Pro · $7.99/mo</span><span className="profile-row-arrow">›</span>
                  </div>
                )}
              </div>

              {/* Referral section */}
              <div className="referral-card">
                <div className="referral-title">🎁 Refer a Friend</div>
                <div className="referral-sub">Share LawnPro and earn <strong style={{color:"#a8e06a"}}>1 free extra analysis</strong> for every friend who signs up. They get one too.</div>
                <div className="referral-link-box">
                  <div className="referral-link-text">{getReferralLink()}</div>
                  <button className="referral-copy-btn" onClick={copyReferralLink}>{referralCopied?"✓ Copied!":"Copy"}</button>
                </div>
                <div className="referral-stats">
                  <div className="referral-stat"><div className="referral-stat-num">{referrals.length}</div><div className="referral-stat-label">Invited</div></div>
                  <div className="referral-stat"><div className="referral-stat-num">{referrals.filter(r=>r.status==="completed").length}</div><div className="referral-stat-label">Signed Up</div></div>
                  <div className="referral-stat"><div className="referral-stat-num">+{referrals.filter(r=>r.status==="completed").length}</div><div className="referral-stat-label">Bonus Analyses</div></div>
                </div>
              </div>

              <div className="profile-section">
                <div className="profile-row" onClick={()=>showToast("Privacy policy: lawnproapp.com/privacy")}>
                  <span className="profile-row-icon">🔒</span><span className="profile-row-label">Privacy Policy</span><span className="profile-row-arrow">›</span>
                </div>
                <div className="profile-row" onClick={()=>showToast("Terms: lawnproapp.com/terms")}>
                  <span className="profile-row-icon">📄</span><span className="profile-row-label">Terms of Service</span><span className="profile-row-arrow">›</span>
                </div>
                <div className="profile-row" onClick={()=>showToast("Affiliate disclosure: We earn commissions on qualifying purchases.")}>
                  <span className="profile-row-icon">🤝</span><span className="profile-row-label">Affiliate Disclosure</span><span className="profile-row-arrow">›</span>
                </div>
              </div>

              <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
            </>
          )}
        </div>
      )}

      {/* Tab Bar */}
      <div className="tab-bar">
        {[{id:"home",icon:"🏡",label:"Home"},{id:"upload",icon:"📸",label:"Analyze"},{id:"assistant",icon:"🤖",label:"Assistant"},{id:"reminders",icon:"⏰",label:"Reminders"},{id:"reports",icon:"📋",label:"Reports"},{id:"account",icon:"👤",label:"Account"}].map(t=>(
          <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>{setTab(t.id);if(t.id==="upload")resetUpload()}}>
            {!isPro&&t.id==="assistant"&&<div className="tab-pip"/>}
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </div>
    </div></>
  );
}
