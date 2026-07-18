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
        title:
          "<Verschwinden> (Jedes Mal, wenn dieser Charakter von einer Aktion einer gegnerischen Person ausgewählt wird, verbanne ihn.)",
      },
      {
        title: "Souveräne Präsenz",
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
        title:
          "<Dissipation> (Lorsqu'un adversaire choisit ce personnage avec une action, bannissez-le.)",
      },
      {
        title: "Présence impérieuse",
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
        title:
          "<Svanire> (Quando un avversario sceglie questo personaggio per un'azione, esilialo.)",
      },
      {
        title: "Presenza Autorevole",
        description:
          "Ogni volta che uno dei tuoi personaggi Illusione va all'avventura, impegna un personaggio avversario a tua scelta.",
      },
    ],
  },
  es: {
    name: "El sultán",
    version: "Aparición real",
    text: [
      {
        title: "Desaparecer",
        description: "(Cuando un oponente elige este personaje para una acción, destierralo).",
      },
      {
        title: "PRESENCIA IMPONENTE",
        description:
          "Cada vez que uno de tus personajes de Illusion realice misiones, ejerce el personaje contrario elegido.",
      },
    ],
  },
};
