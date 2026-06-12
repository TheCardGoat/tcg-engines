import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sourBillSurlyHenchmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sour Bill",
    version: "Surly Henchman",
    text: [
      {
        title: "UNPALATABLE",
        description:
          "When you play this character, chosen opposing character gets -2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Saurer Drops",
    version: "Mürrischer Handlanger",
    text: [
      {
        title: "UNGENIESSBAR",
        description:
          "Wenn du diesen Charakter ausspielst, gib einem gegnerischen Charakter deiner Wahl in diesem Zug -2.",
      },
    ],
  },
  fr: {
    name: "Aigre Bill",
    version: "Acolyte maussade",
    text: [
      {
        title: "INDIGESTE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Aspro Bill",
    version: "Braccio Destro Scorbutico",
    text: [
      {
        title: "IMMANGIABILE",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta riceve -2 per questo turno.",
      },
    ],
  },
};
