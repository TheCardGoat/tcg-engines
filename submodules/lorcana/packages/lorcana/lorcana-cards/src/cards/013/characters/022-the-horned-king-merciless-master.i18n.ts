import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theHornedKingMercilessMasterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Horned King",
    version: "Merciless Master",
    text: [
      {
        title: "Cauldron's Power",
        description:
          "While this character is exerted, you may play characters from your discard. If you do, they enter play exerted. (You pay all costs.)",
      },
    ],
  },
  de: {
    name: "Der gehörnte König",
    version: "Erbarmungsloser Meister",
    text: [
      {
        title: "Die Macht des Zauberkessels",
        description:
          "Solange dieser Charakter erschöpft ist, darfst du Charaktere von deinem Ablagestapel ausspielen. Wenn du dies tust, werden jene erschöpft ausgespielt. (Du bezahlst dabei alle Kosten.)",
      },
    ],
  },
  fr: {
    name: "Le Seigneur des Ténèbres",
    version: "Maître impitoyable",
    text: [
      {
        title: "Pouvoir du Chaudron",
        description:
          "Tant que ce personnage est épuisé, vous pouvez jouer des personnages depuis votre défausse. Si vous le faites, ces personnages entrent en jeu épuisés. (Vous payez tous leurs coûts.)",
      },
    ],
  },
  it: {
    name: "Re Cornelius",
    version: "Padrone Senza Pietà",
    text: [
      {
        title: "Il Potere della Pentola",
        description:
          "Mentre questo personaggio è impegnato, puoi giocare i personaggi dai tuoi scarti. Se lo fai, entrano in gioco impegnati. (Paga tutti i costi.)",
      },
    ],
  },
};
