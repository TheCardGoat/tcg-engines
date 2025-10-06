import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const panicImmortalSidekick: LorcanaCharacterCardDefinition = {
  id: "eii",
  missingTestCase: true,
  name: "Panic",
  title: "Immortal Sidekick",
  characteristics: ["storyborn", "ally"],
  text: "**REPORTING FOR DUTY** While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "Reporting for Duty",
      text: "While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
      conditions: [{ type: "exerted" }, ifYouHaveCharacterNamed("Pain")],
      effects: [
        {
          type: "restriction",
          restriction: "be-challenged",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "characteristics", value: ["villain"] },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    "We absolutely took care of that thing, boss. No problems, just great.",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Oggy Christiansson",
  number: 82,
  set: "URR",
  rarity: "uncommon",
};
