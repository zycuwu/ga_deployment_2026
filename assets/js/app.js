// 純 JavaScript，使用一般 script 而非 module，支援直接開啟 index.html。
"use strict";
const $ = (selector) => document.querySelector(selector);
const money = (value) =>
  new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(value);
// 只送出示範互動，不送出 purchase，避免將教學操作當成營收。
function track(name, params = {}) {
  if (typeof window.gtag === "function") window.gtag("event", name, params);
}
const itemData = (p) => ({
  item_id: String(p.id),
  item_name: p.name,
  item_category: p.category,
  price: p.price,
});
let category = "全部商品",
  cart = {},
  toastTimer;
try {
  const saved = JSON.parse(localStorage.getItem("daily-good-cart-v1") || "{}");
  for (const p of PRODUCTS) {
    const n = saved?.[p.id];
    if (Number.isInteger(n) && n > 0 && n <= 99) cart[p.id] = n;
  }
} catch (_) {
  /* 儲存空間不可用時，仍可在本次瀏覽操作。 */
}
function saveCart() {
  try {
    localStorage.setItem("daily-good-cart-v1", JSON.stringify(cart));
  } catch (_) {}
  renderCart();
}
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2200);
}
function add(id) {
  cart[id] = Math.min(99, (cart[id] || 0) + 1);
  saveCart();
  const p = PRODUCTS.find((p) => p.id === id);
  track("add_to_cart", {
    currency: "TWD",
    value: p.price,
    items: [{ ...itemData(p), quantity: 1 }],
  });
  toast("已加入示範購物袋");
}
function render() {
  const q = $("#search").value.trim().toLocaleLowerCase();
  let list = PRODUCTS.filter(
    (p) =>
      (category === "全部商品" || p.category === category) &&
      [p.name, p.category, p.description, p.spec].some((v) =>
        v.toLocaleLowerCase().includes(q),
      ),
  );
  if ($("#sort").value === "low") list.sort((a, b) => a.price - b.price);
  if ($("#sort").value === "high") list.sort((a, b) => b.price - a.price);
  $("#products").replaceChildren();
  for (const p of list) {
    const card = document.createElement("article");
    card.className = "card"; // 商品資料為本機教學資料；顯示文字以 textContent 寫入。
    const view = document.createElement("button");
    view.className = "product-view";
    view.setAttribute("aria-label", "查看 " + p.name + " 詳情");
    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name + " 示意插圖";
    img.loading = "lazy";
    view.append(img);
    for (const [tag, txt, cls] of [
      ["small", p.category, ""],
      ["h3", p.name, ""],
      ["div", p.spec, "spec"],
    ]) {
      const el = document.createElement(tag);
      el.textContent = txt;
      el.className = cls;
      view.append(el);
    }
    view.onclick = () => showDetail(p);
    const bottom = document.createElement("div");
    bottom.className = "card-bottom";
    const price = document.createElement("span");
    price.className = "price";
    price.textContent = money(p.price);
    const old = document.createElement("del");
    old.textContent = money(p.originalPrice);
    price.append(old);
    const btn = document.createElement("button");
    btn.textContent = "＋ 加入購物袋";
    btn.setAttribute("aria-label", "將 " + p.name + " 加入購物袋");
    btn.onclick = () => add(p.id);
    bottom.append(price, btn);
    card.append(view, bottom);
    $("#products").append(card);
  }
  $("#result-count").textContent = `${category} · 共 ${list.length} 件商品`;
  $("#empty").hidden = list.length > 0;
}
for (const cat of ["全部商品", ...new Set(PRODUCTS.map((p) => p.category))]) {
  const btn = document.createElement("button");
  btn.textContent = cat;
  btn.setAttribute("aria-pressed", String(cat === category));
  btn.onclick = () => {
    category = cat;
    for (const b of $("#categories").children)
      b.setAttribute("aria-pressed", String(b === btn));
    render();
    track("select_category", { category_name: cat });
  };
  $("#categories").append(btn);
}
$("#search").addEventListener("input", render);
$("#search-form").onsubmit = (e) => {
  e.preventDefault();
  render();
  track("search", { search_term: $("#search").value.trim() });
};
$("#sort").onchange = render;
$("#reset").onclick = () => {
  $("#search").value = "";
  $("#sort").value = "featured";
  $("#categories").firstElementChild.click();
};
function showDetail(p) {
  const body = $("#detail-body");
  body.replaceChildren();
  const img = document.createElement("img");
  img.src = p.image;
  img.alt = p.name + " 示意插圖";
  body.append(img);
  for (const [tag, txt] of [
    ["p", p.category],
    ["h2", p.name],
    ["p", p.spec],
    ["p", p.description],
    ["strong", money(p.price)],
    ["p", "商品及規格為虛構示意；本網站不提供真實交易。"],
  ]) {
    const el = document.createElement(tag);
    el.textContent = txt;
    if (tag === "h2") el.id = "detail-title";
    body.append(el);
  }
  const btn = document.createElement("button");
  btn.className = "primary";
  btn.textContent = "加入示範購物袋";
  btn.onclick = () => add(p.id);
  body.append(btn);
  $("#detail").showModal();
  track("view_item", { currency: "TWD", value: p.price, items: [itemData(p)] });
}
function renderCart() {
  let count = 0,
    total = 0;
  $("#cart-items").replaceChildren();
  for (const p of PRODUCTS) {
    const n = cart[p.id] || 0;
    if (!n) continue;
    count += n;
    total += p.price * n;
    const row = document.createElement("div");
    row.className = "cart-row";
    const name = document.createElement("p");
    name.textContent = `${p.name} · ${money(p.price * n)}`;
    const controls = document.createElement("div");
    controls.className = "quantity";
    for (const [label, delta] of [
      ["−", -1],
      ["＋", 1],
    ]) {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.setAttribute(
        "aria-label",
        `${delta < 0 ? "減少" : "增加"}${p.name}數量`,
      );
      btn.disabled = delta > 0 && n >= 99;
      btn.onclick = () => {
        const next = n + delta;
        if (next <= 0) delete cart[p.id];
        else cart[p.id] = next;
        saveCart();
      };
      controls.append(btn);
      if (delta < 0) {
        const qty = document.createElement("span");
        qty.textContent = String(n);
        controls.append(qty);
      }
    }
    const remove = document.createElement("button");
    remove.textContent = "移除";
    remove.className = "remove";
    remove.setAttribute("aria-label", "移除 " + p.name);
    remove.onclick = () => {
      delete cart[p.id];
      saveCart();
    };
    controls.append(remove);
    row.append(name, controls);
    $("#cart-items").append(row);
  }
  if (!count)
    $("#cart-items").textContent = "購物袋還是空的，先挑一件喜歡的好物吧。";
  $("#cart-count").textContent = String(count);
  $("#cart-total").textContent = money(total);
  $("#checkout").disabled = !count;
  $("#clear-cart").disabled = !count;
}
$("#cart-open").onclick = () => {
  $("#checkout-message").textContent = "";
  renderCart();
  $("#cart").showModal();
};
$("#clear-cart").onclick = () => {
  cart = {};
  saveCart();
  $("#checkout-message").textContent = "已清空示範購物袋。";
};
$("#checkout").onclick = () => {
  $("#checkout-message").textContent =
    "示範完成！這不是訂單，沒有付款、配送或任何扣款。";
  track("demo_checkout", { demo: true });
};
for (const btn of document.querySelectorAll("[data-close]"))
  btn.onclick = () => $("#" + btn.dataset.close).close();
// 教學練習：修改輪播文字。促銷為文案示範，購物袋總額不套用折扣。
const BANNERS = [
  {
    label: "THE EVERYDAY EDIT · 日常選品",
    title: "把日子，過成喜歡的樣子。",
    text: "精選日用品與美味提案，給生活剛剛好的溫度。",
    color: "#e8ecdf",
  },
  {
    label: "WEEKLY SPECIAL · 本週促銷示意",
    title: "日常補給，最高省下 20%。",
    text: "指定商品示意特價，價格以商品卡片顯示為準。",
    color: "#f3e4d6",
  },
  {
    label: "PANTRY FAVORITES · 美味時光",
    title: "好好吃飯，也好好休息。",
    text: "咖啡、穀物與點心，把午後留給自己。",
    color: "#e5eaf0",
  },
];
let slide = 0,
  paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  hovering = false,
  focused = false;
function showBanner(index) {
  slide = (index + BANNERS.length) % BANNERS.length;
  const b = BANNERS[slide];
  $("#banner-label").textContent = b.label;
  $("#banner-title").textContent = b.title;
  $("#banner-text").textContent = b.text;
  $(".hero").style.background = b.color;
  for (const [i, d] of [...$("#dots").children].entries())
    d.setAttribute("aria-current", String(i === slide));
}
BANNERS.forEach((_, i) => {
  const btn = document.createElement("button");
  btn.setAttribute("aria-label", `顯示第 ${i + 1} 則促銷`);
  btn.onclick = () => showBanner(i);
  $("#dots").append(btn);
});
$("#prev").onclick = () => showBanner(slide - 1);
$("#next").onclick = () => showBanner(slide + 1);
function pauseLabel() {
  $("#pause").textContent = paused ? "播放輪播" : "暫停輪播";
  $("#pause").setAttribute("aria-pressed", String(paused));
}
$("#pause").onclick = () => {
  paused = !paused;
  pauseLabel();
};
$(".hero").onmouseenter = () => (hovering = true);
$(".hero").onmouseleave = () => (hovering = false);
$(".hero").onfocusin = () => (focused = true);
$(".hero").onfocusout = (e) => {
  focused = $(".hero").contains(e.relatedTarget);
};
setInterval(() => {
  if (!paused && !hovering && !focused && !document.hidden)
    showBanner(slide + 1);
}, 5000);
pauseLabel();
showBanner(0);
render();
renderCart();
