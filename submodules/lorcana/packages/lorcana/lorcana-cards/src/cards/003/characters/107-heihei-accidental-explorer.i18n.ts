import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const heiheiAccidentalExplorerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "HeiHei",
    version: "Accidental Explorer",
    text: [
      {
        title: "MINDLESS WANDERING",
        description:
          "Once per turn, when this character moves to a location, each opponent loses 1 lore.",
      },
    ],
  },
  de: {
    name: "HeiHei",
    version: "Ungewollter Entdecker",
    text: [
      {
        title: "GEDANKENLOSES UMHERSCHWEIFEN",
        description:
          "Einmal pro Zug, wenn dieser Charakter zu einem Ort bewegt wird, verlieren alle gegnerischen Mitspielenden je 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Heihei",
    version: "Explorateur accidentel",
    text: [
      {
        title: "ERRANCE INSOUCIANTE",
        description:
          "Une fois par tour, lorsque ce personnage est déplacé sur un lieu, chaque adversaire perd 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "HeiHei",
    version: "Esploratore per Caso",
    text: [
      {
        title: "VAGARE INSENSATO",
        description:
          "Una volta per turno, quando questo personaggio si sposta in un luogo, ogni avversario perde 1 leggenda.",
      },
    ],
  },
};
