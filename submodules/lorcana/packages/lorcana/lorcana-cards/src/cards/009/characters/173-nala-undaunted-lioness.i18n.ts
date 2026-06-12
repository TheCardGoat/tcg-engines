import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nalaUndauntedLionessI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nala",
    version: "Undaunted Lioness",
    text: [
      {
        title: "DETERMINED DIVERSION",
        description: "While this character has no damage, she gets +1 {L} and gains Resist +1.",
      },
    ],
  },
  de: {
    name: "Nala",
    version: "Unerschrockene Löwin",
    text: [
      {
        title: "ENTSCHLOSSENE ABLENKUNG",
        description:
          "Solange dieser Charakter unbeschädigt ist, erhält er +1 und Robust +1. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Nala",
    version: "Lionne indomptable",
    text: [
      {
        title: "DIVERSION RÉSOLUE",
        description:
          "Tant que ce personnage n'a aucun dommage sur lui, il gagne +1 et Résistance +1.",
      },
    ],
  },
  it: {
    name: "Nala",
    version: "Leonessa Indomita",
    text: [
      {
        title: "DISTRAZIONE RISOLUTA",
        description: "Mentre questo personaggio non ha danno, riceve +1 e ottiene Resistere +1.",
      },
    ],
  },
};
