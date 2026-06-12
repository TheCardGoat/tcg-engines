import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const iceSpikesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ice Spikes",
    text: [
      {
        title: "HOLD STILL",
        description: "When you play this item, exert chosen opposing character.",
      },
      {
        title: "IT'S STUCK",
        description:
          "{E}, 1 {I} — Exert chosen opposing item. It can't ready at the start of its next turn.",
      },
    ],
  },
  de: {
    name: "Eisstacheln",
    text: [
      {
        title: "HALT STILL",
        description:
          "Wenn du diesen Gegenstand ausspielst, erschöpfe einen gegnerischen Charakter deiner Wahl.",
      },
      {
        title: "ES KLEMMT, 1",
        description:
          "— Erschöpfe einen gegnerischen Gegenstand deiner Wahl. Er wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Pics de glace",
    text: [
      {
        title: "NE BOUGEZ PLUS",
        description:
          "Lorsque vous jouez cet objet, choisissez un personnage adverse et épuisez-le.",
      },
      {
        title: "C'EST",
        description:
          "COINCÉ, 1 — Choisissez un objet adverse et épuisez-le. Il ne se redresse pas au début du prochain tour de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Spuntoni di Ghiaccio",
    text: [
      {
        title: "STAI FERMO",
        description:
          "Quando giochi questo oggetto, impegna un personaggio avversario a tua scelta. È BLOCCATO, 1 — Impegna un oggetto avversario a tua scelta. Non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
};
