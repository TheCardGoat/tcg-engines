import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const abuIllusoryPachydermI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Abu",
    version: "Illusory Pachyderm",
    text: [
      {
        title: "Vanish",
        description: "(When an opponent chooses this character for an action, banish them.)",
      },
      {
        title: "GRASPING TRUNK",
        description:
          "Whenever this character quests, gain lore equal to the {L} of chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Abu",
    version: "Illusionärer Dickhäuter",
    text: [
      {
        title: "Verschwinden",
        description:
          "(Jedes Mal, wenn dieser Charakter von einer Aktion einer gegnerischen Person ausgewählt wird, verbanne ihn.)",
      },
      {
        title: "GREIFENDER RÜSSEL",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einen gegnerischen Charakter auswählen. Sammle so viele Legenden, wie sein -Wert beträgt.",
      },
    ],
  },
  fr: {
    name: "Abu",
    version: "Apparition pachydermique",
    text: [
      {
        title: "Dissipation",
        description: "(Lorsqu'un adversaire choisit ce personnage avec une action, bannissez-le.)",
      },
      {
        title: "TROMPE PRÉHENSILE",
        description:
          "chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage adverse et gagnez autant d'éclats de Lore que son.",
      },
    ],
  },
  it: {
    name: "Abu",
    version: "Pachiderma Illusorio",
    text: [
      {
        title: "Svanire",
        description: "(Quando un avversario sceglie questo personaggio per un'azione, esilialo.)",
      },
      {
        title: "PROBOSCIDE AFFERRANTE",
        description:
          "Ogni volta che questo personaggio va all'avventura, ottieni leggenda pari al di un personaggio avversario a tua scelta.",
      },
    ],
  },
};
