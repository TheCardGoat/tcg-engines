import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseDetectiveI18n } from "./160-mickey-mouse-detective.i18n";

export const mickeyMouseDetective: CharacterCard = {
  id: "Ff8",
  canonicalId: "ci_Ff8",
  slug: "lorcana-ci_Ff8",
  printings: [
    {
      id: "set10-160",
      artId: "set10-160",
      setCode: "set10",
      collectorNumber: "160",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-154", "set10-160"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Detective",
  inkType: ["sapphire"],
  set: "010",
  cardNumber: 160,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_9b6f273381924929ba2d6f6d3e990f66",
    tcgPlayer: "659388",
  },
  text: [
    {
      title: "GET",
      description:
        "A CLUE When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "1wh-1",
      name: "GET A CLUE",
      text: "GET A CLUE When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: mickeyMouseDetectiveI18n,
};
