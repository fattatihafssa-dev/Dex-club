
// =============================================================
// cart.js — fonctions de DONNÉES du panier
// Le panier est un tableau : [{ id: 3, quantite: 2 }, ...]
// Aucune manipulation du DOM dans ce fichier.
// Chaque fonction renvoie un nouveau tableau.
// =============================================================

/**
 * Retrouve une carte par son id.
 * Renvoie l'objet carte, ou undefined.
 */
export function findCard(cards, id) {
    return cards.find(card => card.id === id);
}

/**
 * Ajoute une carte au panier.
 * - Si elle existe déjà : augmente sa quantité de 1.
 * - Si le stock est atteint : panier inchangé.
 * - Si elle n'existe pas : ajoute { id, quantite: 1 }.
 */
export function addToCart(cart, id, cards) {
    const card = findCard(cards, id);

    if (!card || card.stock === 0) {
        return [...cart];
    }

    const existingLine = cart.find(line => line.id === id);

    if (existingLine) {
        if (existingLine.quantite < card.stock) {
            return cart.map(line =>
                line.id === id
                    ? { ...line, quantite: line.quantite + 1 }
                    : line
            );
        }

        return [...cart];
    }

    return [...cart, { id: id, quantite: 1 }];
}

/**
 * Change la quantité d'une ligne de delta (+1 ou -1).
 * - Ne dépasse jamais le stock.
 * - Retire la ligne si la quantité atteint 0.
 */
export function changeQuantity(cart, id, delta, cards) {
    const card = findCard(cards, id);
    const line = cart.find(item => item.id === id);

    if (!card || !line) {
        return [...cart];
    }

    const newQuantity = line.quantite + delta;

    if (newQuantity <= 0) {
        return removeFromCart(cart, id);
    }

    if (newQuantity > card.stock) {
        return [...cart];
    }

    return cart.map(item =>
        item.id === id
            ? { ...item, quantite: newQuantity }
            : item
    );
}

/**
 * Retire une carte du panier.
 */
export function removeFromCart(cart, id) {
    return cart.filter(line => line.id !== id);
}

/**
 * Calcule le nombre total de cartes dans le panier.
 */
export function cartCount(cart) {
    return cart.reduce((total, line) => total + line.quantite, 0);
}

/**
 * Calcule le prix total du panier en DH.
 */
export function cartTotal(cart, cards) {
    return cart.reduce((total, line) => {
        const card = findCard(cards, line.id);

        if (!card) {
            return total;
        }

        return total + line.quantite * card.prix;
    }, 0);
}
