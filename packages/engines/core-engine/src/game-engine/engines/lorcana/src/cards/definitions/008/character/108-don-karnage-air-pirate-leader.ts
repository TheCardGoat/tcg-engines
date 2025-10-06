import { chosenCharacterGainsRecklessDuringNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { wheneverYouPlayAnActionNotASong } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donKarnageAirPirateLeader: LorcanaCharacterCardDefinition = {
  id: "gku",
  name: "Don Karnage",
  title: "Air Pirate Leader",
  characteristics: ["storyborn", "villain", "prince", "pirate"],
  text: "Evasive\nSCORNFUL TAUNT Whenever you play an action that isn't a song, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  type: "character",
  abilities: [
    evasiveAbility,
    wheneverYouPlayAnActionNotASong({
      name: "SCORNFUL TAUNT",
      text: "Whenever you play an action that isn't a song, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
      optional: true,
      effects: [chosenCharacterGainsRecklessDuringNextTurn],
    }),
  ],
  inkwell: false,
  colors: ["emerald", "steel"],
  cost: 3,
  strength: 3,
  willpower: 2,
  illustrator: "Leonardo Giammichele",
  number: 108,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
