import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicaDeSpellConnivingSorceressI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magica De Spell",
    version: "Conniving Sorceress",
    text: [
      {
        title: "Shift 7 {I}",
      },
      {
        title: "SHADOW'S GRASP",
        description:
          "When you play this character, if you used Shift to play her, you may draw 4 cards.",
      },
    ],
  },
  de: {
    name: "Gundel Gaukeley",
    version: "Hinterhältige Zauberin",
    text: [
      {
        title:
          "<Gestaltwandel> 7 {I} (Du kannst 7 {I} zahlen, um diesen Charakter auf einen deiner Gundel-Gaukeley-Charaktere auszuspielen.)",
      },
      {
        title: "Griff des Schattens",
        description:
          "Wenn du diesen Charakter mithilfe von <Gestaltwandel> ausspielst, darfst du 4 Karten ziehen.",
      },
    ],
  },
  fr: {
    name: "Miss Tick",
    version: "Sorcière machiavélique",
    text: [
      {
        title:
          "<Alter> 7 {I} (Vous pouvez payer 7 {I} pour jouer ce personnage sur l'un de vos personnages nommé Miss Tick.)",
      },
      {
        title: "Emprise de l'ombre",
        description:
          "Si vous jouez ce personnage en utilisant sa capacité <Alter>, vous pouvez piocher 4 cartes.",
      },
    ],
  },
  it: {
    name: "Amelia",
    version: "Strega Subdola",
    text: [
      {
        title:
          "<Trasformazione> 7 {I} (Puoi pagare 7 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Amelia.)",
      },
      {
        title: "Nelle Grinfie dell'Ombra",
        description:
          "Quando giochi questo personaggio, se hai usato <Trasformazione> per giocarlo, puoi pescare 4 carte.",
      },
    ],
  },
};
