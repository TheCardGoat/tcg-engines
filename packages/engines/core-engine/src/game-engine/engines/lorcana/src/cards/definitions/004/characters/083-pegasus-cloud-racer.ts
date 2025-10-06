import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pegasusCloudRacer: LorcanaCharacterCardDefinition = {
  id: "p3p",
  name: "Pegasus",
  title: "Cloud Racer",
  characteristics: ["floodborn", "ally"],
  text: "**Shift** 3 _You may pay 3 {I} to play this on top of one of your characters named Pegasus.)_\n\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n\n**HOP ON!** When you play this character, if you used **Shift** to play him, your characters gain **Evasive** until the start of your next turn.",
  type: "character",
  abilities: [
    shiftAbility(3, "pegasus"),
    evasiveAbility,
    {
      type: "resolution",
      name: "HOP ON!",
      text: "When you play this character, if you used **Shift** to play him, your characters gain **Evasive** until the start of your next turn.",
      resolutionConditions: [{ type: "resolution", value: "shift" }],
      effects: [
        {
          type: "ability",
          ability: "evasive",
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Brian Weisz",
  number: 83,
  set: "URR",
  rarity: "uncommon",
};
