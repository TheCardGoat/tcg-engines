import { anotherChosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import {
  dealDamageEffect,
  drawXCards,
} from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const shortOnPatience = whenPlayAndWheneverQuests({
  name: "SHORT ON PATIENCE",
  text: "When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.",
  optional: true,
  dependentEffects: true,
  effects: [dealDamageEffect(2, anotherChosenCharacterOfYours), drawXCards(2)],
});

export const hadesRuthlessTyrant: LorcanaCharacterCardDefinition = {
  id: "xoz",
  name: "Hades",
  title: "Ruthless Tyrant",
  characteristics: ["dreamborn", "villain", "deity"],
  text: "SHORT ON PATIENCE When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.",
  type: "character",
  abilities: shortOnPatience,
  inkwell: false,
  colors: ["amethyst", "ruby"],
  cost: 7,
  strength: 3,
  willpower: 6,
  illustrator: "Marcel Berg",
  number: 48,
  set: "008",
  rarity: "super_rare",
  lore: 2,
};
