import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rayaFierceProtector: LorcanaCharacterCardDefinition = {
  id: "bcw",
  name: "Raya",
  title: "Fierce Protector",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**DON'T CROSS ME** Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.",
  type: "character",
  abilities: [
    wheneverChallengesAnotherChar({
      name: "**DON'T CROSS ME**",
      text: "Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.",
      effects: [
        youGainLore({
          dynamic: true,
          filters: [
            { filter: "zone", value: "play" },
            { filter: "status", value: "damaged" },
            { filter: "owner", value: "self" },
            { filter: "source", value: "other" },
          ],
        }),
      ],
    }),
  ],
  flavour: "You're going to fight an entire army? \n−Sisu",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Peter Brockhammer",
  number: 121,
  set: "URR",
  rarity: "super_rare",
};
