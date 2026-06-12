import type { CharacterCard } from "@tcg/lorcana-types";
import { geppettoSkilledCraftsmanI18n } from "./174-geppetto-skilled-craftsman.i18n";

export const geppettoSkilledCraftsman: CharacterCard = {
  id: "4JO",
  canonicalId: "ci_4JO",
  reprints: ["set8-174"],
  cardType: "character",
  name: "Geppetto",
  version: "Skilled Craftsman",
  inkType: ["sapphire"],
  franchise: "Pinocchio",
  set: "008",
  cardNumber: 174,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f19b9d58f8d44e60b66d72d64c16ab09",
    tcgPlayer: 633102,
  },
  text: [
    {
      title: "SEEKING INSPIRATION",
      description:
        "Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Inventor"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              amount: "DISCARDED_COUNT",
              chosen: true,
              filter: {
                cardType: "item",
              },
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
            {
              amount: "DISCARDED_COUNT",
              target: "CONTROLLER",
              type: "gain-lore",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "1ae-1",
      name: "SEEKING INSPIRATION",
      text: "SEEKING INSPIRATION Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: geppettoSkilledCraftsmanI18n,
};
