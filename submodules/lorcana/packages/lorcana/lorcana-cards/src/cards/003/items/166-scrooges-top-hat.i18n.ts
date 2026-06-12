import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroogesTopHatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrooge's Top Hat",
    text: [
      {
        title: "BUSINESS EXPERTISE",
        description: "{E} — You pay 1 {I} less for the next item you play this turn.",
      },
    ],
  },
  de: {
    name: "Dagoberts Zylinder",
    text: [
      {
        title: "WIRTSCHAFTLICHES FACHWISSEN",
        description:
          "— Du zahlst 1 weniger für den nächsten Gegenstand, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Haut-de-forme de Picsou",
    text: [
      {
        title: "SENS DES AFFAIRES",
        description: "— Le prochain objet que vous jouez durant ce tour vous coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Cilindro di Paperone",
    text: [
      {
        title: "ESPERIENZA NEGLI AFFARI",
        description: "— Paga 1 in meno per giocare il tuo prossimo oggetto per questo turno.",
      },
    ],
  },
};
