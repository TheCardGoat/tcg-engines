import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lostInTheWoodsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lost in the Woods",
    text: "All opposing characters get -2 {S} until the start of your next turn.",
  },
  de: {
    name: "Verlassen im Wald",
    text: "Gib allen gegnerischen Charakteren bis zu Beginn deines nächsten Zuges -2.",
  },
  fr: {
    name: "J'ai perdu le Nord",
    text: "Tous les personnages adverses subissent -2 jusqu'au début de votre prochain tour.",
  },
  it: {
    name: "Perso Quaggiù",
    text: "(Un personaggio con costo 4 o superiore può per cantare questa canzone gratis.) Tutti i personaggi avversari ricevono -2 fino all'inizio del tuo prossimo turno.",
  },
};
