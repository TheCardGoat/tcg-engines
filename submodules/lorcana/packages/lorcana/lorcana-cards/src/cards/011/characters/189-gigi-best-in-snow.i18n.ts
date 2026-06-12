import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gigiBestInSnowI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gigi",
    version: "Best in Snow",
    text: [
      {
        title: "Alert",
        description: "(This character can challenge as if they had Evasive.)",
      },
      {
        title: "SO PRETTY",
        description: "While this character has no damage, she gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Gigi",
    version: "Die Beste im Schnee",
    text: [
      {
        title: "Alarmiert",
        description: "(Dieser Charakter kann herausfordern, als hätte er Wendig.)",
      },
      {
        title: "SO HÜBSCH",
        description: "Solange dieser Charakter unbeschädigt ist, erhält er +2.",
      },
    ],
  },
  fr: {
    name: "Gigi",
    version: "Premier prix de la neige",
    text: [
      {
        title: "Agilité (Ce personnage peut défier comme s'il était Insaisissable.)",
      },
      {
        title: "SI MIGNONNE",
        description: "Tant que ce personnage n'a aucun dommage sur lui, il gagne +2.",
      },
    ],
  },
  it: {
    name: "Gigi",
    version: "La Migliore sulla Neve",
    text: [
      {
        title: "Vigile",
        description: "(Questo personaggio può sfidare come se avesse Sfuggente.)",
      },
      {
        title: "COSÌ CARINA",
        description: "Mentre questo personaggio non ha danno, riceve +2.",
      },
    ],
  },
};
