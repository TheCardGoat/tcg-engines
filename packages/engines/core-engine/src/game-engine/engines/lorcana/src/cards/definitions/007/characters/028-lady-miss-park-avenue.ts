import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ladyMissParkAvenue: LorcanitoCharacterCardDefinition = {
  id: "r02",
  name: "Lady",
  title: "Miss Park Avenue",
  characteristics: ["floodborn", "hero"],
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lady.)\nSOMETHING WONDERFUL When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.",
  type: "character",
  abilities: [
    shiftAbility(3, "Lady"),
    whenYouPlayThis({
      name: "Miss Park Avenue",
      text: "When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            upTo: true,
            value: 2,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "discard" },
              { filter: "owner", value: "self" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 2 },
              },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: false,
  // @ts-expect-error
  color: "",
  colors: ["amber", "emerald"],
  cost: 5,
  strength: 4,
  willpower: 4,
  illustrator: "João Moura",
  number: 28,
  set: "007",
  rarity: "super_rare",
  lore: 2,
};
