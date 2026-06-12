import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tropicalRainforestJaguarLairI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tropical Rainforest",
    version: "Jaguar Lair",
    text: [
      {
        title: "SNACK TIME",
        description:
          "Opposing damaged characters gain Reckless. (They can't quest and must challenge if able.)",
      },
    ],
  },
  de: {
    name: "Tropischer Regenwald",
    version: "Jaguar-Lager",
    text: [
      {
        title: "SNACK-ZEIT",
        description:
          "Beschädigte gegnerische Charaktere erhalten Impulsiv. (Sie können nicht erkunden und müssen herausfordern, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Forêt tropicale",
    version: "Repaire des jaguars",
    text: [
      {
        title: "L'HEURE DU CASSE-CROÛTE",
        description:
          "Les personnages adverses ayant au moins un dommage sur eux gagnent Combattant. (Ces personnages ne peuvent pas être envoyés à l'aventure et doivent défier à chaque tour s'ils le peuvent.)",
      },
    ],
  },
  it: {
    name: "Foresta Tropicale",
    version: "Tana dei Giaguari",
    text: [
      {
        title: "ORA DELLA MERENDA I",
        description:
          "personaggi danneggiati avversari ottengono Attaccabrighe. (Non possono andare all'avventura e devono sfidare, se possibile.)",
      },
    ],
  },
};
