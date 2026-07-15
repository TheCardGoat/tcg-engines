import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const plutoTriedAndTrueI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pluto",
    version: "Tried and True",
    text: [
      {
        title: "HAPPY HELPER",
        description:
          "While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
    ],
  },
  de: {
    name: "Pluto",
    version: "Bewährt und treu",
    text: [
      {
        title: "Freundlicher Helfer",
        description:
          "Solange dieser Charakter unbeschädigt ist, erhält er +2 {S} und <Unterstützen>. (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Pluto",
    version: "Ayant fait ses preuves",
    text: [
      {
        title: "Aide avec joie",
        description:
          "Tant que ce personnage n'a aucun dommage sur lui, il gagne +2 {S} et <Soutien>. (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Pluto",
    version: "Affidabile",
    text: [
      {
        title: "Aiutante felice",
        description:
          "Mentre questo personaggio non ha danno, riceve +2 {S} e ottiene <Aiutante>. (Ogni volta che va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
};
