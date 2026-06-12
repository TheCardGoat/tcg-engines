import type { CharacterCard } from "@tcg/lorcana-types";
import { annaLittleSisterI18n } from "./052-anna-little-sister.i18n";

export const annaLittleSister: CharacterCard = {
  id: "Xmi",
  canonicalId: "ci_3CK",
  reprints: ["set11-052"],
  cardType: "character",
  name: "Anna",
  version: "Little Sister",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 52,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9702c37c04864acd9912592d55d9dce0",
    tcgPlayer: 677145,
  },
  text: [
    {
      title: "UNEXPECTED DISCOVERY",
      description:
        "When you play this character, you may put a card from chosen player's discard on the bottom of their deck.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen"],
  abilities: [
    {
      id: "1hf-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              target: {
                count: 1,
                owner: "any",
                selector: "chosen",
                zones: ["discard"],
              },
              type: "put-on-bottom",
            },
          ],
        },
        type: "optional",
      },
      name: "UNEXPECTED DISCOVERY",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "UNEXPECTED DISCOVERY When you play this character, you may put a card from chosen player's discard on the bottom of their deck.",
    },
  ],
  i18n: annaLittleSisterI18n,
};
