import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverTargetPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicBroomIlluminaryKeeper: LorcanaCharacterCardDefinition = {
  id: "kgu",
  name: "Magic Broom",
  title: "Illuminary Keeper",
  characteristics: ["dreamborn", "broom"],
  text: "**NICE AND TIDY** Whenever you play another character, you man banish this character to draw a card.",
  type: "character",
  abilities: [
    wheneverTargetPlays({
      name: "NICE AND TIDY",
      text: "Whenever you play another character, you may banish this character to draw a card.",
      optional: true,
      costs: [{ type: "banish" }],
      excludeSelf: true,
      triggerFilter: [
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
      ],
      effects: [
        {
          type: "draw",
          amount: 1,
          target: self,
        },
      ],
    }),
    {
      name: "**NICE AND TIDY** Whenever you play another character, you man banish this character to draw a card.",
    },
  ],
  flavour: "Just a few barnacles away from retirement...",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Eva Wildermann",
  number: 48,
  set: "URR",
  rarity: "common",
};
