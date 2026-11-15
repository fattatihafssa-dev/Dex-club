
// =============================================================
// main.js — l'ÉTAT de l'application et les ÉCOUTEURS
// Le chemin d'une action est toujours le même :
//   1. l'écouteur reçoit l'action
//   2. on met à jour `state` avec une fonction de données (cards.js / cart.js)
//   3. on redessine la page avec refresh()
// =============================================================

import { cards } from "../data.js";
import * as dataCards from "./cards.js";
import * as dataCart from "./cart.js";
import * as ui from "./ui.js";

// ---------- L'état : la seule source de vérité ----------
const state = {
  cards: [...cards],                        // copie : data.js n'est jamais modifié
  filters: { term: "", type: "Tous" },
  sort: "numero",                           // palier 3
  cart: []                                  // [{ id, quantite }]
};

// ---------- Les éléments de la page ----------
const searchInput = document.querySelector("#search");
const typesBox = document.querySelector("#types");
const grid = document.querySelector("#grid");
const cartList = document.querySelector("#cart-list");
const sortSelect = document.querySelector("#sort");
const form = document.querySelector("#card-form");

// ---------- Redessiner la page à partir de l'état ----------
function refresh() {
    // 1. Filtrer les cartes selon le type et la recherche
    const filtered = dataCards.getVisibleCards(
        state.cards,
        state.filters
    );

    // 2. Trier les cartes filtrées
    const visible = dataCards.sortCards(filtered, state.sort);

    // 3. Afficher les types, le compteur et les cartes
    ui.renderTypes(
        dataCards.countByType(state.cards),
        state.filters.type
    );

    ui.renderCount(visible.length);
    ui.renderGrid(visible, state.cart);

    // 4. Afficher le panier et ses totaux
    ui.renderCart(
        state.cart,
        state.cards,
        dataCart.cartTotal(state.cart, state.cards),
        dataCart.cartCount(state.cart)
    );
}

// =============================================================
// PALIER 1
// =============================================================

// Recherche : à chaque frappe
searchInput.addEventListener("input", () => {
    state.filters.term = searchInput.value;
    refresh();
});

// Types : UN SEUL écouteur sur #types (délégation)
typesBox.addEventListener("click", (event) => {
    // 1. Retrouvez le bouton cliqué
    const button = event.target.closest("[data-type]");

    // 2. Si on a cliqué à côté d'un bouton, on s'arrête
    if (!button) return;

    // 3. Mettre à jour le type choisi et rafraîchir
    state.filters.type = button.dataset.type;
    refresh();
});

// Grille : UN SEUL écouteur sur #grid (délégation)
grid.addEventListener("click", (event) => {

    // PALIER 2 — bouton « Ajouter »
    // On vérifie d'abord si le bouton Ajouter a été cliqué
    const addButton = event.target.closest("[data-add]");

    if (addButton) {
        state.cart = dataCart.addToCart(
            state.cart,
            Number(addButton.dataset.add),
            state.cards
        );

        refresh();
        return;
    }

    // PALIER 1 — fiche de la carte
    // 1. Retrouver la carte cliquée
    const cardEl = event.target.closest(".card");

    if (!cardEl) return;

    // 2. Retrouver la carte dans les données
    const card = dataCart.findCard(
        state.cards,
        Number(cardEl.dataset.id)
    );

    // 3. Afficher la fiche
    if (card) {
        ui.renderDetail(card);
    }
});

// =============================================================
// PALIER 2
// =============================================================

// Panier : UN SEUL écouteur sur #cart-list (délégation)
cartList.addEventListener("click", (event) => {

    // 1. Retrouver le bouton cliqué
    const button = event.target.closest("[data-action]");

    if (!button) return;

    // 2. Retrouver la ligne du panier
    const cartLine = button.closest(".cart-line");

    if (!cartLine) return;

    const id = Number(cartLine.dataset.id);
    const action = button.dataset.action;

    // 3. Selon l'action : augmenter, diminuer ou supprimer
    if (action === "plus") {
        state.cart = dataCart.changeQuantity(
            state.cart, id, 1, state.cards
        );
    }

    else if (action === "minus") {
        state.cart = dataCart.changeQuantity(
            state.cart, id, -1, state.cards
        );
    }

    else if (action === "remove") {
        state.cart = dataCart.removeFromCart(
            state.cart, id
        );
    }

    // 4. Rafraîchir la page
    refresh();
});

// =============================================================
// PALIER 3 (bonus)
// =============================================================

// Tri : écouter le changement du menu déroulant
sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    refresh();
});

// Formulaire : proposer une nouvelle carte
form.addEventListener("submit", (event) => {
    // TODO 1. event.preventDefault()
    // TODO 2. Lisez les champs : { nom, prix, stock, type, rarete }
    // TODO 3. const errors = dataCards.validateCardForm(data) ; ui.showFormErrors(errors)
    // TODO 4. Aucune erreur (Object.keys(errors).length === 0) :
    //         state.cards = dataCards.addCard(state.cards, data) ; form.reset() ; refresh()
});

// ---------- Démarrage ----------
refresh();

// ---------- Pour tester vos fonctions dans la console ----------
// Exemple : dex.searchCards(dex.cards, "kit")   ou   dex.addToCart([], 1, dex.cards)
window.dex = { cards, state, ...dataCards, ...dataCart };
