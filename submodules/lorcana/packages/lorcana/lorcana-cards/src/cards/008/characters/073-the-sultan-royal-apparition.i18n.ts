import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theSultanRoyalApparitionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Sultan",
    version: "Royal Apparition",
    text: [
      {
        title: "Vanish",
        description: "(When an opponent chooses this character for an action, banish them.)",
      },
      {
        title: "COMMANDING PRESENCE",
        description:
          "Whenever one of your Illusion characters quests, exert chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Der Sultan",
    version: "Königliche Erscheinung",
    text: [
      {
        title: "Verschwinden",
        description:
          "(Jedes Mal, wenn dieser Charakter von einer Aktion einer gegnerischen Person ausgewählt wird, verbanne ihn.)",
      },
      {
        title: "SOUVERÄNE PRÄSENZ",
        description:
          "Jedes Mal, wenn eine deiner Illusionen erkundet, erschöpfe einen gegnerischen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Le Sultan",
    version: "Apparition royale",
    text: [
      {
        title: "Dissipation",
        description: "(Lorsqu'un adversaire choisit ce personnage avec une action, bannissez-le.)",
      },
      {
        title: "PRÉSENCE IMPÉRIEUSE",
        description:
          "Chaque fois que l'un de vos personnages Illusion est envoyé à l'aventure, choisissez un personnage adverse et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Il Sultano",
    version: "Apparizione Reale",
    text: [
      {
        title: "Svanire",
        description: "(Quando un avversario sceglie questo personaggio per un'azione, esilialo.)",
      },
      {
        title: "PRESENZA AUTOREVOLE",
        description:
          "Ogni volta che uno dei tuoi personaggi Illusione va all'avventura, impegna un personaggio avversario a tua scelta.",
      },
    ],
  },
};
