import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaExploringTheUnknownEpicI18n } from "./208-elsa-exploring-the-unknown-epic.i18n";

export const elsaExploringTheUnknownEpic: CharacterCard = {
  id: "MvX",
  canonicalId: "ci_bTR",
  slug: "lorcana-ci_bTR",
  printings: [
    {
      id: "set10-208-epic",
      artId: "ci_bTR-epic",
      setCode: "set10",
      collectorNumber: "208",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set10-045"],
  cardType: "character",
  name: "Elsa",
  version: "Exploring the Unknown",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "010",
  cardNumber: 208,
  rarity: "common",
  specialRarity: "epic",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_04d59c2ff0e648eb9dad622fa82ce49b",
    tcgPlayer: "660188",
  },
  text: [
    {
      title: "CLOSER LOOK",
      description: "When you play this character, you may draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    {
      id: "744-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "CLOSER LOOK",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "CLOSER LOOK When you play this character, you may draw a card.",
    },
  ],
  i18n: elsaExploringTheUnknownEpicI18n,
};
