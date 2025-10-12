// TODO: Once the set is released, we organize the cards by set and type

// for tiana's effect, should remove and put into it's own var
import type { TriggeredAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tianaRestaurantOwner: LorcanaCharacterCardDefinition = {
  id: "mxx",
  missingTestCase: true,
  name: "Tiana",
  title: "Restaurant Owner",
  characteristics: ["storyborn", "hero", "princess"],
  text: "SPECIAL RESERVATION Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Special Reservation",
      text: "Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
      conditions: [{ type: "exerted" }],
      trigger: {
        on: "challenge",
        target: {
          type: "card",
          value: "all",
          filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
          ],
        },
      },
      responder: "opponent",
      optional: true,
      unless: true,
      costs: [{ type: "ink", amount: 3 }],
      effects: [],
      onCancelLayer: {
        type: "resolution",
        effects: [
          {
            type: "attribute",
            attribute: "strength",
            amount: 3,
            modifier: "subtract",
            duration: "turn",
            target: {
              type: "card",
              value: "all",
              filters: [{ filter: "challenge", value: "attacker" }],
            },
          },
        ],
      },
    } as any,
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Marine Josephine",
  number: 16,
  set: "006",
  rarity: "legendary",
};
