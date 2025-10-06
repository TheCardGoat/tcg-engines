import { duringYourTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { drawACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { wheneverYouReadyThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pinocchioStringsAttached: LorcanaCharacterCardDefinition = {
  id: "gvb",
  name: "Pinocchio",
  title: "Strings Attached",
  characteristics: ["storyborn", "hero"],
  text: "Evasive (Only characters with Evasive can challenge this character.)\nGOT TO KEEP REAL QUIET Once during your turn, whenever you ready this character, you may draw a card.",
  type: "character",
  abilities: [
    evasiveAbility,
    wheneverYouReadyThisCharacter({
      name: "GOT TO KEEP REAL QUIET",
      text: "Once during your turn, whenever you ready this character, you may draw a card.",
      optional: true,
      oncePerTurn: true,
      conditions: [duringYourTurn],
      effects: [drawACard],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 0,
  willpower: 4,
  illustrator: "Hedvig H.S",
  number: 61,
  set: "008",
  rarity: "legendary",
  lore: 2,
};
