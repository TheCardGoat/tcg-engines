import type { CharacterCard } from "@tcg/lorcana-types";
import { bobbyZimuruskiSprayCheeseKidI18n } from "./078-bobby-zimuruski-spray-cheese-kid.i18n";

export const bobbyZimuruskiSprayCheeseKid: CharacterCard = {
  id: "3V0",
  canonicalId: "ci_3V0",
  reprints: ["set9-078"],
  cardType: "character",
  name: "Bobby Zimuruski",
  version: "Spray Cheese Kid",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 78,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_912d9241d6084800bd0168df05d52bc3",
    tcgPlayer: 650018,
  },
  text: [
    {
      title: "SO CHEESY",
      description:
        "When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
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
          type: "sequence",
        },
        type: "optional",
      },
      id: "1kg-1",
      name: "SO CHEESY",
      text: "SO CHEESY When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: bobbyZimuruskiSprayCheeseKidI18n,
};
