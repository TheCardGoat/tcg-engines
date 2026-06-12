import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { kristoffMiningTheRuinsI18n } from "./159-kristoff-mining-the-ruins.i18n";

export const kristoffMiningTheRuins: CharacterCard = {
  id: "tnP",
  canonicalId: "ci_3Xr",
  reprints: ["set10-159"],
  cardType: "character",
  name: "Kristoff",
  version: "Mining the Ruins",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "010",
  cardNumber: 159,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c74126bc80ba4d52bc7c499ba67dce25",
    tcgPlayer: 660270,
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
  i18n: kristoffMiningTheRuinsI18n,
};
