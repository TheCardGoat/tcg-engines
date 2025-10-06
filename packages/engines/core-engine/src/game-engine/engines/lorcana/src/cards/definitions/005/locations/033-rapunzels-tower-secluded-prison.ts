import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rapunzelsTowerSecludedPrison: LorcanaLocationCardDefinition = {
  id: "nva",
  missingTestCase: true,
  name: "Rapunzel's Tower",
  title: "Secluded Prison",
  characteristics: ["location"],
  text: "**SAFE AND SOUND** Characters get +3 {W} while here.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "Safe and Sound",
      text: "Characters get +3 {W} while here.",
      ability: {
        type: "static",
        ability: "effects",
        effects: [
          {
            type: "attribute",
            attribute: "willpower",
            amount: 3,
            modifier: "add",
            duration: "static",
            target: thisCharacter,
          },
        ],
      },
    }),
  ],
  flavour: "It's a scary world out there.\n—Mother Gothel",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  willpower: 8,
  lore: 0,
  illustrator: "Jeremy Adams",
  number: 33,
  set: "SSK",
  rarity: "uncommon",
  moveCost: 1,
};
