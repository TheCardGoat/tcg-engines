import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaExploringTheUnknownP3ChallengeI18n } from "./p3-022-elsa-exploring-the-unknown-challenge.i18n";

export const elsaExploringTheUnknownP3Challenge: CharacterCard = {
  id: "su8",
  canonicalId: "ci_bTR",
  slug: "lorcana-ci_bTR",
  printings: [
    {
      id: "set10-p3-022-challenge",
      artId: "ci_bTR-challenge",
      setCode: "set10",
      collectorNumber: "22",
      rarity: "challenge",
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
  cardNumber: 22,
  rarity: "special",
  specialRarity: "challenge",
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
  i18n: elsaExploringTheUnknownP3ChallengeI18n,
};
