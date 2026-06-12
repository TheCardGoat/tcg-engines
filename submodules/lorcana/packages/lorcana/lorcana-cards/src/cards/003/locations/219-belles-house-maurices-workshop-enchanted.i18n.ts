import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bellesHouseMauricesWorkshopEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Belle's House",
    version: "Maurice's Workshop",
    text: [
      {
        title: "LABORATORY",
        description: "If you have a character here, you pay 1 {I} less to play items.",
      },
    ],
  },
  de: {
    name: "Belles Zuhause",
    version: "Maurices Werkstatt",
    text: [
      {
        title: "LABORATORIUM",
        description:
          "Solange du mindestens einen Charakter an diesem Ort hast, zahlst du 1 weniger, um Gegenstände auszuspielen.",
      },
    ],
  },
  fr: {
    name: "La maison de Belle",
    version: "Atelier de Maurice",
    text: [
      {
        title: "LABORATOIRE",
        description:
          "Tant que vous avez au moins un personnage sur ce lieu, les objets vous coûtent 1 de moins.",
      },
    ],
  },
  it: {
    name: "Casa di Belle",
    version: "Officina di Maurice",
    text: [
      {
        title: "LABORATORIO",
        description:
          "Mentre hai uno o più personaggi in questo luogo, paga 1 in meno per giocare gli oggetti.",
      },
    ],
  },
};
