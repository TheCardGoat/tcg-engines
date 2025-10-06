import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maxLoyalSheepdog: LorcanaCharacterCardDefinition = {
  id: "zmv",
  name: "Max",
  title: "Loyal Sheepdog",
  characteristics: ["storyborn", "ally"],
  text: "**HERE BOY** If you have a character named Prince Eric in play, you pay 1 {I} less to play this character.",
  type: "character",
  abilities: [
    whenYouPlayThisForEachYouPayLess({
      name: "Loyal",
      text: "If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
      amount: 1,
      conditions: [ifYouHaveCharacterNamed("Prince Eric")],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  illustrator: "Stefano Zanchi",
  number: 14,
  set: "URR",
  rarity: "common",
};
