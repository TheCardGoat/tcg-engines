import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theQueenCommandingPresenceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Queen",
    version: "Commanding Presence",
    text: [
      {
        title: "Shift 2",
      },
      {
        title: "WHO IS THE FAIREST?",
        description:
          "Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Die Königin",
    version: "Imposantes Auftreten",
    text: [
      {
        title:
          "<Gestaltwandel> 2 (Du kannst 2 {I} zahlen, um diesen Charakter auf einen deiner Die-Königin-Charaktere auszuspielen.)",
      },
      {
        title: "Wer ist die Schönste?",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du in diesem Zug einem gegnerischen Charakter deiner Wahl -4 {S} und einem Charakter deiner Wahl +4 {S} geben.",
      },
    ],
  },
  fr: {
    name: "La Reine",
    version: "Autorité naturelle",
    text: [
      {
        title:
          "<Alter> 2 (Vous pouvez payer 2 {I} pour jouer ce personnage sur l'un de vos personnages La Reine.)",
      },
      {
        title: "Qui est la plus belle?",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, choisissez un personnage qui gagne +4 {S} et un personnage adverse qui subit -4 {S}, pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "The Queen",
    version: "Commanding Presence",
    text: [
      {
        title:
          "<Shift> 2 (You may pay 2 {I} to play this on top of one of your characters named The Queen.)",
      },
      {
        title: "Who is the Fairest?",
        description:
          "Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
      },
    ],
  },
  es: {
    name: "La reina",
    version: "Presencia imponente",
    text: [
      {
        title: "Shift 2",
      },
      {
        title: "¿QUIÉN ES LA MÁS JUSTA?",
        description:
          "Siempre que este personaje realiza una misión, el personaje contrario elegido obtiene -4 {S} este turno y el personaje elegido obtiene +4 {S} este turno.",
      },
    ],
  },
};
