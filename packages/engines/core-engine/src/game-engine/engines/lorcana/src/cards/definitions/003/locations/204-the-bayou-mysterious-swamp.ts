import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import { youMayDrawThenChooseAndDiscard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theBayouMysteriousSwamp: LorcanaLocationCardDefinition = {
  id: "tu0",
  type: "location",
  missingTestCase: true,
  name: "The Bayou",
  title: "Mysterious Swamp",
  characteristics: ["location"],
  text: "**SHOW ME THE WAY** Whenever a character quests while here, you may draw a card, then choose and discard a card.",
  abilities: [
    gainAbilityWhileHere({
      name: "Show me the way",
      text: "Whenever a character quests while here, you may draw a card, then choose and discard a card.",
      ability: wheneverQuests({
        ...youMayDrawThenChooseAndDiscard,
        name: "Show me the way",
        text: "Whenever a character quests while here, you may draw a card, then choose and discard a card.",
      }),
    }),
  ],
  flavour: "A place to find what you need, not just what you want.",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  willpower: 3,
  lore: 1,
  moveCost: 1,
  illustrator: "Ryan Moeck",
  number: 204,
  set: "ITI",
  rarity: "uncommon",
};
