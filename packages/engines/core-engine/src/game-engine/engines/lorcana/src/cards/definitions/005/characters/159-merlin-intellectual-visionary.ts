import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const merlinIntellectualVisionary: LorcanaCharacterCardDefinition = {
  id: "cmp",
  missingTestCase: true,
  name: "Merlin",
  title: "Intellectual Visionary",
  characteristics: ["floodborn", "sorcerer", "mentor"],
  text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Merlin.)_**OVERDEVELOPED BRAIN** When you play this character, if you used **Shift** to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.",
  type: "character",
  abilities: [
    shiftAbility(5, "Merlin"),
    {
      type: "resolution",
      name: "Overdeveloped Brain",
      text: "When you play this character, if you used **Shift** to play him, you may search your deck for any card, put that card into your hand, then shuffle your deck.",
      resolutionConditions: [{ type: "resolution", value: "shift" }],
      effects: [
        {
          type: "shuffle-deck",
          target: self,
        },
        {
          type: "move",
          to: "hand",
          isPrivate: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "deck" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  colors: ["sapphire"],
  cost: 6,
  strength: 3,
  willpower: 7,
  lore: 2,
  illustrator: "Jake Parker",
  number: 159,
  set: "SSK",
  rarity: "legendary",
};
