import type { CharacterCard } from "@tcg/lorcana-types";
import { theHuntsmanReluctantEnforcerI18n } from "./194-the-huntsman-reluctant-enforcer.i18n";

export const theHuntsmanReluctantEnforcer: CharacterCard = {
  id: "GSI",
  canonicalId: "ci_GSI",
  reprints: ["set2-194"],
  cardType: "character",
  name: "The Huntsman",
  version: "Reluctant Enforcer",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 194,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_98f78d167b2e41d58e796d0124e5f9bf",
    tcgPlayer: 527293,
  },
  text: [
    {
      title: "CHANGE OF HEART",
      description:
        "Whenever this character quests, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
        },
      },
      id: "voc-1",
      name: "CHANGE OF HEART",
      text: "CHANGE OF HEART Whenever this character quests, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: theHuntsmanReluctantEnforcerI18n,
};
