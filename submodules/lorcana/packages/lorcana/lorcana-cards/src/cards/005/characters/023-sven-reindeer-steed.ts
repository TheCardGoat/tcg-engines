import type { CharacterCard } from "@tcg/lorcana-types";
import { svenReindeerSteedI18n } from "./023-sven-reindeer-steed.i18n";

export const svenReindeerSteed: CharacterCard = {
  id: "DzB",
  canonicalId: "ci_DzB",
  reprints: ["set5-023"],
  cardType: "character",
  name: "Sven",
  version: "Reindeer Steed",
  inkType: ["amber"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 23,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a35ce7543f7e4af49eb325083776e061",
    tcgPlayer: 559714,
  },
  text: [
    {
      title: "REINDEER GAMES",
      description:
        "When you play this character, you may ready chosen character. They can't quest or challenge for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "ready",
              target: {
                cardTypes: ["character"],
                count: 1,
                owner: "any",
                selector: "chosen",
                zones: ["play"],
              },
            },
            {
              duration: "this-turn",
              restriction: "cant-quest-or-challenge",
              target: {
                cardTypes: ["character"],
                count: 1,
                owner: "any",
                selector: "chosen",
                zones: ["play"],
              },
              type: "restriction",
            },
          ],
        },
        type: "optional",
      },
      id: "m3t-1",
      name: "REINDEER GAMES",
      text: "REINDEER GAMES When you play this character, you may ready chosen character. They can't quest or challenge for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: svenReindeerSteedI18n,
};
