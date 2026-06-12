import type { CharacterCard } from "@tcg/lorcana-types";
import { sisuDivineWaterDragonI18n } from "./159-sisu-divine-water-dragon.i18n";

export const sisuDivineWaterDragon: CharacterCard = {
  id: "GZk",
  canonicalId: "ci_mTe",
  reprints: ["set2-159"],
  cardType: "character",
  name: "Sisu",
  version: "Divine Water Dragon",
  inkType: ["sapphire"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 159,
  rarity: "legendary",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_f9edf9a591974716b2d7f02764f93737",
    tcgPlayer: 528112,
  },
  text: [
    {
      title: "I TRUST YOU",
      description:
        "Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 2,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "rwp-1",
      name: "I TRUST YOU",
      text: "I TRUST YOU Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: sisuDivineWaterDragonI18n,
};
