import type { CharacterCard } from "@tcg/lorcana-types";
import { kristoffMiningTheRuinsEpicI18n } from "./218-kristoff-mining-the-ruins-epic.i18n";

import { boost } from "../../../helpers/abilities/boost";

export const kristoffMiningTheRuinsEpic: CharacterCard = {
  id: "Pq0",
  canonicalId: "ci_3Xr",
  slug: "lorcana-ci_3Xr",
  printings: [
    {
      id: "set10-218-epic",
      artId: "ci_3Xr-epic",
      setCode: "set10",
      collectorNumber: "218",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set10-159"],
  cardType: "character",
  name: "Kristoff",
  version: "Mining the Ruins",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "010",
  cardNumber: 218,
  rarity: "common",
  specialRarity: "epic",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c74126bc80ba4d52bc7c499ba67dce25",
    tcgPlayer: "660270",
  },
  text: [
    {
      title: "Boost 1 {I}",
    },
    {
      title: "WORTH MINING",
      description:
        "Whenever this character quests, if there's a card under him, put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Whisper"],
  abilities: [
    boost(1),
    {
      effect: {
        condition: {
          type: "has-card-under",
        },
        then: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "conditional",
      },
      id: "abh-2",
      name: "WORTH MINING",
      text: "WORTH MINING Whenever this character quests, if there's a card under him, put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: kristoffMiningTheRuinsEpicI18n,
};
