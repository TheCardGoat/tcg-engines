import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const arthurKingVictoriousI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Arthur",
    version: "King Victorious",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "KNIGHTED BY THE KING",
        description:
          "When you play this character, chosen character gains Challenger +2 and Resist +2 and can challenge ready characters this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)",
      },
    ],
  },
  de: {
    name: "Arthur",
    version: "Siegreicher König",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "VOM KÖNIG ZUM RITTER GESCHLAGEN",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug Herausfordern +2, Robust +2 und kann in diesem Zug bereite Charaktere herausfordern. (Während der Charakter herausfordert, erhält er +2. Reduziere jeglichen Schaden, der ihm zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Arthur",
    version: "Roi victorieux",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "ADOUBÉ PAR LE ROI",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne, pour le reste de ce tour, Offensif +2, Résistance +2, et peut défier les personnages redressés. (Les dommages qui lui sont infligés sont réduits de 2 et lorsqu'il défie, ce personnage gagne +2.)",
      },
    ],
  },
  it: {
    name: "Artù",
    version: "Re Vittorioso",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "NOMINATO CAVALIERE DAL RE",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene Sfidante +2 e Resistere +2 e può sfidare i personaggi preparati per questo turno. (Riceve +2 mentre sta sfidando. Il danno che gli viene inflitto è ridotto di 2.)",
      },
    ],
  },
};
