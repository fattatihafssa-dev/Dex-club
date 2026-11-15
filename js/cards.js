
export function searchCards(cards, term) {
   const cleanTerm = term.trim().toLowerCase();
    if (!cleanTerm) {
      return [...cards];
    }
    return cards.filter(card =>
    card.nom.toLowerCase().includes(cleanTerm)
);
  }

export function filterByType(cards, type) {
   if(type === "Tous") {
    return [...cards];
   }
    
    return cards.filter(card => card.type === type);
}
 



 
export function getVisibleCards(cards, filters) {
  const typeFiltered = filterByType(cards,filters.type)
  const searchFilered = searchCards(typeFiltered , filters.term);

  return searchFilered;
}  
  



export function countByType(cards) {
    const counts = {};

    for (const card of cards) {
        if (!counts[card.type]) {
            counts[card.type] = 0;
        }

        counts[card.type]++;
    }

    return counts;
}
  
// -------------------------------------------------------------
// PALIER 3 (bonus)
// -------------------------------------------------------------

/**
 * Trie une COPIE des cartes.
 * sort vaut "numero" (id croissant), "prix-asc" ou "prix-desc".
 */
export function sortCards(cards, sort) {
  // TODO : [...cards].sort((a, b) => ...)
  return cards;
}

/**
 * Statistiques sur une liste de cartes.
 * Renvoie { valeurStock, plusChere, legendaires, ruptures }
 *   valeurStock : somme de prix × stock (en DH)
 *   plusChere   : la carte (l'objet) au prix le plus haut, ou null si la liste est vide
 *   legendaires : nombre de cartes de rareté "Légendaire"
 *   ruptures    : nombre de cartes dont le stock vaut 0
 */
export function getStats(cards) {
  // TODO : reduce pour la valeur, une boucle ou reduce pour la plus chère, filter(...).length pour compter
  return { valeurStock: 0, plusChere: null, legendaires: 0, ruptures: 0 };
}

/**
 * Vérifie les champs du formulaire « Proposer une carte ».
 * data = { nom: "Glacio", prix: "20", stock: "4" }   (les valeurs arrivent du formulaire, en texte)
 * Renvoie un objet avec un message par champ faux, ou {} si tout est juste :
 *   nom   vide (après trim)                    → "Le nom est obligatoire"
 *   prix  pas un nombre entier plus grand que 0 → "Le prix doit être un nombre plus grand que 0"
 *   stock pas un nombre entier de 0 ou plus     → "Le stock doit être un nombre entier (0 ou plus)"
 */
export function validateCardForm(data) {
  // TODO
  return {};
}

/**
 * Crée la nouvelle carte et renvoie un NOUVEAU tableau qui la contient.
 * id = le plus grand id existant + 1 ; prix et stock convertis en nombres ;
 * image = "images/nouvelle.svg" ; description = "Carte proposée par un membre du club."
 */
export function addCard(cards, data) {
  // TODO
  return cards;
}
