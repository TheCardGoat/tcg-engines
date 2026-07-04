import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const grammaTalaSpiritOfTheOceanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gramma Tala",
    version: "Spirit of the Ocean",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "DO YOU KNOW WHO YOU ARE?",
        description: "Whenever a card is put into your inkwell, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Gramma Tala",
    version: "Geist des Ozeans",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Gramma-Tala-Charaktere auszuspielen.)",
      },
      {
        title: "Weißt du, wer du bist?",
        description:
          "Jedes Mal, wenn eine Karte in deinen Tintenvorrat gelegt wird, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Grand-mère Tala",
    version: "Esprit de l'océan",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Grand-mère Tala.)",
      },
      {
        title: "Sais-tu qui tu es?",
        description:
          "Chaque fois qu'une carte est placée dans votre réserve d'encre, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Nonna Tala",
    version: "Spirito dell'Oceano",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Nonna Tala.)",
      },
      {
        title: "Può Rivelarti Solo il Tuo Cuore Chi Tu Sia",
        description: "Ogni volta che una carta vene aggiunta al tuo calamaio, ottieni 1 leggenda.",
      },
    ],
  },
};
