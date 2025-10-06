import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverYouReadyThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const christopherRobinAdventurer: LorcanaCharacterCardDefinition = {
  id: "yf4",
  name: "Christopher Robin",
  title: "Adventurer",
  characteristics: ["hero", "dreamborn"],
  text: "**WE'LL ALWAYS BE TOGETHER** Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
  type: "character",
  abilities: [
    wheneverYouReadyThisCharacter({
      name: "We'll Always Be Together",
      text: "Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
      conditions: [
        {
          type: "filter",
          comparison: {
            operator: "gte",
            value: 3,
          },
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
          ],
        },
      ],
      effects: [
        {
          type: "lore",
          modifier: "add",
          amount: 2,
          target: self,
        },
      ],
    }),
  ],
  flavour:
    "Look, Pooh! Have you ever seen anything so grand? \n−Christopher Robin",
  inkwell: true,
  colors: ["amber"],
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  illustrator: "Eri Welli",
  number: 2,
  set: "ROF",
  rarity: "rare",
};
