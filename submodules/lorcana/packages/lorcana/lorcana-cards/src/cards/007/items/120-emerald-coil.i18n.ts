import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const emeraldCoilI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Emerald Coil",
    text: [
      {
        title: "SHIMMERING WINGS",
        description:
          "During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Smaragd-Reif",
    text: [
      {
        title: "Schimmernde Flügel",
        description:
          "Jedes Mal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, erhält ein Charakter deiner Wahl bis zu Beginn deines nächsten Zuges <Wendig>.",
      },
    ],
  },
  fr: {
    name: "Spirale d’Émeraude",
    text: [
      {
        title: "Ailes chatoyantes",
        description:
          "Durant votre tour, chaque fois qu'une carte est placée dans votre réserve d'encre, choisissez un personnage qui gagne <Insaisissable> jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Spira di Smeraldo",
    text: [
      {
        title: "Ali Scintillanti",
        description:
          "Durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, un personaggio a tua scelta ottiene <Sfuggente> fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
  es: {
    name: "Bobina Esmeralda",
    text: [
      {
        title: "ALAS BRILLANTES",
        description:
          "Durante tu turno, cada vez que se pone una carta en tu tintero, el personaje elegido gana Evasivo hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
