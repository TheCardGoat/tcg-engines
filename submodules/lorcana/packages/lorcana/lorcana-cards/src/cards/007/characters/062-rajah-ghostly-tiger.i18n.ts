import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rajahGhostlyTigerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rajah",
    version: "Ghostly Tiger",
    text: [
      {
        title: "Vanish",
        description: "(When an opponent chooses this character for an action, banish them.)",
      },
    ],
  },
  de: {
    name: "Radsha",
    version: "Geisterhafter Tiger",
    text: [
      {
        title: "Verschwinden",
        description:
          "(Jedes Mal, wenn dieser Charakter von einer Aktion einer gegnerischen Person ausgewählt wird, verbanne ihn.)",
      },
    ],
  },
  fr: {
    name: "Rajah",
    version: "Tigre fantomatique",
    text: [
      {
        title: "Dissipation",
        description: "(Lorsqu'un adversaire choisit ce personnage avec une action, bannissez-le.)",
      },
    ],
  },
  it: {
    name: "Rajah",
    version: "Tigre Spettrale",
    text: [
      {
        title: "Svanire",
        description: "(Quando un avversario sceglie questo personaggio per un'azione, esilialo.)",
      },
    ],
  },
};
