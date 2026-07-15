import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peterPanNeverLandHeroI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Peter Pan",
    version: "Never Land Hero",
    text: [
      {
        title: "Rush",
      },
      {
        title: "OVER HERE, TINK",
        description:
          "While you have a character named Tinker Bell in play, this character gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Peter Pan",
    version: "Held aus Nimmerland",
    text: [
      {
        title: "<Rasant>",
      },
      {
        title: "Hier drüben, Naseweis",
        description:
          "Solange du mindestens einen Naseweis-Charakter im Spiel hast, erhält dieser Charakter +2 {S}.",
      },
    ],
  },
  fr: {
    name: "Peter Pan",
    version: "Héros du Pays Imaginaire",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "Par ici, Fée Clochette",
        description:
          "Tant que vous avez un personnage La Fée Clochette en jeu, ce personnage gagne +2 {S}.",
      },
    ],
  },
  it: {
    name: "Peter Pan",
    version: "Eroe dell'Isola Che Non C'è",
    text: [
      {
        title: "<Lesto> (Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
      {
        title: "Da Questa Parte, Trilli",
        description:
          "Mentre hai un personaggio chiamato Trilli in gioco, questo personaggio riceve +2 {S}.",
      },
    ],
  },
};
