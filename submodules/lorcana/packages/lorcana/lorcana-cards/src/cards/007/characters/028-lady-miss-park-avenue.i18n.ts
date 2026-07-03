import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ladyMissParkAvenueI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lady",
    version: "Miss Park Avenue",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "SOMETHING WONDERFUL",
        description:
          "When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Susi",
    version: "Miss Welt",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Susi-Charaktere auszuspielen.)",
      },
      {
        title: "Was Wunderschönes",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du bis zu 2 Charakterkarten mit Kosten von 2 oder weniger aus deinem Ablagestapel zurück auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Lady",
    version: "Princesse Fanfreluche",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Lady.)",
      },
      {
        title: "Un truc merveilleux",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez renvoyer jusqu'à 2 cartes Personnage coûtant 2 ou moins de votre défausse dans votre main.",
      },
    ],
  },
  it: {
    name: "Lilli",
    version: "Miss Parioli",
    text: [
      {
        title:
          "<Trasformazione> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Lilli.)",
      },
      {
        title: "Qualcosa di Magnifico",
        description:
          "Quando giochi questo personaggio, puoi riprendere in mano fino a 2 carte personaggio con costo 2 o inferiore ciascuno dai tuoi scarti.",
      },
    ],
  },
};
