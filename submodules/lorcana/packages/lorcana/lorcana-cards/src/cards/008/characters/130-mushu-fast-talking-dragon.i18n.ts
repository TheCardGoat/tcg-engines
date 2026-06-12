import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mushuFasttalkingDragonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mushu",
    version: "Fast-Talking Dragon",
    text: [
      {
        title: "LET'S GET THIS SHOW ON THE ROAD",
        description:
          "{E} — Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
      },
    ],
  },
  de: {
    name: "Mushu",
    version: "Schnellsprechender Drache",
    text: [
      {
        title: "BRINGEN WIR DAS",
        description:
          "ÜBER DIE BÜHNE — Ein Charakter deiner Wahl erhält in diesem Zug Rasant. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "Mushu",
    version: "Dragon jacasseur",
    text: [
      {
        title: "EN AVANT POUR LA GRANDE AVENTURE",
        description: "— Choisissez un personnage qui gagne Charge pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Mushu",
    version: "Drago Loquace",
    text: [
      {
        title: "BUTTIAMOCI NELLA MISCHIA",
        description:
          "— Un personaggio a tua scelta ottiene Lesto per questo turno. (Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
};
