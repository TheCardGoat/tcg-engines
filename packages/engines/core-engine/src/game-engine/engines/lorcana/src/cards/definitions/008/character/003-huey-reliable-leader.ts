import { youPayXLessToPlayNextCharThisTurn } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hueyReliableLeader: LorcanaCharacterCardDefinition = {
  id: "w4f",
  name: "Huey",
  title: "Reliable Leader",
  characteristics: ["storyborn", "ally"],
  text: "I KNOW THE WAY Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "I KNOW THE WAY",
      text: "Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
      effects: [youPayXLessToPlayNextCharThisTurn(1)],
    }),
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 3,
  illustrator: "Federico Maria Cugliari",
  number: 3,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
