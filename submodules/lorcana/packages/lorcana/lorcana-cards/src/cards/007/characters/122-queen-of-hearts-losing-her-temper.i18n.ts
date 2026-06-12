import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const queenOfHeartsLosingHerTemperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Queen of Hearts",
    version: "Losing Her Temper",
    text: [
      {
        title: "ROYAL PAIN",
        description: "While this character has damage, she gets +3 {S}.",
      },
    ],
  },
  de: {
    name: "Die Herzkönigin",
    version: "Fassungslos",
    text: [
      {
        title: "KÖNIGLICHER SCHMERZ",
        description: "Solange dieser Charakter beschädigt ist, erhält er +3.",
      },
    ],
  },
  fr: {
    name: "La Reine de Cœur",
    version: "Perd son sang-froid",
    text: [
      {
        title: "DOULEUR ROYALE",
        description: "Tant que ce personnage a au moins un dommage, il gagne +3.",
      },
    ],
  },
  it: {
    name: "La Regina di Cuori",
    version: "Che Perde le Staffe",
    text: [
      {
        title: "REGALE SPINA NEL FIANCO",
        description: "Mentre questo personaggio ha danno, riceve +3.",
      },
    ],
  },
};
