// Filtres et tri de la page Produits.
(function () {
  const params = new URLSearchParams(location.search);
  const selCategorie = document.getElementById('filter-categorie');
  const selMarque = document.getElementById('filter-marque');
  const rangePrix = document.getElementById('filter-prix');
  const prixVal = document.getElementById('prix-val');
  const selTri = document.getElementById('tri');
  const liste = document.getElementById('liste');
  const compteur = document.getElementById('compteur');

  let produits = [];

  function uniques(key) {
    return [...new Set(produits.map((p) => p[key]))].filter(Boolean).sort();
  }

  function remplirSelect(select, valeurs) {
    select.insertAdjacentHTML(
      'beforeend',
      valeurs.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('')
    );
  }

  function appliquerFiltres() {
    const categorie = selCategorie.value;
    const marque = selMarque.value;
    const prixMax = Number(rangePrix.value);
    prixVal.textContent = prixMax.toLocaleString('fr-FR') + ' €';

    let resultat = produits.filter((p) =>
      (!categorie || p.categorie === categorie) &&
      (!marque || p.marque === marque) &&
      p.prix <= prixMax
    );

    if (selTri.value === 'prix-asc') resultat.sort((a, b) => a.prix - b.prix);
    if (selTri.value === 'prix-desc') resultat.sort((a, b) => b.prix - a.prix);

    compteur.textContent = `${resultat.length} produit(s)`;
    liste.innerHTML = resultat.length
      ? resultat.map(productCard).join('')
      : '<p class="muted">Aucun produit ne correspond à ces critères.</p>';
  }

  loadProducts()
    .then((list) => {
      produits = list;
      remplirSelect(selCategorie, uniques('categorie'));
      remplirSelect(selMarque, uniques('marque'));

      const max = Math.ceil(Math.max(...produits.map((p) => p.prix)) / 10) * 10;
      rangePrix.max = max;
      rangePrix.value = max;

      const categorieUrl = params.get('categorie');
      if (categorieUrl) selCategorie.value = categorieUrl;

      [selCategorie, selMarque, rangePrix, selTri].forEach((el) =>
        el.addEventListener('input', appliquerFiltres)
      );
      appliquerFiltres();
    })
    .catch(() => {
      liste.innerHTML = '<p class="muted">Produits indisponibles pour le moment.</p>';
    });
})();
