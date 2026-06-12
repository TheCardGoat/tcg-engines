import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const palaceGuardSpectralSentryI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Palace Guard",
    version: "Spectral Sentry",
    text: [
      {
        title: "Vanish",
        description: "(When an opponent chooses this character for an action, banish them.)",
      },
    ],
  },
  de: {
    name: "Palastwache",
    version: "Spektraler Wächter",
    text: [
      {
        title: "Verschwinden",
        description:
          "(Jedes Mal, wenn dieser Charakter von einer Aktion einer gegnerischen Person ausgewählt wird, verbanne ihn.)",
      },
    ],
  },
  fr: {
    name: "Garde du palais",
    version: "Sentinelle spectrale",
    text: [
      {
        title: "Dissipation",
        description: "(Lorsqu'un adversaire choisit ce personnage avec une action, bannissez-le.)",
      },
    ],
  },
  it: {
    name: "Guardia di Palazzo",
    version: "Sentinella Spettrale",
    text: [
      {
        title: "Svanire",
        description: "(Quando un avversario sceglie questo personaggio per un'azione, esilialo.)",
      },
    ],
  },
};
