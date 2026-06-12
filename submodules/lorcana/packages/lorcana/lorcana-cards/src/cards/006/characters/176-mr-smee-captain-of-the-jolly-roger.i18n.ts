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
        title: "Gestaltwandel 4",
      },
      {
        title: "ERHEBT DIE SEGEL",
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
        title: "Alter 4",
      },
      {
        title: "HISSEZ LE PAVILLON",
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
        title: "Trasformazione 4",
      },
      {
        title: "ISSATE LA BANDIERA",
        description:
          "Quando giochi questo personaggio, puoi infliggere danno a un personaggio a tua scelta pari al numero dei tuoi altri personaggi Pirata in gioco.",
      },
    ],
  },
};
