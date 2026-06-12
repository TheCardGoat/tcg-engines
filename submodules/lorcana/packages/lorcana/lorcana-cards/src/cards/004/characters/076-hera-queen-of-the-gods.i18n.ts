import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const heraQueenOfTheGodsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hera",
    version: "Queen of the Gods",
    text: [
      {
        title: "Ward",
      },
      {
        title: "PROTECTIVE GODDESS",
        description: "Your characters named Zeus gain Ward.",
      },
      {
        title: "YOU'RE A TRUE HERO",
        description: "Your characters named Hercules gain Evasive.",
      },
    ],
  },
  de: {
    name: "Hera",
    version: "Königin der Götter",
    text: [
      {
        title: "Behütet",
      },
      {
        title: "SCHÜTZENDE GÖTTIN",
        description: "Deine Zeus-Charaktere erhalten Behütet.",
      },
      {
        title: "DU BIST EIN WAHRER HELD",
        description: "Deine Hercules-Charaktere erhalten Wendig.",
      },
    ],
  },
  fr: {
    name: "Héra",
    version: "Reine des Dieux",
    text: [
      {
        title: "Hors d'atteinte",
      },
      {
        title: "DÉESSE PROTECTRICE",
        description: "Vos personnages Zeus gagnent Hors d'atteinte.",
      },
      {
        title: "TU ES UN VÉRITABLE HÉROS",
        description:
          "Vos personnages Hercule gagnent Insaisissable. (Seuls les personnages avec Insaisissable peuvent défier ces personnages.)",
      },
    ],
  },
  it: {
    name: "Era",
    version: "Regina degli Dei",
    text: [
      {
        title: "Protetto",
      },
      {
        title: "DEA PROTETTIVA",
        description: "I tuoi personaggi chiamati Zeus ottengono Protetto.",
      },
      {
        title: "SEI UN VERO EROE",
        description:
          "I tuoi personaggi chiamati Ercole ottengono Sfuggente. (Solo altri personaggi con Sfuggente possono sfidarli.)",
      },
    ],
  },
};
