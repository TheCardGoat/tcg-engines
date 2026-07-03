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
        title: "YOU'RE",
        description: "A TRUE HERO Your characters named Hercules gain Evasive.",
      },
    ],
  },
  de: {
    name: "Hera",
    version: "Königin der Götter",
    text: [
      {
        title: "<Behütet>",
      },
      {
        title: "Schützende Göttin",
        description: "Deine Zeus-Charaktere erhalten <Behütet>.",
      },
      {
        title: "Du bist ein wahrer Held",
        description: "Deine Hercules-Charaktere erhalten <Wendig>.",
      },
    ],
  },
  fr: {
    name: "Héra",
    version: "Reine des Dieux",
    text: [
      {
        title: "<Hors d'atteinte>",
      },
      {
        title: "Déesse protectrice",
        description: "Vos personnages Zeus gagnent <Hors d'atteinte>.",
      },
      {
        title: "Tu es un véritable héros",
        description:
          "Vos personnages Hercule gagnent <Insaisissable>. (Seuls les personnages avec Insaisissable peuvent défier ces personnages.)",
      },
    ],
  },
  it: {
    name: "Era",
    version: "Regina degli Dei",
    text: [
      {
        title: "<Protetto>",
      },
      {
        title: "Dea Protettiva",
        description: "I tuoi personaggi chiamati Zeus ottengono <Protetto>.",
      },
      {
        title: "Sei un Vero Eroe",
        description:
          "I tuoi personaggi chiamati Ercole ottengono <Sfuggente>. (Solo altri personaggi con Sfuggente possono sfidarli.)",
      },
    ],
  },
};
