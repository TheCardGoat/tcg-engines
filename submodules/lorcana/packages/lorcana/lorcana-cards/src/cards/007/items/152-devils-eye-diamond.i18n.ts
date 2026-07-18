import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const devilsEyeDiamondI18n: Record<Languages, I18nProperties> = {
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
        title: "Der Preis der Macht",
        description:
          "{E} — Falls einer deiner Charaktere in diesem Zug Schaden erhalten hat, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Le Diamant Œil-du-Diable",
    text: [
      {
        title: "Le prix du pouvoir",
        description:
          "{E} — Si l'un de vos personnages a subi au moins un dommage ce tour-ci, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Diamante Occhio del Diavolo",
    text: [
      {
        title: "Il Prezzo del Potere",
        description:
          "{E} — Se uno dei tuoi personaggi ha subito danno in questo turno, ottieni 1 leggenda.",
      },
    ],
  },
  es: {
    name: "Diamante ojo del diablo",
    text: [
      {
        title: "EL PRECIO DEL PODER",
        description:
          "{E}: si uno de tus personajes resultó dañado este turno, gana 1 conocimiento.",
      },
    ],
  },
};
