import { whileThisCharacterIsExerted } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { yourCharactersNamed } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileConditionOnThisCharacterTargetsGain } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const name = "Brothers Forever";
const text =
  "While this character is exerted, your characters named Koda can't be challenged.";

export const kenaiBigBrother: LorcanaCharacterCardDefinition = {
  id: "v56",
  missingTestCase: true,
  name: "Kenai",
  title: "Big Brother",
  characteristics: ["hero", "storyborn"],
  text: "**BROTHERS FOREVER** While this character is exerted, your characters named Koda can't be challenged.",
  type: "character",
  abilities: [
    whileConditionOnThisCharacterTargetsGain({
      name,
      text,
      conditions: [whileThisCharacterIsExerted],
      target: yourCharactersNamed("Koda"),
      ability: {
        type: "static",
        ability: "effects",
        name,
        text,
        effects: [
          {
            type: "restriction",
            restriction: "be-challenged",
            target: yourCharactersNamed("Koda"),
            duration: "next_turn",
            until: true,
          },
        ],
      },
    }),
  ],
  flavour:
    "You have to look after your little brother, no matter how big a pain he is.\n—Kenai",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Chunxi Mu",
  number: 5,
  set: "SSK",
  rarity: "common",
};
