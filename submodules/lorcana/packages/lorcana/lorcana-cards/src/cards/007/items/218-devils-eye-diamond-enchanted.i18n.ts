import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const devilsEyeDiamondEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Devil's Eye Diamond",
    text: [
      {
        title: "THE PRICE OF POWER",
        description: "{E} — If one of your characters was damaged this turn, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Teufelsaugen Diamant",
    text: [
      {
        title: "DER PREIS DER MACHT",
        description:
          "— Falls einer deiner Charaktere in diesem Zug Schaden erhalten hat, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Le Diamant Œil-du-Diable",
    text: [
      {
        title: "LE PRIX DU POUVOIR",
        description:
          "— Si l'un de vos personnages s'est vu infliger des dommages ce tour-ci, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Diamante Occhio del Diavolo",
    text: [
      {
        title: "IL PREZZO DEL POTERE",
        description:
          "— Se uno dei tuoi personaggi è stato danneggiato in questo turno, ottieni 1 leggenda.",
      },
    ],
  },
};
