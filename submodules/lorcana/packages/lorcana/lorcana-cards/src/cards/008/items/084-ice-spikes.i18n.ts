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
        title: "Halt still",
        description:
          "Wenn du diesen Gegenstand ausspielst, erschöpfe einen gegnerischen Charakter deiner Wahl.",
      },
      {
        title: "Es klemmt",
        description:
          "{E}, 1 {I} — Erschöpfe einen gegnerischen Gegenstand deiner Wahl. Er wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Pics de glace",
    text: [
      {
        title: "Ne bougez plus",
        description:
          "Lorsque vous jouez cet objet, choisissez un personnage adverse et épuisez-le.",
      },
      {
        title: "C'est coincé",
        description:
          "{E}, 1 {I} — Choisissez un objet adverse et épuisez-le. Il ne se redresse pas au début du prochain tour de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Spuntoni di Ghiaccio",
    text: [
      {
        title: "Stai Fermo",
        description:
          "Quando giochi questo oggetto, impegna un personaggio avversario a tua scelta.",
      },
      {
        title: "È Bloccato",
        description:
          "{E}, 1 {I} — Impegna un oggetto avversario a tua scelta. Non si può preparare all'inizio del suo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Picos de hielo",
    text: [
      {
        title: "MANTENERSE QUIETO",
        description: "Cuando juegues este objeto, ejerce el personaje contrario elegido.",
      },
      {
        title: "ESTÁ ATASCADO",
        description:
          "{E}, 1 {I}: ejerce el elemento contrario elegido. No puede estar listo al comienzo de su siguiente turno.",
      },
    ],
  },
};
