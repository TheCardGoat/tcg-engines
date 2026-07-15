import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const letTheStormRageOnI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Let the Storm Rage On",
    text: "Deal 2 damage to chosen character. Draw a card.",
  },
  de: {
    name: "Ein Sturm zieht auf",
    text: [
      {
        title: "Füge einem Charakter deiner Wahl 2 Schaden zu.",
      },
      {
        title: "Ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Perdue dans l'hiver",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez un personnage et infligez-lui 2 dommages. Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Ecco Qua la Tempesta",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Infliggi 2 danni a un personaggio a tua scelta. Pesca una carta.",
      },
    ],
  },
};
