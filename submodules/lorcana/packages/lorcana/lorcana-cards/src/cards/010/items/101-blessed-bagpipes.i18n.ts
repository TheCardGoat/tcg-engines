import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const blessedBagpipesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Blessed Bagpipes",
    text: [
      {
        title: "MCDUCK HEIRLOOM",
        description:
          "When you play this item, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
      },
      {
        title: "BATTLE ANTHEM",
        description:
          "Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Heiliger Dudelsack",
    text: [
      {
        title: "DUCK-ERBSTÜCK",
        description:
          "Wenn du diesen Gegenstand ausspielst, darfst du die oberste Karte deines Decks verdeckt unter einen deiner Charaktere oder Orte mit Stärken legen.",
      },
      {
        title: "SCHLACHTHYMNE",
        description:
          "Jedes Mal, wenn einer deiner Charaktere oder Orte, der eine Karte unter sich hat, herausgefordert wird, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Cornemuse bénie",
    text: [
      {
        title: "HÉRITAGE DES MAC PICSOU",
        description:
          "Lorsque vous jouez cet objet, vous pouvez placer la carte du dessus de votre pioche sous l'un de vos personnages ou de vos lieux ayant Boost.",
      },
      {
        title: "MUSIQUE DE BATAILLE",
        description:
          "Chaque fois que l'un de vos personnages ou de vos lieux avec une carte sous lui est défié, vous gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Cornamusa Fortunata",
    text: [
      {
        title: "CIMELIO DE' PAPERONI",
        description:
          "Quando giochi questo oggetto, puoi mettere la prima carta del tuo mazzo a faccia in giù sotto a uno dei tuoi personaggi o luoghi con Potenziamento.",
      },
      {
        title: "MARCIA DA GUERRA",
        description:
          "Ogni volta che uno dei tuoi personaggi o luoghi con una carta sotto di sé viene sfidato, ottieni 1 leggenda.",
      },
    ],
  },
};
