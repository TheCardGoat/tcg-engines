import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const heffalumpsAndWoozlesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Heffalumps and Woozles",
    text: "Chosen opposing character can't quest during their next turn. Draw a card.",
  },
  de: {
    name: "Heffalumps und Wusel",
    text: "Ein gegnerischer Charakter deiner Wahl kann in seinem nächsten Zug nicht erkunden. Ziehe 1 Karte.",
  },
  fr: {
    name: "Éfélants et Nouifs",
    text: "Choisissez un personnage adverse qui ne peut pas être envoyé à l'aventure durant son prochain tour. Piochez une carte.",
  },
  it: {
    name: "Efelanti e Noddole",
    text: "(Un personaggio con costo 2 o superiore può per cantare questa canzone gratis.) Un personaggio avversario a tua scelta non può andare all'avventura durante il suo prossimo turno. Pesca una carta.",
  },
};
