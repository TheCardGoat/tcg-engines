import {
  evasiveAbility,
  shiftAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverAnotherCharIsBanishedInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const yzmaAboveItAll: LorcanitoCharacterCard = {
  id: "zav",
  name: "Yzma",
  title: "Above It All",
  characteristics: ["floodborn", "villain", "queen"],
  text: "Shift 5\nEvasive\nBACK TO WORK Whenever another character is banished in a challenge, return that card to its player's hand, then that player discards a card at random.",
  type: "character",
  abilities: [
    shiftAbility(5, "Yzma"),
    evasiveAbility,
    wheneverAnotherCharIsBanishedInChallenge({
      name: "BACK TO WORK",
      text: "Whenever another character is banished in a challenge, return that card to its player's hand, then that player discards a card at random.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "trigger" }],
          },
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              // TODO: get rid of target
              target: thisCharacter,
              responder: "target_card_owner",
              effects: [
                {
                  type: "discard",
                  amount: 1,
                  target: {
                    type: "card",
                    value: 1,
                    random: true,
                    filters: [
                      { filter: "zone", value: "hand" },
                      { filter: "owner", value: "self" },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amethyst", "emerald"],
  cost: 7,
  strength: 3,
  willpower: 8,
  illustrator: "Cristian Romero",
  number: 68,
  set: "007",
  rarity: "super_rare",
  lore: 2,
};
