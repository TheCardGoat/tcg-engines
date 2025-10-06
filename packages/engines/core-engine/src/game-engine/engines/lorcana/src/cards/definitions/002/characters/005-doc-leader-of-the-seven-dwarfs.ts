import { youPayXLessToPlayNextCharThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const docLeaderOfTheSevenDwarfs: LorcanitoCharacterCardDefinition = {
  id: "fek",
  name: "Doc",
  title: "Leader of the Seven Dwarfs",
  characteristics: ["storyborn", "ally", "seven dwarfs"],
  text: "**SHARE AND SHARE ALIKE** Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Share and Share Alike",
      text: "Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
      effects: [youPayXLessToPlayNextCharThisTurn(1)],
    }),
  ],
  flavour: "He's in charge of this outfit.",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Kendall Hale",
  number: 5,
  set: "ROF",
  rarity: "uncommon",
};
