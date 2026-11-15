// Fonctions communes à toutes les pages.
// À modifier : l'adresse e-mail de contact.
const CONTACT_EMAIL = 'contact@exemple.fr';

const BASE = document.body.dataset.base || '';
const EUR = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
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
      <div class="product-img">${escapeHtml(p.categorie)}</div>
      <div class="product-body">
        <p class="product-meta">${escapeHtml(p.marque)} · ${escapeHtml(p.categorie)}</p>
        <h3>${escapeHtml(p.nom)}</h3>
        <p class="product-desc">${escapeHtml(p.description)}</p>
        <div class="product-foot">
          <span class="price">${EUR.format(p.prix)}</span>
          ${badge}
        </div>
        <a class="btn btn-small" href="${BASE}pages/contact.html?produit=${encodeURIComponent(p.id)}">Demander ce produit</a>
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
