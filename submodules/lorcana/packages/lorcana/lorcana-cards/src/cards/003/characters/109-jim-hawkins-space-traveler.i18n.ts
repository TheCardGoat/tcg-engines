import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jimHawkinsSpaceTravelerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jim Hawkins",
    version: "Space Traveler",
    text: [
      {
        title: "THIS IS IT!",
        description:
          "When you play this character, you may play a location with cost 4 or less for free.",
      },
      {
        title: "TAKE THE HELM",
        description: "Whenever you play a location, this character may move there for free.",
      },
    ],
  },
  de: {
    name: "Jim Hawkins",
    version: "Raumfahrer",
    text: [
      {
        title: "Das ist es!",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Ort, der 4 oder weniger kostet, kostenlos ausspielen.",
      },
      {
        title: "Ans Ruder stellen",
        description:
          "Jedes Mal, wenn du einen Ort ausspielst, darfst du diesen Charakter kostenlos zu diesem Ort bewegen.",
      },
    ],
  },
  fr: {
    name: "Jim Hawkins",
    version: "Voyageur de l'espace",
    text: [
      {
        title: "C'est gagné!",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez jouer gratuitement un lieu coûtant 4 ou moins.",
      },
      {
        title: "Il faut te mettre à la barre",
        description:
          "Chaque fois que vous jouez un lieu, vous pouvez y déplacer ce personnage gratuitement.",
      },
    ],
  },
  it: {
    name: "Jim Hawkins",
    version: "Viaggiatore Spaziale",
    text: [
      {
        title: "Guarda Qui!",
        description:
          "Quando giochi questo personaggio, puoi giocare gratis un luogo con costo 4 o inferiore.",
      },
      {
        title: "Prendere in Mano il Timone",
        description:
          "Ogni volta che giochi un luogo, questo personaggio può spostarsi in quel luogo gratis.",
      },
    ],
  },
};
