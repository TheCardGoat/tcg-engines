import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const atlanteanCrystalI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Atlantean Crystal",
    text: [
      {
        title: "SHIELDING LIGHT",
        description:
          "{E}, 2 {I} — Chosen character gains Resist +2 and Support until the start of your next turn. (Damage dealt to them is reduced by 2. Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
    ],
  },
  de: {
    name: "Atlantischer Kristall",
    text: [
      {
        title: "SCHÜTZENDES LICHT,",
        description:
          "2 — Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Robust +2 und Unterstützen. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 2. Jedes Mal, wenn der Charakter erkundet, darfst du seine in diesem Zug zur eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Cristal atlante",
    text: [
      {
        title: "LUMIÈRE PROTECTRICE,",
        description:
          "2 — Choisissez un personnage qui gagne Résistance +2 et Soutien jusqu'au début de votre prochain tour. (Les dommages qui lui sont infligés sont réduits de 2. Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez ajouter sa à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Cristallo Atlantidese",
    text: [
      {
        title: "LUCE PROTETTIVA, 2",
        description:
          "— Un personaggio a tua scelta ottiene Resistere +2 e Aiutante fino all'inizio del tuo prossimo turno. (Il danno che gli viene inflitto è ridotto di 2. Ogni volta che va all'avventura, puoi aggiungere la sua alla di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
};
