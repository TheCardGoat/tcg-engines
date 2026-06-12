import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const geneNicelandResidentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gene",
    version: "Niceland Resident",
    text: [
      {
        title: "I GUESS YOU EARNED THIS",
        description:
          "Whenever this character quests, you may remove up to 2 damage from chosen character.",
      },
    ],
  },
  de: {
    name: "Gene",
    version: "Bewohner von Niceland",
    text: [
      {
        title: "ICH SCHÄTZE, DU HAST SIE DIR VERDIENT",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du bis zu 2 Schaden von einem Charakter deiner Wahl entfernen.",
      },
    ],
  },
  fr: {
    name: "Gene",
    version: "Résident de Niceland",
    text: [
      {
        title: "J'IMAGINE QUE TU L'AS MÉRITÉE",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un personnage et lui retirer jusqu'à 2 dommages.",
      },
    ],
  },
  it: {
    name: "Gene",
    version: "Abitante di Belposto",
    text: [
      {
        title: "IMMAGINO TU L'ABBIA GUADAGNATA",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi rimuovere fino a 2 danni da un personaggio a tua scelta.",
      },
    ],
  },
};
