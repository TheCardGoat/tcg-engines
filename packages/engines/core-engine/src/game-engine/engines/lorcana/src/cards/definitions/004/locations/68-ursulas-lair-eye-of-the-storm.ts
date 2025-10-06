import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import { returnThisCardToHand } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenThisCharacterBanishedInAChallenge } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulasLairEyeOfTheStorm: LorcanaLocationCardDefinition = {
  id: "tj7",
  missingTestCase: true,
  name: "Ursula's Lair",
  title: "Eye of the Storm",
  characteristics: ["location"],
  text: "**SLIPPERY HALLS** Whenever a characters is banished in a challenge while here, you may return them to your hand. \n\n\n**SEAT OF POWER** Characters named Ursula get +1 {L} while here.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "Seat of Power",
      text: "Characters named Ursula get +1 {L} while here.",
      ability: {
        type: "static",
        ability: "effects",
        effects: [
          {
            type: "attribute",
            attribute: "lore",
            amount: 1,
            modifier: "add",
            duration: "static",
            target: {
              type: "card",
              value: "all",
              filters: [
                { filter: "source", value: "self" },
                {
                  filter: "attribute",
                  value: "name",
                  comparison: { operator: "eq", value: "ursula" },
                },
              ],
            },
          },
        ],
      },
    }),
    gainAbilityWhileHere({
      name: "Slippery Halls",
      text: "Whenever a characters is banished in a challenge while here, you may return them to your hand.",
      ability: whenThisCharacterBanishedInAChallenge({
        name: "Slippery Halls",
        text: "Whenever a characters is banished in a challenge while here, you may return them to your hand.",
        optional: true,
        effects: [returnThisCardToHand],
      }),
    }),
  ],
  colors: ["amethyst"],
  cost: 3,
  moveCost: 2,
  willpower: 6,
  lore: 1,
  illustrator: "Eri Welli / Sam Burley",
  number: 68,
  set: "URR",
  rarity: "rare",
};
