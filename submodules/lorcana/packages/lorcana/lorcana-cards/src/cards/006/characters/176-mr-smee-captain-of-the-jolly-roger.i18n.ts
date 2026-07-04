import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mrSmeeCaptainOfTheJollyRogerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mr. Smee",
    version: "Captain of the Jolly Roger",
    text: [
      {
        title: "Shift 4",
        description:
          "(You may pay 4 {I} to play this on top of one of your characters named Mr. Smee.)",
      },
      {
        title: "RAISE THE COLORS",
        description:
          "When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.",
      },
    ],
  },
  de: {
    name: "Herr Smee",
    version: "Kapitän unter der Piratenflagge",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Herr-Smee-Charaktere auszuspielen.)",
      },
      {
        title: "Erhebt die Segel",
        description:
          "Wenn du diesen Charakter ausspielst, zähle deine anderen Piraten im Spiel. Du darfst einem Charakter deiner Wahl dieselbe Anzahl Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Monsieur Mouche",
    version: "Capitaine du Jolly Roger",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Monsieur Mouche.)",
      },
      {
        title: "Hissez le pavillon",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage et lui infliger autant de dommages que le nombre d'autres personnages Pirate que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "Spugna",
    version: "Capitano della Jolly Roger",
    text: [
      {
        title:
          "<Trasformazione> 4 (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Spugna.)",
      },
      {
        title: "Issate la Bandiera",
        description:
          "Quando giochi questo personaggio, puoi infliggere danno a un personaggio a tua scelta pari al numero dei tuoi altri personaggi Pirata in gioco.",
      },
    ],
  },
};
