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
        title:
          "<Verschwinden> (Jedes Mal, wenn dieser Charakter von einer Aktion einer gegnerischen Person ausgewählt wird, verbanne ihn.)",
      },
      {
        title: "Greifender Rüssel",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einen gegnerischen Charakter auswählen. Sammle so viele Legenden, wie sein {L}-Wert beträgt.",
      },
    ],
  },
  fr: {
    name: "Abu",
    version: "Apparition pachydermique",
    text: [
      {
        title:
          "<Dissipation> (Lorsqu'un adversaire choisit ce personnage avec une action, bannissez-le.)",
      },
      {
        title: "Trompe préhensile",
        description:
          "chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage adverse et gagnez autant d'éclats de Lore que son {L}.",
      },
    ],
  },
  it: {
    name: "Abu",
    version: "Pachiderma Illusorio",
    text: [
      {
        title:
          "<Svanire> (Quando un avversario sceglie questo personaggio per un'azione, esilialo.)",
      },
      {
        title: "Proboscide Afferrante",
        description:
          "Ogni volta che questo personaggio va all'avventura, ottieni leggenda pari al {L} di un personaggio avversario a tua scelta.",
      },
    ],
  },
  es: {
    name: "Abu",
    version: "Paquidermo ilusorio",
    text: [
      {
        title: "Desaparecer",
        description: "(Cuando un oponente elige este personaje para una acción, destierralo).",
      },
      {
        title: "AGARRANDO EL TRONCO",
        description:
          "Cada vez que este personaje realice una misión, obtendrás un conocimiento igual al {L} del personaje contrario elegido.",
      },
    ],
  },
};
