// Fonctions communes à toutes les pages.
// À modifier : l'adresse e-mail de contact.
const CONTACT_EMAIL = 'tsioryramarosandratana@gmail.com';

const BASE = document.body.dataset.base || '';
const EUR = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Image réelle si le produit en a une (champ "image" dans le JSON), sinon un cadre avec l'univers
function imageHtml(p, classe) {
  return p.image
    ? `<img class="${classe}" src="${BASE}${escapeHtml(p.image)}" alt="${escapeHtml(p.nom)}" loading="lazy">`
    : `<div class="${classe}">${escapeHtml(p.categorie)}</div>`;
}

async function loadProducts() {
  const response = await fetch(BASE + 'data/produits.json');
  if (!response.ok) throw new Error('Impossible de charger les produits');
  return response.json();
}

function productCard(p) {
  const badge = p.badge ? `<span class="badge">${escapeHtml(p.badge)}</span>` : '';
  return `
    <article class="product-card">
      ${imageHtml(p, 'product-img')}
      <div class="product-body">
        <p class="product-meta">${escapeHtml(p.marque)} · ${escapeHtml(p.categorie)}</p>
        <h3>${escapeHtml(p.nom)}</h3>
        <p class="product-desc">${escapeHtml(p.description)}</p>
        <div class="product-foot">
          <span class="price">${EUR.format(p.prix)}</span>
          ${badge}
        </div>
        <a class="btn btn-primary btn-small btn-block" href="${BASE}pages/produit.html?id=${encodeURIComponent(p.id)}">Voir la fiche</a>
      </div>
    </article>`;
}

// Accueil : sélection des produits mis en avant
const featuredEl = document.getElementById('featured');
if (featuredEl) {
  loadProducts()
    .then((list) => {
      featuredEl.innerHTML = list.filter((p) => p.vedette).slice(0, 4).map(productCard).join('');
    })
    .catch(() => {
      featuredEl.innerHTML = '<p class="muted">Produits indisponibles pour le moment.</p>';
    });
}

// Page fiche produit
const ficheEl = document.getElementById('fiche');
if (ficheEl) {
  const id = new URLSearchParams(location.search).get('id');
  loadProducts()
    .then((list) => {
      const p = list.find((x) => x.id === id);
      if (!p) {
        ficheEl.innerHTML = '<p class="muted">Ce produit n\'existe pas. <a href="produits.html">Voir le catalogue</a></p>';
        return;
      }
      document.title = `${p.nom} — E-varotra`;
      document.getElementById('fil-nom').textContent = p.nom;
      const specs = Object.entries(p.specs || {})
        .map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`)
        .join('');
      ficheEl.innerHTML = `
        <div class="product-page">
          ${imageHtml(p, 'product-photo')}
          <div class="product-info">
            <p class="product-meta">${escapeHtml(p.marque)} · ${escapeHtml(p.categorie)}</p>
            <h1>${escapeHtml(p.nom)}</h1>
            <p class="muted">${escapeHtml(p.description)}</p>
            <span class="price">${EUR.format(p.prix)}</span>
            <a class="btn btn-primary btn-block" href="contact.html?produit=${encodeURIComponent(p.id)}">Commander ce produit</a>
            <a class="btn btn-outline btn-block" href="contact.html?produit=${encodeURIComponent(p.id)}">Demander un conseil</a>
            <table class="specs">${specs}</table>
          </div>
        </div>`;
      const autres = list.filter((x) => x.id !== p.id && x.categorie === p.categorie).slice(0, 4);
      const relatedEl = document.getElementById('related');
      if (relatedEl && autres.length) {
        relatedEl.innerHTML = `
          <div class="section-head"><h2>Dans la même catégorie</h2></div>
          <div class="grid grid-4" style="margin-top:16px">${autres.map(productCard).join('')}</div>`;
      }
    })
    .catch(() => {
      ficheEl.innerHTML = '<p class="muted">Produit indisponible pour le moment.</p>';
    });
}

// Page contact : liste des produits et envoi par e-mail
const produitSelect = document.getElementById('produit-select');
const contactForm = document.getElementById('contact-form');

if (produitSelect) {
  loadProducts().then((list) => {
    list.forEach((p) => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = `${p.nom} (${EUR.format(p.prix)})`;
      produitSelect.appendChild(option);
    });
    const preselected = new URLSearchParams(location.search).get('produit');
    if (preselected) produitSelect.value = preselected;
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const produitLabel = produitSelect.options[produitSelect.selectedIndex].textContent;
    const subject = encodeURIComponent('Demande depuis le site');
    const body = encodeURIComponent(
      `Nom : ${data.get('nom')}\nE-mail : ${data.get('email')}\nProduit : ${produitLabel}\n\n${data.get('message')}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });
}
