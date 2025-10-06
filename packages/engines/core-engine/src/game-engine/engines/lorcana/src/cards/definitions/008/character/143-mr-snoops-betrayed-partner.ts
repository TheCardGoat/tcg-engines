import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { whenThisCharacterBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mrSnoopsBetrayedPartner: LorcanaCharacterCardDefinition = {
  id: "tc2",
  name: "Mr. Snoops",
  title: "Betrayed Partner",
  characteristics: ["storyborn", "ally"],
  text: "DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card.",
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "nocturne",
  number: 143,
  set: "008",
  rarity: "common",
  lore: 1,
  abilities: [
    whenThisCharacterBanished({
      name: "DOUBLE-CROSSING CROOK!",
      text: "During your turn, when this character is banished, you may draw a card.",
      conditions: [{ type: "during-turn", value: "self" }],
      optional: true,
      effects: [drawACard],
    }),
  ],
};
