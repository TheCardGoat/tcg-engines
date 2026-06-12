import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const shenziScarsAccompliceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Shenzi",
    version: "Scar's Accomplice",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "EASY PICKINGS",
        description: "While challenging a damaged character, this character gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Shenzi",
    version: "Scars Komplizin",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "LEICHTE BEUTE",
        description:
          "Solange dieser Charakter einen beschädigten Charakter herausfordert, erhält er +2.",
      },
    ],
  },
  fr: {
    name: "Shenzi",
    version: "Complice de Scar",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "UN CASSE-CROÛTE FACILE",
        description:
          "Tant que ce personnage défie un personnage ayant au moins un dommage sur lui, il gagne +2.",
      },
    ],
  },
  it: {
    name: "Shenzi",
    version: "Complice di Scar",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "PREDE FACILI",
        description: "Mentre sfida un personaggio danneggiato, questo personaggio riceve +2.",
      },
    ],
  },
};
