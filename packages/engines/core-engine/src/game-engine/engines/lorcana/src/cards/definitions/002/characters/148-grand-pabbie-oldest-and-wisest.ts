import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverYouHeal } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const grandPabbieOldestAndWisest: LorcanitoCharacterCardDefinition = {
  id: "dy0",
  reprints: ["rj4"],
  name: "Grand Pabbie",
  title: "Oldest and Wisest",
  characteristics: ["storyborn", "mentor"],
  text: "**ANCIENT INSIGHT** Whenever you remove 1 or more damage from one of your characters, gain 2 lore.",
  type: "character",
  abilities: [
    wheneverYouHeal({
      name: "Ancient Insight",
      text: "Whenever you remove 1 or more damage from one of your characters, gain 2 lore.",
      effects: [
        {
          type: "lore",
          modifier: "add",
          amount: 2,
          target: self,
        },
      ],
    }),
  ],
  flavour: "When he talks, even sky listens.",
  colors: ["sapphire"],
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 3,
  illustrator: "Juan Diego Leon",
  number: 148,
  set: "ROF",
  rarity: "super_rare",
};
