import type { CharacterCard } from "@tcg/lorcana-types";
import { motherGothelKnowsWhatsBestI18n } from "./070-mother-gothel-knows-whats-best.i18n";

export const motherGothelKnowsWhatsBest: CharacterCard = {
  id: "pK5",
  canonicalId: "ci_AXE",
  reprints: ["set8-070"],
  cardType: "character",
  name: "Mother Gothel",
  version: "Knows What's Best",
  inkType: ["amethyst", "ruby"],
  franchise: "Tangled",
  set: "008",
  cardNumber: 70,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a44f1da598c94ec18b4060bb1e932c66",
    tcgPlayer: 632208,
  },
  text: [
    {
      title: "LOOK WHAT YOU'VE DONE",
      description:
        'When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +1 {S} while challenging.)',
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 2,
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                excludeSelf: true,
              },
              type: "deal-damage",
            },
            {
              keyword: "Challenger",
              target: {
                ref: "previous-target",
              },
              type: "gain-keyword",
              value: 1,
              duration: "this-turn",
            },
            {
              type: "grant-ability",
              ability: "return-to-hand-when-banished",
              duration: "this-turn",
              target: {
                ref: "previous-target",
              },
            },
          ],
        },
        type: "optional",
      },
      id: "1pt-1",
      name: "LOOK WHAT YOU'VE DONE",
      text: 'LOOK WHAT YOU\'VE DONE When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and "When this character is banished in a challenge, return this card to your hand" this turn.',
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: motherGothelKnowsWhatsBestI18n,
};
