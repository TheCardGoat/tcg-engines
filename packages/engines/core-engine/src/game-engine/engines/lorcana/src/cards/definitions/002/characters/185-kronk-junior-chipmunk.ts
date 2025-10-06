import {
  duringYourTurnWheneverBanishesCharacterInChallenge,
  resistAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kronkJuniorChipmunk: LorcanaCharacterCardDefinition = {
  id: "hv3",

  name: "Kronk",
  title: "Junior Chipmunk",
  characteristics: ["storyborn", "ally"],
  text: "**Resist** +1 _(Damage dealt to this character is reduced by 2.)_\n\n**SCOUT LEADER** During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.",
  type: "character",
  abilities: [
    resistAbility(1),
    // Same as TinkerBell's ability
    duringYourTurnWheneverBanishesCharacterInChallenge({
      name: "Scout Leader",
      text: "During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character",
      optional: true,
      effects: [
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  illustrator: "Brian Weisz",
  number: 185,
  set: "ROF",
  rarity: "rare",
};
