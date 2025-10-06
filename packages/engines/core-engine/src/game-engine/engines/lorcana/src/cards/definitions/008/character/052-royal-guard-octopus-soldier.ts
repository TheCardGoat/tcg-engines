import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverYouDrawACard } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const royalGuardOctopusSoldier: LorcanaCharacterCardDefinition = {
  id: "f5g",
  name: "Royal Guard",
  title: "Octopus Soldier",
  characteristics: ["storyborn"],
  text: "HEAVILY ARMED Every time you draw a card, this character gains Challenger +1 for this turn. (Gains +1 {S} while challenging.)",
  type: "character",
  abilities: [
    wheneverYouDrawACard({
      name: "HEAVILY ARMED",
      text: "Every time you draw a card, this character gains Challenger +1 for this turn. (Gains +1 {S} while challenging.)",
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Rachel Elese",
  number: 52,
  set: "008",
  rarity: "common",
  lore: 1,
};
