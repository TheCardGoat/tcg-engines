import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverTargetPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bambiLittlePrince: LorcanaCharacterCardDefinition = {
  id: "bxw",
  name: "Bambi",
  title: "Little Prince",
  characteristics: ["storyborn", "hero", "prince"],
  text: "SAY HELLO When you play this character, gain 1 lore.\nKIND OF BASHFUL When an opponent plays a character, return this character to your hand.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      effects: [youGainLore(1)],
    }),
    wheneverTargetPlays({
      name: "KIND OF BASHFUL",
      text: "When an opponent plays a character, return this character to your hand.",
      // pending confirmation if all returning to hand should be from play to hand.
      // This Card always mean from play, but changing this is too risky so I'm not doing now.
      // effects: [returnThisCardToHand],
      effects: [
        {
          type: "move",
          to: "hand",
          from: "play",
          target: thisCharacter,
        },
      ],
      triggerFilter: [
        { filter: "owner", value: "opponent" },
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 3,
  strength: 1,
  willpower: 1,
  illustrator: "Brian Weiss",
  number: 63,
  set: "008",
  rarity: "rare",
  lore: 3,
};
