import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const giantCobraGhostlySerpentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Giant Cobra",
    version: "Ghostly Serpent",
    text: [
      {
        title: "Vanish",
        description: "(When an opponent chooses this character for an action, banish them.)",
      },
      {
        title: "MYSTERIOUS ADVANTAGE",
        description:
          "When you play this character, you may choose and discard a card to gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Riesenkobra",
    version: "Geisterhafte Schlange",
    text: [
      {
        title: "Verschwinden",
        description:
          "(Jedes Mal, wenn dieser Charakter von einer Aktion einer gegnerischen Person ausgewählt wird, verbanne ihn.)",
      },
      {
        title: "MYSTERIÖSER VORTEIL",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du eine Karte von deiner Hand auswählen und abwerfen, um 2 Legenden zu sammeln.",
      },
    ],
  },
  fr: {
    name: "Cobra géant",
    version: "Serpent fantomatique",
    text: [
      {
        title: "Dissipation",
        description: "(Lorsqu'un adversaire choisit ce personnage avec une action, bannissez-le.)",
      },
      {
        title: "MYSTÉRIEUX AVANTAGE",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez défausser une carte pour gagner 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Cobra Gigante",
    version: "Serpente Spettrale",
    text: [
      {
        title: "Svanire",
        description: "(Quando un avversario sceglie questo personaggio per un'azione, esilialo.)",
      },
      {
        title: "VANTAGGIO MISTERIOSO",
        description:
          "Quando giochi questo personaggio, puoi scegliere e scartare una carta per ottenere 2 leggenda.",
      },
    ],
  },
};
