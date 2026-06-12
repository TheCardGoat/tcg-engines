import type { CharacterCard } from "@tcg/lorcana-types";
import { archimedesResourcefulOwlI18n } from "./113-archimedes-resourceful-owl.i18n";

export const archimedesResourcefulOwl: CharacterCard = {
  id: "qnh",
  canonicalId: "ci_qnh",
  reprints: ["set8-113"],
  cardType: "character",
  name: "Archimedes",
  version: "Resourceful Owl",
  inkType: ["emerald"],
  franchise: "Sword in the Stone",
  set: "008",
  cardNumber: 113,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bf2471b2597f495db6b088a5705d4502",
    tcgPlayer: 631423,
  },
  text: [
    {
      title: "YOU DON'T NEED THAT",
      description: "When you play this character, you may banish chosen item.",
    },
    {
      title: "NOW, THAT'S NOT BAD",
      description:
        "During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "3sv-1",
      name: "YOU DON'T NEED THAT",
      text: "YOU DON'T NEED THAT When you play this character, you may banish chosen item.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          effects: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              target: "CONTROLLER",
              type: "discard",
            },
          ],
        },
        type: "optional",
      },
      id: "3sv-2",
      name: "NOW, THAT'S NOT BAD",
      trigger: {
        event: "banish",
        on: "ANY_ITEM",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      text: "NOW, THAT'S NOT BAD During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.",
      type: "triggered",
    },
  ],
  i18n: archimedesResourcefulOwlI18n,
};
