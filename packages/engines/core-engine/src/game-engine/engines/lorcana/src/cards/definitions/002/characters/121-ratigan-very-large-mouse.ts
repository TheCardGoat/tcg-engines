import { readyAndCantQuest } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { anotherChosenCharOfYours } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ratiganVeryLargeMouse: LorcanaCharacterCardDefinition = {
  id: "vl3",
  name: "Ratigan",
  title: "Very Large Mouse",
  characteristics: ["storyborn", "villain"],
  text: "**THIS IS MY KINGDOM** When you play this character, exert chosen opposing character with 3 {S} or less. Chose one of your characters and ready them. They can't quest for the rest of this turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "This Is My Kingdom",
      text: "When you play this character, chose one of your characters and ready them. They can't quest for the rest of this turn.",
      effects: readyAndCantQuest(anotherChosenCharOfYours),
    },
    {
      type: "resolution",
      name: "This Is My Kingdom",
      text: "When you play this character, exert chosen opposing character with 3 {S} or less.",
      effects: [
        {
          type: "exert",
          exert: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "opponent" },
              {
                filter: "attribute",
                value: "strength",
                comparison: { operator: "lte", value: 3 },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour: "This time, nothing, not even Basil, can stand in my way!",
  colors: ["ruby"],
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Valerio Buonfantino",
  number: 121,
  set: "ROF",
  rarity: "rare",
};
