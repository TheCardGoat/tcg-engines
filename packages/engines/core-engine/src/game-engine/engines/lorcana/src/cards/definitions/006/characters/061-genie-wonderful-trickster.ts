// TODO: Once the set is released, we organize the cards by set and type

import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { atTheEndOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const genieWonderfulTrickster: LorcanaCharacterCardDefinition = {
  id: "s3l",
  name: "Genie",
  title: "Wonderful Trickster",
  characteristics: ["floodborn", "ally"],
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Genie.)\nYOUR REWARD AWAITS Whenever you play a card, draw a card.\nFORBIDDEN TREASURE At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
  type: "character",
  abilities: [
    shiftAbility(5, "Genie"),
    wheneverPlays({
      name: "Your Reward Awaits",
      text: "Whenever you play a card, draw a card.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [{ filter: "owner", value: "self" }],
      },
      effects: [drawACard],
    }),
    atTheEndOfYourTurn({
      name: "Forbidden Treasure",
      text: "At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
      effects: [
        {
          type: "move",
          to: "deck",
          bottom: true,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 7,
  strength: 4,
  willpower: 7,
  lore: 2,
  illustrator: "Mike Parker",
  number: 61,
  set: "006",
  rarity: "legendary",
};
