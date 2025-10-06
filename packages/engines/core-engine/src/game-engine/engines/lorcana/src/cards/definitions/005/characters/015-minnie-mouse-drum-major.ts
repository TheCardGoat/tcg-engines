import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMouseDrumMajor: LorcanaCharacterCardDefinition = {
  id: "p4a",
  name: "Minnie Mouse",
  title: "Drum Major",
  characteristics: ["hero", "floodborn"],
  text: "**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Minnie Mouse.)_\n \n**PARADE ORDER** When you play this character, if you used **Shift** to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
  type: "character",
  abilities: [
    shiftAbility(4, "Minnie Mouse"),
    {
      type: "resolution",
      name: "PARADE ORDER",
      text: "When you play this character, if you used **Shift** to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
      resolutionConditions: [{ type: "resolution", value: "shift" }],
      effects: [
        {
          type: "shuffle-deck",
          target: self,
        },
        {
          type: "move",
          to: "deck",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "deck" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  illustrator: "Roger Pérez / Leonardo Giammichele",
  number: 15,
  set: "SSK",
  rarity: "super_rare",
};
