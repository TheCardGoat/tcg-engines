import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princePhillipWardenOfTheWoodsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince Phillip",
    version: "Warden of the Woods",
    text: [
      {
        title: "SHINING BEACON",
        description: "Your other Hero characters gain Ward.",
      },
    ],
  },
  de: {
    name: "Prinz Phillip",
    version: "Hüter des Waldes",
    text: [
      {
        title: "STRAHLENDES LEUCHTFEUER",
        description:
          "Deine anderen Heldinnen und Helden erhalten Behütet. (Gegnerische Karten können diese Charaktere nicht auswählen, außer um sie herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "Prince Philippe",
    version: "Gardien de la forêt",
    text: [
      {
        title: "FLAMBEAU RAYONNANT",
        description:
          "Vos autres personnages Héros gagnent Hors d'atteinte. (Les adversaires ne peuvent pas choisir ces personnages, hormis pour un défi.)",
      },
    ],
  },
  it: {
    name: "Principe Filippo",
    version: "Guardiano delle Foreste",
    text: [
      {
        title: "FARO SPLENDENTE I",
        description:
          "tuoi altri personaggi Eroe ottengono Protetto. (Gli avversari non possono sceglierli se non per sfidarli.)",
      },
    ],
  },
};
