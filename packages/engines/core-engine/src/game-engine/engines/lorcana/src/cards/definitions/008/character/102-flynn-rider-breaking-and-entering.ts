import {
  discardACard,
  yourOpponentGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenChallenged } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const flynnRiderBreakingAndEntering: LorcanaCharacterCardDefinition = {
  id: "v6l",
  name: "Flynn Rider",
  title: "Breaking and Entering",
  characteristics: ["storyborn", "hero", "prince"],
  text: "THIS IS A VERY BIG DAY Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
  type: "character",
  inkwell: false,
  colors: ["emerald"],
  cost: 4,
  strength: 1,
  willpower: 4,
  illustrator: "Koni",
  number: 102,
  set: "008",
  rarity: "super_rare",
  lore: 3,
  abilities: [
    whenChallenged({
      name: "THIS IS A VERY BIG DAY",
      text: "Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
      responder: "opponent",
      conditions: [
        {
          type: "filter",
          filters: [
            { filter: "zone", value: "hand" },
            { filter: "owner", value: "opponent" },
          ],
          comparison: { operator: "gte", value: 1 },
        },
      ],
      effects: [
        {
          type: "modal",
          // TODO: Get rid of target
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "You discard a card.",
              effects: [discardACard],
              responder: "opponent",
            },
            {
              id: "2",
              text: "Your opponent gains 2 lore.",
              effects: [yourOpponentGainLore(2)],
              responder: "opponent",
            },
          ],
        },
      ],
    }),
  ],
};
