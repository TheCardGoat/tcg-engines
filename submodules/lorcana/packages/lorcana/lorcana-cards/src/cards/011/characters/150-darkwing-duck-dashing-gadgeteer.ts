import type { CharacterCard } from "@tcg/lorcana-types";
import { darkwingDuckDashingGadgeteerI18n } from "./150-darkwing-duck-dashing-gadgeteer.i18n";

export const darkwingDuckDashingGadgeteer: CharacterCard = {
  id: "Zlv",
  canonicalId: "ci_UY0",
  reprints: ["set11-150"],
  cardType: "character",
  name: "Darkwing Duck",
  version: "Dashing Gadgeteer",
  inkType: ["sapphire"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 150,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_79e8c2e58ef1439ba301da0ec23f1f08",
    tcgPlayer: 658218,
  },
  text: [
    {
      title: "MODERN MARVEL",
      description:
        "Whenever this character quests, you may put an item card from your discard on the bottom of your deck. If you do, you may play an item with cost 5 or less from your discard for free.",
    },
  ],
  classifications: ["Dreamborn", "Super", "Hero", "Detective"],
  abilities: [
    {
      id: "19r-1",
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              target: {
                cardTypes: ["item"],
                count: 1,
                owner: "you",
                selector: "chosen",
                zones: ["discard"],
              },
              type: "put-on-bottom",
            },
            type: "optional",
          },
          {
            condition: {
              type: "if-you-do",
            },
            then: {
              chooser: "CONTROLLER",
              effect: {
                cardType: "item",
                cost: "free",
                filter: {
                  cardType: "item",
                  maxCost: 5,
                },
                from: "discard",
                type: "play-card",
              },
              type: "optional",
            },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      name: "MODERN MARVEL",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
      text: "MODERN MARVEL Whenever this character quests, you may put an item card from your discard on the bottom of your deck. If you do, you may play an item with cost 5 or less from your discard for free.",
    },
  ],
  i18n: darkwingDuckDashingGadgeteerI18n,
};
