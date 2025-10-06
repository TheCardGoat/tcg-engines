import { drawACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const simbaLostPrince: LorcanaCharacterCardDefinition = {
  id: "ltv",
  missingTestCase: true,
  name: "Simba",
  title: "Lost Prince",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**FACE THE PAST** During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  type: "character",
  abilities: [
    wheneverBanishesAnotherCharacterInChallenge({
      name: "Face The Past",
      text: "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
      optional: true,
      effects: [drawACard],
    }),
  ],
  flavour: '"This is my kingdom. If I don\'t fight for it, who will?"',
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Alexandria Neonakis",
  number: 173,
  set: "SSK",
  rarity: "common",
};
