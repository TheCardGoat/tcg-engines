import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import { duringOpponentsTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenThisCharacterBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";

export const hundredAcreIslandPoohsHome: LorcanaLocationCardDefinition = {
  id: "qkp",
  missingTestCase: true,
  name: "Hundred Acre Island",
  title: "Pooh's Home",
  characteristics: ["location"],
  text: "FRIENDS FOREVER During an opponent's turn, whenever a character is banished here, gain 1 lore.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "Friends Forever",
      text: "During an opponent's turn, whenever a character is banished here, gain 1 lore.",
      conditions: [duringOpponentsTurn],
      ability: whenThisCharacterBanished({
        name: "Friends Forever",
        text: "During an opponent's turn, whenever a character is banished here, gain 1 lore.",
        effects: [
          {
            type: "lore",
            amount: 1,
            modifier: "add",
            target: self,
          },
        ],
      }),
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  willpower: 5,
  moveCost: 1,
  illustrator: "Andreas Rocha",
  number: 34,
  set: "006",
  rarity: "common",
};
