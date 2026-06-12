import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ratiganRagingRatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ratigan",
    version: "Raging Rat",
    text: [
      {
        title: "NOTHING CAN STAND IN MY WAY",
        description: "While this character has damage, he gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Rattenzahn",
    version: "Rasende Ratte",
    text: [
      {
        title: "NICHTS WIRD SICH MIR IN DEN WEG STELLEN",
        description: "Solange dieser Charakter beschädigt ist, erhält er +2.",
      },
    ],
  },
  fr: {
    name: "Ratigan",
    version: "Rat enragé",
    text: [
      {
        title: "RIEN NE ME RÉSISTERA",
        description: "Tant que ce personnage a au moins un dommage sur lui, il gagne +2.",
      },
    ],
  },
  it: {
    name: "Rattigan",
    version: "Ratto Rabbioso",
    text: [
      {
        title: "NESSUNO PUÒ METTERMI I BASTONI TRA LE RUOTE",
        description: "Mentre questo personaggio ha danno, riceve +2.",
      },
    ],
  },
};
