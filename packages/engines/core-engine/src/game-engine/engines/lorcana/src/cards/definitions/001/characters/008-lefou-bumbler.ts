import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lefouBumbler: LorcanaCharacterCardDefinition = {
  id: "eal",
  name: "Lefou",
  title: "Bumbler",
  characteristics: ["storyborn", "ally"],
  text: "**LOYAL** If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
  type: "character",
  abilities: [
    whenYouPlayThisForEachYouPayLess({
      name: "Loyal",
      text: "If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
      amount: 1,
      conditions: [ifYouHaveCharacterNamed("Gaston")],
    }),
  ],
  flavour: "You need a good toady to be a proper bad guy.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  illustrator: "Andrey Chomak",
  number: 8,
  set: "TFC",
  rarity: "uncommon",
};
