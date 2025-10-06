import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import {
  duringYourTurnThisCharacterGains,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const zipperFlyingRanger: LorcanaCharacterCardDefinition = {
  id: "ql7",
  name: "Zipper",
  title: "Flying Ranger",
  characteristics: ["storyborn", "ally"],
  text: "BEST MATES If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  type: "character",
  abilities: [
    whenYouPlayThisForEachYouPayLess({
      name: "BEST MATES",
      text: "If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.",
      amount: 1,
      conditions: [ifYouHaveCharacterNamed("Monterey Jack")],
    }),
    duringYourTurnThisCharacterGains({
      name: "BURST OF SPEED",
      text: "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      ability: evasiveAbility,
      conditions: [],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 4,
  illustrator: "Ian MacDonald",
  number: 192,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
