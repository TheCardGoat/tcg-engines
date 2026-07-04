import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const buzzLightyearGroundedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Buzz Lightyear",
    version: "Grounded",
    text: [
      {
        title: "Not a Flying Toy",
        description: "This character can't gain <Evasive>.",
      },
    ],
  },
  de: {
    name: "Buzz Lightyear",
    version: "Geerdet",
    text: [
      {
        title: "Kein fliegendes Spielzeug",
        description: "Dieser Charakter kann <Wendig> nicht erhalten.",
      },
    ],
  },
  fr: {
    name: "Buzz l'Éclair",
    version: "Cloué au sol",
    text: [
      {
        title: "Ce jouet ne vole pas",
        description: "Ce personnage ne peut pas gagner <Insaisissable>.",
      },
    ],
  },
  it: {
    name: "Buzz Lightyear",
    version: "Bloccato a Terra",
    text: [
      {
        title: "Non È un Giocattolo Volante",
        description: "Questo personaggio non può ottenere <Sfuggente>.",
      },
    ],
  },
};
