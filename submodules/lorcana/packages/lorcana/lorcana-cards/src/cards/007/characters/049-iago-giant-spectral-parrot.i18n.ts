import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const iagoGiantSpectralParrotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Iago",
    version: "Giant Spectral Parrot",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "Vanish",
        description: "(When an opponent chooses this character for an action, banish them.)",
      },
    ],
  },
  de: {
    name: "Jago",
    version: "Riesiger spektraler Papagei",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "Verschwinden",
        description:
          "(Jedes Mal, wenn dieser Charakter von einer Aktion einer gegnerischen Person ausgewählt wird, verbanne ihn.)",
      },
    ],
  },
  fr: {
    name: "Iago",
    version: "Gigantesque perroquet spectral",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "Dissipation",
        description: "(Lorsqu'un adversaire choisit ce personnage avec une action, bannissez-le.)",
      },
    ],
  },
  it: {
    name: "Iago",
    version: "Pappagallo Spettrale Gigante",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "Svanire",
        description: "(Quando un avversario sceglie questo personaggio per un'azione, esilialo.)",
      },
    ],
  },
};
