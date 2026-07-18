import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const patchPlayfulPupP2ChallengeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Patch",
    version: "Playful Pup",
    text: [
      {
        title: "Ward",
      },
      {
        title: "PUPPY BARKING",
        description: "While you have another Puppy character in play, this character gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "Patch",
    version: "Verspielter Welpe",
    text: [
      {
        title: "<Behütet>",
      },
      {
        title: "Welpenbellen",
        description:
          "Solange du mindestens einen weiteren Welpen im Spiel hast, erhält dieser Charakter +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Patch",
    version: "Chiot joueur",
    text: [
      {
        title: "<Hors d'atteinte>",
      },
      {
        title: "Aboiements de chiot",
        description:
          "Tant que vous avez un autre personnage Chiot en jeu, ce personnage-ci gagne +1 {L}.",
      },
    ],
  },
  it: {
    name: "Macchia",
    version: "Cucciolo Giocherellone",
    text: [
      {
        title: "<Protetto>",
      },
      {
        title: "Latrato dei Cuccioli",
        description:
          "Mentre hai in gioco un altro personaggio Cucciolo, questo personaggio riceve +1 {L}.",
      },
    ],
  },
  es: {
    name: "Parche",
    version: "Cachorro juguetón",
    text: [
      {
        title: "Pabellón",
      },
      {
        title: "CACHORRO LADRANDO",
        description:
          "Mientras tengas otro personaje Cachorro en juego, este personaje obtiene +1 {L}.",
      },
    ],
  },
};
