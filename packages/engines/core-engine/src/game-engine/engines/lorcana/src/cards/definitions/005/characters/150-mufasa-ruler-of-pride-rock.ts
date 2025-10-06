import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mufasaRulerOfPrideRock: LorcanaCharacterCardDefinition = {
  id: "rlb",
  name: "Mufasa",
  title: "Ruler of Pride Rock",
  characteristics: ["storyborn", "king", "mentor"],
  text: "**A DELICATE BALANCE** When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand. **EVERYTHING THE LIGHT TOUCHES** Whenever this character quests, ready all cards in your inkwell.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "A DELICATE BALANCE",
      text: "When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.",
      resolveEffectsIndividually: true,
      dependentEffects: true,
      effects: [
        {
          type: "exert",
          exert: true,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "inkwell" },
              { filter: "owner", value: "self" },
            ],
          },
        },
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 2,
            random: true,
            filters: [
              { filter: "zone", value: "inkwell" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
    wheneverQuests({
      name: "EVERYTHING THE LIGHT TOUCHES",
      text: "Whenever this character quests, ready all cards in your inkwell.",
      effects: [
        {
          type: "exert",
          exert: false,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "inkwell" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    }),
  ],
  colors: ["sapphire"],
  cost: 8,
  strength: 4,
  willpower: 9,
  lore: 4,
  illustrator: "Jeanne Plouvez",
  number: 150,
  set: "SSK",
  rarity: "legendary",
};
