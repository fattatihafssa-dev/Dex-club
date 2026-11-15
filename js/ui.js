// =============================================================
// ui.js — fonctions d'AFFICHAGE
// Elles reçoivent des données et modifient la page. Elles ne changent jamais les données.
// Utilisez createElement, textContent, classList, setAttribute / dataset, append.
// (Pas de innerHTML avec des données : seulement innerHTML = "" pour vider une zone.)
// =============================================================

const typesBox = document.querySelector("#types");
const grid = document.querySelector("#grid");
const count = document.querySelector("#count");
const detail = document.querySelector("#detail");
const cartList = document.querySelector("#cart-list");
const cartCountEl = document.querySelector("#cart-count");
const cartTotalEl = document.querySelector("#cart-total");
const statsBox = document.querySelector("#stats");

// -------------------------------------------------------------
// Petites aides (déjà écrites, utilisez-les)
// -------------------------------------------------------------

/** 1 → "#001" */
export const formatNumero = (id) => "#" + String(id).padStart(3, "0");

/** 12 → "12 DH" */
export const formatPrix = (prix) => prix + " DH";

/** "Électrik" → "type-electrik" (la classe CSS de couleur du type) */
export const typeClass = (type) =>
  "type-" + type.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Crée un élément avec une classe et un texte : el("p", "card__num", "#001") */
export function el(tag, className = "", text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== "") element.textContent = text;
  return element;
}

// -------------------------------------------------------------
// PALIER 1
// -------------------------------------------------------------

/**
 * Affiche les boutons de type dans #types.
 * counts = { Feu: 3, Eau: 3, … } (résultat de countByType) ; activeType = "Tous" ou un type.
 * Modèle d'un bouton :
 *   <button class="type-btn is-active" type="button" data-type="Feu">Feu (3)</button>
 * Le premier bouton est « Tous (12) » avec data-type="Tous" (12 = la somme des compteurs).
 * Seul le bouton du type actif a la classe is-active.
 */
export function renderTypes(counts, activeType) {
  typesBox.innerHTML = "";
  const total = Object.values(counts).reduce( 
    (sum , number)  => sum + number,
    0
  );

     const allButton = el(
      "button",
        "type-btn",
        `Tous (${total})`
    );

      allButton.type = "button";
      allButton.dataset.type = "Tous";

      if (activeType === "Tous") {
        allButton.classList.add("is-active");

      }

      typesBox.append(allButton);

      for (const type in counts ) {
        const button = el(
          "button",
            "type-btn",
            `${type} (${counts[type]})`
        ); 

            button.type = "button";
            button.dataset.type = type ;
            
            if(activeType === type ) {

              button.classList.add("is-active")

            }
            typesBox.append(button);
          }
}
 // TODO 1. Videz #types
  // TODO 2. Créez le bouton « Tous (…) »
  // TODO 3. Pour chaque type de counts (for...in ou Object.keys), créez un bouton


/**
 * Affiche le nombre de cartes visibles dans #count : "5 cartes", "1 carte" ou "Aucune carte".
 */
export function renderCount(n) {
  if(n === 0) {
    count.textContent = "Auncune carte";
  } else if (n === 1) {
     count.textContent = "1 carte";
    } else {
        count.textContent = `${n} cartes`;
    }
}

/**
 * Affiche les cartes dans #grid.
 * list = les cartes à afficher ; cart = le panier (pour la classe is-selected, palier 2).
 * Si list est vide : un <p class="empty">Aucune carte trouvée</p>.
 * Modèle d'une carte :
 *   <article class="card" data-id="1">
 *     <img class="card__img" src="images/emberkit.svg" alt="Emberkit">
 *     <p class="card__num">#001</p>
 *     <h3 class="card__name">Emberkit</h3>
 *     <p class="card__meta"><span class="badge type-feu">Feu</span> <span class="rarity">Commune</span></p>
 *     <p class="card__price">12 DH</p>
 *     <button class="btn btn--primary" type="button" data-add="1">Ajouter</button>
 *   </article>
 * - stock 0 : classe out-of-stock sur l'article ET bouton désactivé (disabled = true)
 * - palier 2 : classe is-selected si la carte est dans le panier (cart.some(...))
 */
export function renderGrid(list, cart) {
  grid.inner = "";
  if(list.length === 0) {
    const message = el ("p","empty","Aucune carte trouvée");
    grid.append(message);
    return ;
  }
       for ( const card of list) {
        const article = el("article","card");
        article.dataset.id =card.id;

       const image = el("img", "card__img");
        image.src = card.image;
        image.alt = card.nom;

        const numero = el("p", "card__num", formatNumero(card.id));

        const name = el("h3", "card__name", card.nom);

        const meta = el("p", "card__meta");

        const badge = el("span", `badge ${typeClass(card.type)}`, card.type);
        const rarity = el("span", "rarity", card.rarete);

        meta.append(badge, rarity);

        const price = el("p", "card__price", formatPrix(card.prix));

        const button = el("button", "btn btn--primary", "Ajouter");
        button.type = "button";
        button.dataset.add = card.id;

        if (card.stock === 0) {
            article.classList.add("out-of-stock");
            button.disabled = true;
            button.textContent = "Rupture";
        }

        if (cart && cart.some(item => item.id === card.id)) {
            article.classList.add("is-selected");
        }

        article.append(image, numero, name, meta, price, button);

        grid.append(article);
    }
}
  // TODO 1. Videz #grid
  // TODO 2. Liste vide : ajoutez le message et arrêtez (return)
  // TODO 3. Pour chaque carte : créez l'article et ses enfants, puis grid.append(article)


/**
 * Affiche la fiche d'une carte dans #detail : image, nom (h3), numéro + badge du type,
 * description, puis une liste <dl> : Rareté, Prix, Stock (« Rupture » si 0).
 */
export function renderDetail(card) {
    if (!card) return ; 
    detail.innerHTML = "";

    const image = el("img","detail_img");
    image.scr = card.image;
    image.alt = card.nom;

    const name = el("h3","datail_name",card.nom);

    const meta = el("p", "detail__meta");

    const numero  = el("span","detail_num",formatNumero(card.id));
     const badge = el("span", `badge ${typeClass(card.type)}`, card.type);
      meta.append(numero, badge);

    const description = el(
        "p",
        "detail__description",
        card.description
    );

    const list = el("dl", "detail__list");

    const details = [
        ["Rareté", card.rarete],
        ["Prix", formatPrix(card.prix)],
        ["Stock", card.stock === 0 ? "Rupture" : card.stock]
    ];

    for (const [label, value] of details) {
        const term = el("dt", "", label);
        const definition = el("dd", "", String(value));

        list.append(term, definition);
    }

    detail.append(image, name, meta, description, list);
}




// -------------------------------------------------------------
// PALIER 2
// -------------------------------------------------------------

/**
 * Affiche le panier.
 * cart = [{ id, quantite }] ; cards = toutes les cartes (pour le nom, le prix, le stock).
 * Modèle d'une ligne :
 *   <li class="cart-line" data-id="1">
 *     <span class="cart-line__name">Emberkit</span>
 *     <button class="btn btn--small" type="button" data-action="minus">−</button>
 *     <span class="cart-line__qty">2</span>
 *     <button class="btn btn--small" type="button" data-action="plus">+</button>
 *     <button class="btn btn--small" type="button" data-action="remove">Retirer</button>
 *   </li>
 * - le bouton + est désactivé quand la quantité atteint le stock
 * - panier vide : <li class="empty">Votre panier est vide</li>
 * - #cart-count : "3 cartes" (ou "1 carte", "0 carte") ; #cart-total : "54 DH"
 *   → total et nbCards sont déjà calculés par main.js (cartTotal et cartCount de cart.js)
 * - pour le nom et le stock d'une ligne, retrouvez la carte dans cards avec find
 */
export function renderCart(cart, cards, total, nbCards) {
  // TODO
}

// -------------------------------------------------------------
// PALIER 3 (bonus)
// -------------------------------------------------------------

/**
 * Affiche les statistiques dans #stats : 4 blocs
 *   <div class="stat"><p class="stat__value">1 234 DH</p><p class="stat__label">Valeur du stock</p></div>
 */
export function renderStats(stats) {
  // TODO
}

/**
 * Affiche les erreurs du formulaire : errors = { nom: "…", prix: "…" }
 * Pour chaque champ (nom, prix, stock) : écrit le message dans [data-error-for="…"]
 * et ajoute ou retire la classe field-error sur le champ #form-….
 */
export function showFormErrors(errors) {
  // TODO
}
