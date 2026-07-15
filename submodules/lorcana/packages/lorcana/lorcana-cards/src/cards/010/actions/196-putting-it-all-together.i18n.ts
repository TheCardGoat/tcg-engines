import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const puttingItAllTogetherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Putting It All Together",
    text: "Chosen opposing character can't challenge during their next turn. Draw a card.",
  },
  de: {
    name: "Alles zusammenfügen",
    text: "Wähle einen gegnerischen Charakter. Er kann in seinem nächsten Zug nicht herausfordern. Ziehe 1 Karte.",
  },
  fr: {
    name: "Rassembler les indices",
    text: "Choisissez un personnage adverse qui ne peut pas défier lors de son prochain tour. Piochez une carte.",
  },
  it: {
    name: "Unire gli Indizi",
    text: "Un personaggio avversario a tua scelta non può sfidare durante il suo prossimo turno. Pesca una carta.",
  },
};
