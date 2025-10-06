import { haveItemInDiscard } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lumiereNimbleCandelabra: LorcanaCharacterCardDefinition = {
  id: "pb6",
  name: "Lumiere",
  title: "Nimble Candelabra",
  characteristics: ["storyborn", "ally"],
  text: "QUICK-STEP While you have an item card in your discard, this character gains Evasive. (Only characters with Evasive can challenge them.)",
  type: "character",
  abilities: [
    whileConditionThisCharacterGains({
      name: "QUICK-STEP",
      text: "While you have an item card in your discard, this character gains Evasive. (Only characters with Evasive can challenge them.)",
      conditions: [haveItemInDiscard],
      ability: evasiveAbility,
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 1,
  willpower: 1,
  illustrator: "Heidi Neunhoffer",
  number: 128,
  set: "008",
  rarity: "common",
  lore: 2,
};
