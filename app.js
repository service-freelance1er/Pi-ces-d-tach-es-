const PRODUCTS = [
  {id:"moteur-01", name:"Moteur Turbo + Piston Complet", category:"Moteur", price:350000, image:"moteur.turbo.piston.jpg", description:"Moteur complet avec turbo et piston. Puissance d origine, pret a monter. Ideal pour Audi, VW, Peugeot."},
  {id:"piston-01", name:"Piston Moteur - Haute Qualite", category:"Moteur", price:45000, image:"piston.jpg", description:"Piston moteur neuf, haute resistance. Pour reparation moteur, perte de puissance."}
];
let products = PRODUCTS;
let cart = JSON.parse(localStorage.getItem("ad_cart")||"[]");
let currentCategory="all", currentSort="default", currentSearch="";
function saveCart(){localStorage.setItem("ad_cart",JSON.stringify(cart));updateCartCount();}
function updateCartCount(){let c=document.getElementById("cart-count");if(c)c.textContent=cart.reduce((s,i)=>s+i.qty,0);}
function money(n){return n.toLocaleString("fr-FR")+" FCFA";}
function renderProducts(){
  let grid=document.getElementById("product-grid");if(!grid)return;
  let list=products.filter(p=>currentCategory==="all"||p.category===currentCategory);
  if(currentSearch)list=list.filter(p=>(p.name+" "+p.description).toLowerCase().includes(currentSearch.toLowerCase()));
  if(currentSort==="price-asc")list.sort((a,b)=>a.price-b.price);
  if(currentSort==="price-desc")list.sort((a,b)=>b.price-a.price);
  let count=document.getElementById("product-count");if(count)count.textContent=list.length+" produits";
  if(list.length===0){grid.innerHTML="<p>Aucun produit trouve.</p>";return;}
  grid.innerHTML=list.map(p=>`
  <div class="product-card">
    <img src="${p.image}" alt="${p.name}" onclick="location.href='produit.html?id=${p.id}'" style="cursor:pointer">
    <div class="product-info"><span class="badge">${p.category} • En stock</span><h3>${p.name}</h3><p>${p.description}</p><div class="price">${money(p.price)}</div>
    <button class="btn-add" onclick="addToCart('${p.id}')">Ajouter au panier</button>
    <a href="produit.html?id=${p.id}" style="display:block;text-align:center;margin-top:8px;color:#0b1a2e;font-weight:bold">Voir détails →</a></div>
  </div>`).join("");
}
function addToCart(id){let f=cart.find(i=>i.id===id);if(f)f.qty++;else cart.push({id,qty:1});saveCart();alert("Ajouté au panier !");renderCartPage();}
function changeQty(id,d){let f=cart.find(i=>i.id===id);if(!f)return;f.qty+=d;if(f.qty<=0)cart=cart.filter(i=>i.id!==id);saveCart();renderCartPage();}
function renderCartPage(){
  let box=document.getElementById("cart-items");if(!box)return;let total=0;
  if(cart.length===0){box.innerHTML="<p>Votre panier est vide. <a href='produits.html'>Voir la boutique</a></p>";}
  else{box.innerHTML=cart.map(i=>{let p=products.find(x=>x.id===i.id);if(!p)return "";let sub=p.price*i.qty;total+=sub;return `<div class="cart-item"><img src="${p.image}"><div style="flex:1"><b>${p.name}</b><br>${money(p.price)} x ${i.qty} = <b>${money(sub)}</b></div><div><button onclick="changeQty('${p.id}',-1)">-</button> ${i.qty} <button onclick="changeQty('${p.id}',1)">+</button></div></div>`}).join("");}
  let t=document.getElementById("cart-total");if(t)t.textContent=money(total);
}
function checkout(){
  if(cart.length===0){alert("Panier vide");return;}
  let msg="Bonjour Pieces Auto Adjame, je veux commander :%0A";let total=0;
  cart.forEach(i=>{let p=products.find(x=>x.id===i.id);total+=p.price*i.qty;msg+="- "+p.name+" x "+i.qty+" = "+(p.price*i.qty)+" FCFA%0A";});
  msg+="Total : "+total+" FCFA";
  window.open("https://wa.me/22555061653?text="+msg,"_blank");
}
function filterCategory(c){currentCategory=c;renderProducts();}
function sortProducts(v){currentSort=v;renderProducts();}
function searchProducts(v){currentSearch=v;renderProducts();}
document.addEventListener("DOMContentLoaded",()=>{renderProducts();renderCartPage();updateCartCount();});
