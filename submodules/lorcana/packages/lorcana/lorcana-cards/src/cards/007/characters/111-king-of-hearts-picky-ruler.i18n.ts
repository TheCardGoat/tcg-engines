import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kingOfHeartsPickyRulerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "King of Hearts",
    version: "Picky Ruler",
    text: [
      {
        title: "OBJECTIONABLE STATE",
        description: "Damaged characters can't challenge your characters.",
      },
    ],
  },
  de: {
    name: "Herzkönig",
    version: "Wählerischer Herrscher",
    text: [
      {
        title: "UNZULÄSSIGER ZUSTAND",
        description: "Beschädigte Charaktere können deine Charaktere nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "Le Roi de Cœur",
    version: "Monarque pointilleux",
    text: [
      {
        title: "DANS UN ÉTAT INACCEPTABLE",
        description:
          "Les personnages avec au moins un dommage ne peuvent pas défier vos personnages.",
      },
    ],
  },
  it: {
    name: "Re di Cuori",
    version: "Monarca Schizzinoso",
    text: [
      {
        title: "IN UNO STATO DEPLOREVOLE I",
        description: "personaggi danneggiati non possono sfidare i tuoi personaggi.",
      },
    ],
  },
};
