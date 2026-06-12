import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinsCottageTheWizardsHomeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin's Cottage",
    version: "The Wizard's Home",
    text: [
      {
        title: "KNOWLEDGE IS POWER",
        description: "Each player plays with the top card of their deck face up.",
      },
    ],
  },
  de: {
    name: "Merlins Hütte",
    version: "Das Haus des Zauberers",
    text: [
      {
        title: "WISSEN IST MACHT Alle Mitspielenden",
        description: "(auch du) spielen mit der obersten Karte ihres Decks offen.",
      },
    ],
  },
  fr: {
    name: "Chaumière de Merlin",
    version: "Foyer du sorcier",
    text: [
      {
        title: "LE SAVOIR, C'EST LE POUVOIR",
        description: "Chaque joueur joue avec la carte du dessus de sa pioche révélée.",
      },
    ],
  },
  it: {
    name: "Casetta di Merlino",
    version: "La Casa del Mago",
    text: [
      {
        title: "LA CONOSCENZA È POTERE",
        description: "Ogni giocatore gioca con la prima carta del suo mazzo a faccia in su.",
      },
    ],
  },
};
