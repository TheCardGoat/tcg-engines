import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const megaraPartOfThePlan: LorcanaCharacterCardDefinition = {
  id: "yxa",
  name: "Megara",
  title: "Part of the Plan",
  characteristics: ["dreamborn", "ally"],
  text: "CONTENTIOUS ALLIANCE While you have a character named Hades in play, this character gains Challenger +2. (They get +2 {S} while challenging.)",
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 2,
  willpower: 5,
  illustrator: "Samantha Ohlin",
  number: 54,
  set: "008",
  rarity: "common",
  lore: 1,
  abilities: [
    whileYouHaveACharacterNamedThisCharGains({
      name: "CONTENTIOUS ALLIANCE",
      text: "While you have a character named Hades in play, this character gains Challenger +2.",
      characterName: "Hades",
      ability: challengerAbility(2),
    }),
  ],
};
