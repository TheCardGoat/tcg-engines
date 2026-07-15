import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tritonYoungPrinceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Triton",
    version: "Young Prince",
    text: [
      {
        title: "SUPERIOR SWIMMER",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
      {
        title: "KEEPER OF ATLANTICA",
        description:
          "Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Triton",
    version: "Junger Prinz",
    text: [
      {
        title: "Hervorragender Schwimmer",
        description:
          "In deinem Zug erhält dieser Charakter <Wendig>. (Er kann Charaktere mit Wendig herausfordern.)",
      },
      {
        title: "Wächter von Atlantica",
        description:
          "Jedes Mal, wenn einer deiner Orte verbannt wird, darfst du jenen verdeckt und erschöpft in deinen Tintenvorrat legen.",
      },
    ],
  },
  fr: {
    name: "Triton",
    version: "Jeune Prince",
    text: [
      {
        title: "Nageur exceptionnel",
        description:
          "Durant votre tour, ce personnage gagne <Insaisissable>. (Il peut défier les personnages avec Insaisissable.)",
      },
      {
        title: "Gardien d'Atlantica",
        description:
          "Chaque fois que l'un de vos lieux est banni, vous pouvez le placer dans votre réserve d'encre, face cachée et épuisé.",
      },
    ],
  },
  it: {
    name: "Tritone",
    version: "Giovane Principe",
    text: [
      {
        title: "Nuotatore Provetto",
        description:
          "Durante il tuo turno, questo personaggio ottiene <Sfuggente>. (Può sfidare altri personaggi con Sfuggente.)",
      },
      {
        title: "Custode di Atlantica",
        description:
          "Ogni volta che uno dei tuoi luoghi viene esiliato, puoi aggiungere quella carta al tuo calamaio, a faccia in giù e impegnata.",
      },
    ],
  },
};
