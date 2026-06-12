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
        title: "FREUNDLICHER HELFER",
        description:
          "Solange dieser Charakter unbeschädigt ist, erhält er +2 und Unterstützen. (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Pluto",
    version: "Ayant fait ses preuves",
    text: [
      {
        title: "AIDE AVEC JOIE",
        description: "Tant que ce personnage n'a aucun dommage sur lui, il gagne +2 et Soutien.",
      },
    ],
  },
  it: {
    name: "Pluto",
    version: "Affidabile",
    text: [
      {
        title: "AIUTANTE FELICE",
        description:
          "Mentre questo personaggio non ha danno, riceve +2 e ottiene Aiutante. (Ogni volta che va all'avventura, puoi aggiungere la sua alla di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
};
