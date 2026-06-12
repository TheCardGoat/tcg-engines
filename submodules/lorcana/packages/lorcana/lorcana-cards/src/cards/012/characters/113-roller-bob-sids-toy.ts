import type { CharacterCard } from "@tcg/lorcana-types";
import { rollerBobSidsToyI18n } from "./113-roller-bob-sids-toy.i18n";

export const rollerBobSidsToy: CharacterCard = {
  id: "uOj",
  canonicalId: "ci_uOj",
  reprints: ["set12-113"],
  cardType: "character",
  name: "Roller Bob",
  version: "Sid's Toy",
  inkType: ["ruby"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 113,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c9ceb70d89834fafb495e0b0da01e406",
  },
  text: [
    {
      title: "TIME TO MOVE",
      description:
        "When you play this character, you may put 2 character cards from your discard on the bottom of your deck to give this character Rush this turn. (They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Storyborn", "Ally", "Toy"],
  abilities: [
    {
      id: "uOj-1",
      name: "TIME TO MOVE",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "put-on-bottom",
              target: {
                cardTypes: ["character"],
                count: 2,
                owner: "you",
                selector: "chosen",
                zones: ["discard"],
              },
            },
            {
              type: "gain-keyword",
              keyword: "Rush",
              duration: "this-turn",
              target: "SELF",
            },
          ],
        },
      },
      text: "TIME TO MOVE When you play this character, you may put 2 character cards from your discard on the bottom of your deck to give this character Rush this turn.",
    },
  ],
  i18n: rollerBobSidsToyI18n,
};
