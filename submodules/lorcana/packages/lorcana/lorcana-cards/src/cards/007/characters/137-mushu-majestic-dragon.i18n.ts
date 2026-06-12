import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mushuMajesticDragonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mushu",
    version: "Majestic Dragon",
    text: [
      {
        title: "INTIMIDATING AND AWE-INSPIRING",
        description:
          "Whenever one of your characters challenges, they gain Resist +2 during that challenge.",
      },
      {
        title: "GUARDIAN OF LOST SOULS",
        description:
          "During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Mushu",
    version: "Majestätischer Drache",
    text: [
      {
        title: "FURCHTEINFLÖSSEND UND ANBETUNGSWÜRDIG",
        description:
          "Jedes Mal, wenn einer deiner Charaktere herausfordert, erhält er während der Herausforderung Robust +2. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 2.)",
      },
      {
        title: "BESCHÜTZER DER VERLORENEN SEELEN",
        description:
          "Jedes Mal, wenn einer deiner Charaktere in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Mushu",
    version: "Dragon majestueux",
    text: [
      {
        title: "INTIMIDANT ET EFFRAYANT",
        description:
          "Chaque fois que l'un de vos personnages défie, il gagne Résistance +2 durant ce défi.",
      },
      {
        title: "GARDIEN DES ÂMES PERDUES",
        description:
          "Durant votre tour, chaque fois que l'un de vos personnages en bannit un autre via un défi, gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Mushu",
    version: "Maestoso Drago",
    text: [
      {
        title: "INTIMIDATORIO E IMPONENTE",
        description:
          "Ogni volta che uno dei tuoi personaggi sfida, ottiene Resistere +2 durante quella sfida.",
      },
      {
        title: "GUARDIANO DELLE ANIME PERDUTE",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi personaggi esilia un altro personaggio in una sfida, ottieni 2 leggenda.",
      },
    ],
  },
};
