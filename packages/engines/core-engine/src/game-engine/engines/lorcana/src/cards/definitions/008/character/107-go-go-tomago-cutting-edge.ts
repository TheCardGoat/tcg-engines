import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goGoTomagoCuttingEdge: LorcanaCharacterCardDefinition = {
  id: "j8q",
  name: "Go Go Tomago",
  title: "Cutting Edge",
  characteristics: ["floodborn", "hero", "inventor"],
  text: "Shift 4\nEvasive (Only characters with Evasive can challenge this character.)\nZERO RESISTANCE When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.",
  type: "character",
  abilities: [
    shiftAbility(4, "Go Go Tomago"),
    evasiveAbility,
    whenYouPlayThisCharacter({
      name: "ZERO RESISTANCE",
      text: "When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.",
      conditions: [{ type: "resolution", value: "shift" }],
      optional: true,
      effects: [
        {
          type: "move",
          to: "inkwell",
          target: chosenCharacter,
          isPrivate: false,
          exerted: true,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["emerald", "sapphire"],
  cost: 4,
  strength: 3,
  willpower: 3,
  illustrator: "Beno Mel",
  number: 107,
  set: "008",
  rarity: "super_rare",
  lore: 2,
};
