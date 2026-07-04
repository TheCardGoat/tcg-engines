import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const captainHooksRapierI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Captain Hook's Rapier",
    text: [
      {
        title: "GET THOSE SCURVY BRATS!",
        description:
          "During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.",
      },
      {
        title: "LET'S HAVE AT IT!",
        description:
          "Your characters named Captain Hook gain Challenger +1. (They get +1 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Käpt'n Hooks Degen",
    text: [
      {
        title: "Fangt diese Teufelsbraten wieder ein!",
        description:
          "Jedes Mal, wenn einer deiner Charaktere in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, darfst du 1 {I} bezahlen, um 1 Karte zu ziehen.",
      },
      {
        title: "Los geht's!",
        description:
          "Deine Käpt'n-Hook-Charaktere erhalten <Herausfordern> +1. (Während sie herausfordern, erhalten sie +1 {S}.)",
      },
    ],
  },
  fr: {
    name: "Rapière du Capitaine Crochet",
    text: [
      {
        title: "Rattrapez ces immondes gamins!",
        description:
          "Chaque fois que l'un de vos personnages en bannit un autre via un défi durant votre tour, vous pouvez payer 1 {I} pour piocher une carte.",
      },
      {
        title: "À l'attaque!",
        description:
          "Vos personnages Capitaine Crochet gagnent <Offensif> + 1. (Lorsqu'ils défient, ces personnages gagnent +1 {S}.)",
      },
    ],
  },
  it: {
    name: "Stocco di Capitan Uncino",
    text: [
      {
        title: "Inseguiteli, Presto!",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi personaggi esilia un altro personaggio in una sfida, puoi pagare 1 {I} per pescare una carta.",
      },
      {
        title: "Incominciamo!",
        description:
          "I tuoi personaggi chiamati Capitan Uncino ottengono <Sfidante> +1. (Ricevono +1 {S} mentre stanno sfidando.)",
      },
    ],
  },
};
