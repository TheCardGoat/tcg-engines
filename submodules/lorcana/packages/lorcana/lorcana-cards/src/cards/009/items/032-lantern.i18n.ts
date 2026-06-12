import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lanternI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lantern",
    text: [
      {
        title: "BIRTHDAY LIGHTS",
        description: "{E} — You pay 1 {I} less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Himmelslaterne",
    text: [
      {
        title: "GEBURTSTAGSLICHTER",
        description:
          "— Du zahlst 1 weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "LANTERNE",
    text: [
      {
        title: "LUMIÈRES D'ANNIVERSAIRE",
        description: "— Le prochain personnage que vous jouez durant ce tour coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Lanterna",
    text: [
      {
        title: "LUCI DI COMPLEANNO",
        description: "— Paga 1 in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
