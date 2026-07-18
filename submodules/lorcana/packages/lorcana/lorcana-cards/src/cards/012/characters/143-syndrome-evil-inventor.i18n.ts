import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const syndromeEvilInventorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Syndrome",
    version: "Evil Inventor",
    text: [
      {
        title: "Alert",
        description: "(This character can challenge as if they had Evasive.)",
      },
    ],
  },
  de: {
    name: "Syndrom",
    version: "Böser Erfinder",
    text: "<Alarmiert> (Dieser Charakter kann herausfordern, als hätte er Wendig.)",
  },
  fr: {
    name: "Syndrome",
    version: "Inventeur machiavélique",
    text: "<Agilité> (Ce personnage peut défier comme s'il avait Insaisissable.)",
  },
  it: {
    name: "Sindrome",
    version: "Inventore Malvagio",
    text: "<Vigile> (Questo personaggio può sfidare come se avesse Sfuggente.)",
  },
  es: {
    name: "Síndrome",
    version: "Inventor malvado",
    text: [
      {
        title: "Alerta",
        description: "(Este personaje puede desafiar como si tuviera Evasivo).",
      },
    ],
  },
};
