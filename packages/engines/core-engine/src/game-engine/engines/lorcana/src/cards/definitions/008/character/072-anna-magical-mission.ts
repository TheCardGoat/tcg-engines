import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import {
  shiftAbility,
  supportAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const annaMagicalMission: LorcanaCharacterCardDefinition = {
  id: "uvp",
  name: "Anna",
  title: "Magical Mission",
  characteristics: ["floodborn", "hero", "queen", "sorcerer"],
  text: "Shift 4 \nSupport \nCOORDINATED PLAN Whenever this character quests, if you have a character named Elsa in play, you may draw a card.",
  type: "character",
  abilities: [
    shiftAbility(4, "Anna"),
    supportAbility,
    wheneverThisCharacterQuests({
      name: "COORDINATED PLAN",
      text: "Whenever this character quests, if you have a character named Elsa in play, you may draw a card.",
      optional: true,
      conditions: [ifYouHaveCharacterNamed(["Elsa"])],
      effects: [drawACard],
    }),
  ],
  inkwell: true,
  colors: ["amethyst", "sapphire"],
  cost: 6,
  strength: 3,
  willpower: 6,
  illustrator: "Luigi Aimè",
  number: 72,
  set: "008",
  rarity: "rare",
  lore: 2,
};
