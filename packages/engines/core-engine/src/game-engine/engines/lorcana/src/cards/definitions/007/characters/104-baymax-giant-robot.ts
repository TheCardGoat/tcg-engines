import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const baymaxGiantRobot: LorcanaCharacterCardDefinition = {
  id: "yc9",
  name: "Baymax",
  title: "Giant Robot",
  characteristics: ["floodborn", "hero", "robot"],
  text: "Universal Shift 4 (You may pay 4 {I} to play this on top of any one of your characters.)\nFUNCTIONALITY IMPROVED When you play this character, if you used Shift to play him, remove all damage from him.",
  type: "character",
  abilities: [
    shiftAbility(4, []),
    whenYouPlayThis({
      name: "FUNCTIONALITY IMPROVED",
      text: "When you play this character, if you used Shift to play him, remove all damage from him.",
      conditions: [{ type: "resolution", value: "shift" }],
      effects: [
        {
          type: "heal",
          amount: 99,
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: false,
  // @ts-expect-error
  color: "",
  colors: ["emerald", "sapphire"],
  cost: 6,
  strength: 5,
  willpower: 5,
  illustrator: "Valerio Buonfantino",
  number: 104,
  set: "007",
  rarity: "uncommon",
  lore: 2,
};
