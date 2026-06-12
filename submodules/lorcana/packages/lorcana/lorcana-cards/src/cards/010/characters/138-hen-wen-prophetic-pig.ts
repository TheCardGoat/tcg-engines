import type { CharacterCard } from "@tcg/lorcana-types";
import { henWenPropheticPigI18n } from "./138-hen-wen-prophetic-pig.i18n";

export const henWenPropheticPig: CharacterCard = {
  id: "nAF",
  canonicalId: "ci_nAF",
  reprints: ["set10-138"],
  cardType: "character",
  name: "Hen Wen",
  version: "Prophetic Pig",
  inkType: ["sapphire"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 138,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_48058e5daf3b4a409e525f826f96ddb1",
    tcgPlayer: 657890,
  },
  text: [
    {
      title: "FUTURE SIGHT",
      description:
        "Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 1,
        destinations: [
          {
            zone: "deck-top",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      id: "1ms-1",
      name: "FUTURE SIGHT",
      text: "FUTURE SIGHT Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: henWenPropheticPigI18n,
};
