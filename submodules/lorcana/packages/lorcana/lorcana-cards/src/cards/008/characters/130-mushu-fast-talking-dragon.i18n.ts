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
        title: "Bringen wir das über die Bühne",
        description:
          "{E} — Ein Charakter deiner Wahl erhält in diesem Zug <Rasant>. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "Mushu",
    version: "Dragon jacasseur",
    text: [
      {
        title: "En avant pour la grande aventure",
        description: "{E} — Choisissez un personnage qui gagne <Charge> pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Mushu",
    version: "Drago Loquace",
    text: [
      {
        title: "Buttiamoci Nella Mischia",
        description:
          "{E} — Un personaggio a tua scelta ottiene <Lesto> per questo turno. (Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
};
