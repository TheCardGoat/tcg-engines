import { ifYouHaveCharacterNamed } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { drawACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mrsPottsEnchantedTeapot: LorcanaCharacterCardDefinition = {
  id: "rxo",
  missingTestCase: true,
  name: "Mrs. Potts",
  title: "Enchanted Teapot",
  characteristics: ["storyborn", "ally"],
  text: "**IT'LL TURN OUT ALL RIGHT** When you play this characters, if you have a character named Lumiere or Cogsworth in play, you may draw a card.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "It'll Turn Out All Right",
      text: "When you play this characters, if you have a character named Lumiere or Cogsworth in play, you may draw a card.",
      conditions: [ifYouHaveCharacterNamed(["Lumiere", "Cogsworth"])],
      optional: true,
      effects: [drawACard],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Verionica Di Lorenzo / Livic Cacciatore",
  number: 52,
  set: "URR",
  rarity: "rare",
};
