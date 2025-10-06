import { opponentCantPlayActions } from "@lorcanito/lorcana-engine/effects/effects";
import {
  resistAbility,
  type StaticAbilityWithEffect,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tianaCelebratingPrincess: LorcanitoCharacterCardDefinition = {
  id: "nyj",
  name: "Tiana",
  title: "Celebrating Princess",
  characteristics: ["hero", "dreamborn", "princess"],
  text: "**Resist** +2 _(Damage dealt to this character is reduced by 2.)_\n\n**WHAT YOU GIVE IS WHAT YOU GET** While this character is exerted and you have no cards in your hand, opponents can't play actions.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "What You Give Is What You Get",
      text: "While this character is exerted and you have no cards in your hand, opponents can't play actions.",
      conditions: [
        { type: "hand", amount: 0, player: "self" },
        { type: "exerted" },
      ],
      effects: [opponentCantPlayActions],
    } as StaticAbilityWithEffect,
    resistAbility(2),
  ],
  colors: ["steel"],
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Matthew Robert Davies",
  number: 196,
  set: "ROF",
  rarity: "super_rare",
};
