import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theHuntsmanReluctantEnforcer: LorcanaCharacterCardDefinition = {
  id: "f1a",

  name: "The Huntsman",
  title: "Reluctant Enforcer",
  characteristics: ["storyborn", "ally"],
  text: "**CHANGE OF HEART** Whenever this character quests, you may draw a card, then choose and discard a card.",
  type: "character",
  abilities: [
    wheneverQuests({
      ...youMayDrawThenChooseAndDiscard,
      name: "Change of Heart",
      text: "Whenever this character quests, you may draw a card, then choose and discard a card.",
    }),
  ],
  flavour: "Run away, hide! In the woods, anywhere!",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  illustrator: "Gaku Kumatori",
  number: 194,
  set: "ROF",
  rarity: "common",
};
