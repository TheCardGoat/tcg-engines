import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentVexedPartygoerI18n } from "./051-maleficent-vexed-partygoer.i18n";

export const maleficentVexedPartygoer: CharacterCard = {
  id: "3T9",
  canonicalId: "ci_3T9",
  reprints: ["set5-051"],
  cardType: "character",
  name: "Maleficent",
  version: "Vexed Partygoer",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "005",
  cardNumber: 51,
  rarity: "uncommon",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ec332a15608840ad942e800aa7b17294",
    tcgPlayer: 561614,
  },
  text: [
    {
      title: "WHAT AN AWKWARD SITUATION",
      description:
        "Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              type: "discard",
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
            },
            type: "optional",
          },
          {
            condition: {
              type: "if-you-do",
            },
            then: {
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character", "item", "location"],
                filter: [
                  {
                    type: "cost-comparison",
                    comparison: "less-or-equal",
                    value: 3,
                  },
                ],
              },
              type: "return-to-hand",
            },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      id: "1ib-1",
      name: "WHAT AN AWKWARD SITUATION",
      text: "WHAT AN AWKWARD SITUATION Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player's hand.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: maleficentVexedPartygoerI18n,
};
