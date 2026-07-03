import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const thisGrowingPressureI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "This Growing Pressure",
    text: "Chosen opposing character can't challenge and must quest during their next turn if able. Draw a card.",
  },
  de: {
    name: "Den Druck besiegen",
    text: "Wähle einen gegnerischen Charakter. Er kann in seinem nächsten Zug nicht herausfordern und muss erkunden, wenn möglich. Ziehe 1 Karte.",
  },
  fr: {
    name: "L’énorme pression",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage adverse qui ne peut pas défier et doit être envoyé à l'aventure durant son prochain tour, si possible. Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Il Peso Enorme",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un personaggio avversario a tua scelta non può sfidare e deve andare all'avventura durante il suo prossimo turno, se possibile. Pesca una carta.",
      },
    ],
  },
};
