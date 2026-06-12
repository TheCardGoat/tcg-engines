import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sirPellinoreSeasonedKnightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sir Pellinore",
    version: "Seasoned Knight",
    text: [
      {
        title: "CODE OF HONOR",
        description:
          "Whenever this character quests, your other characters gain Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
    ],
  },
  de: {
    name: "Sir Pelinore",
    version: "Erfahrener Ritter",
    text: [
      {
        title: "EHRENKODEX",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhalten deine anderen Charaktere in diesem Zug Unterstützen. (Jedes Mal, wenn die Charaktere erkunden, darfst du ihre in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Seigneur Pélinore",
    version: "Chevalier chevronné",
    text: [
      {
        title: "CODE DE CHEVALERIE",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vos autres personnages gagnent Soutien pour le reste de ce tour. (Lorsque ces personnages sont envoyés à l'aventure, vous pouvez ajouter leur à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Ser Pilade",
    version: "Cavaliere Esperto",
    text: [
      {
        title: "CODICE D'ONORE",
        description:
          "Ogni volta che questo personaggio va all'avventura, i tuoi altri personaggi ottengono Aiutante per questo turno. (Ogni volta che vanno all'avventura, puoi aggiungere la loro alla di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
};
