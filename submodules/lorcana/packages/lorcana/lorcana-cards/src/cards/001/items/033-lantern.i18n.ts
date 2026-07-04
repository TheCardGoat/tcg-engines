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
        title: "Geburtstagslichter",
        description:
          "{E} — Du zahlst 1 {I} weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "LANTERNE",
    text: [
      {
        title: "LUMIÈRES D'ANNIVERSAIRE",
        description:
          "{E} — Le prochain personnage que vous jouez durant ce tour coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Lanterna",
    text: [
      {
        title: "Luci di Compleanno",
        description:
          "{E} — Paga 1 {I} in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
