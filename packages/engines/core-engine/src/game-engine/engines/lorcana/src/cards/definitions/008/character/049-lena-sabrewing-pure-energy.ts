import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { putDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lenaSabrewingPureEnergy: LorcanaCharacterCardDefinition = {
  id: "ix0",
  name: "Lena Sabrewing",
  title: "Pure Energy",
  characteristics: ["dreamborn", "hero", "sorcerer"],
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSUPERNATURAL VENGEANCE {E} – Deal 1 damage to chosen character.",
  type: "character",
  abilities: [
    evasiveAbility,
    {
      type: "activated",
      name: "SUPERNATURAL VENGEANCE",
      text: "{E} – Deal 1 damage to chosen character.",
      costs: [{ type: "exert" }],
      effects: [putDamageEffect(1, chosenCharacter)],
    },
  ],
  inkwell: true,
  colors: ["amethyst", "steel"],
  cost: 3,
  strength: 1,
  willpower: 3,
  illustrator: "Federico Maria Cugliari",
  number: 49,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
