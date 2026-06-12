import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const daisyDuckSapphireChampionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Daisy Duck",
    version: "Sapphire Champion",
    text: [
      {
        title: "STAND FAST",
        description: "Your other Sapphire characters gain Resist +1.",
      },
      {
        title: "LOOK AHEAD",
        description:
          "Whenever one of your other Sapphire characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      },
    ],
  },
  de: {
    name: "Daisy Duck",
    version: "Saphir-Champion",
    text: [
      {
        title: "BLEIBT STANDHAFT",
        description:
          "Deine anderen Saphir-Charaktere erhalten Robust +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
      {
        title: "BLICKT NACH VORNE",
        description:
          "Jedes Mal, wenn einer deiner anderen Saphir-Charaktere erkundet, darfst du dir die oberste Karte deines Decks anschauen. Lege sie anschließend entweder auf dein Deck oder darunter.",
      },
    ],
  },
  fr: {
    name: "Daisy",
    version: "Championne Saphir",
    text: [
      {
        title: "TENIR FERME",
        description: "Vos autres personnages Saphir gagnent Résistance +1.",
      },
      {
        title: "ANTICIPER",
        description:
          "Chaque fois que l'un de vos autres personnages Saphir est envoyé à l'aventure, vous pouvez regarder la carte du dessus de votre pioche. Remettez-la soit sur le dessus de votre pioche, soit en dessous.",
      },
    ],
  },
  it: {
    name: "Paperina",
    version: "Campionessa di Zaffiro",
    text: [
      {
        title: "TENERE DURO I",
        description: "tuoi altri personaggi Zaffiro ottengono Resistere +1.",
      },
      {
        title: "GUARDARE AVANTI",
        description:
          "Ogni volta che uno dei tuoi altri personaggi Zaffiro va all'avventura, puoi guardare la prima carta del tuo mazzo. Mettila o in cima o in fondo al tuo mazzo.",
      },
    ],
  },
};
