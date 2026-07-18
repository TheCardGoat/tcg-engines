import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const snowWhiteWellWisherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Snow White",
    version: "Well Wisher",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "WISHES COME TRUE",
        description:
          "Whenever this character quests, you may return a character card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Schneewittchen",
    version: "Am Wunschbrunnen",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Schneewittchen-Charaktere auszuspielen.)",
      },
      {
        title: "Euer Wunsch wird gewährt",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du eine Charakterkarte aus deinem Ablagestapel zurück auf deine Hand nehmen.",
      },
    ],
  },
  fr: {
    name: "Blanche-Neige",
    version: "Fait un vœu",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Blanche-Neige.)",
      },
      {
        title: "Mes vœux se réalisent",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, vous pouvez reprendre en main une carte personnage de votre défausse.",
      },
    ],
  },
  it: {
    name: "Snow White",
    version: "Well Wisher",
    text: [
      {
        title:
          "<Shift> 4 (You may pay 4 {I} to play this on top of one of your characters named Snow White.)",
      },
      {
        title: "Wishes Come True",
        description:
          "Whenever this character quests, you may return a character card from your discard to your hand.",
      },
    ],
  },
  es: {
    name: "Blanco como la nieve",
    version: "Bien deseoso",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "LOS DESEOS SE HACEN REALIDAD",
        description:
          "Siempre que este personaje realice una misión, puedes devolver una carta de personaje de tu descarte a tu mano.",
      },
    ],
  },
};
