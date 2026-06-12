import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const razoulPalaceGuardI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Razoul",
    version: "Palace Guard",
    text: [
      {
        title: "LOOKY HERE",
        description: "While this character has no damage, he gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Rasul",
    version: "Palastwache",
    text: [
      {
        title: "SEHT EUCH DAS AN",
        description: "Solange dieser Charakter unbeschädigt ist, erhält er +2.",
      },
    ],
  },
  fr: {
    name: "Razoul",
    version: "Garde du palais",
    text: [
      {
        title: "REGARDEZ",
        description: "Tant que ce personnage n'a aucun jeton Dommage sur lui, il gagne +2.",
      },
    ],
  },
  it: {
    name: "Razoul",
    version: "Guardia di Palazzo",
    text: [
      {
        title: "GUARDATE UN PO'",
        description: "Mentre questo personaggio non ha danno, riceve +2.",
      },
    ],
  },
};
