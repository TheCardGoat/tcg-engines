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
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage adverse qui ne peut pas être envoyé à l'aventure durant son prochain tour. Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Efelanti e Noddole",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un personaggio avversario a tua scelta non può andare all'avventura durante il suo prossimo turno. Pesca una carta.",
      },
    ],
  },
  es: {
    name: "Heffalumps y Woozles",
    text: "El personaje contrario elegido no puede realizar misiones durante su próximo turno. Saca una carta.",
  },
};
