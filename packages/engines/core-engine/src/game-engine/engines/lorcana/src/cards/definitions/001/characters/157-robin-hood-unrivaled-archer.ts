import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const robinHoodUnrivaledArcher: LorcanaCharacterCardDefinition = {
  id: "dq9",
  reprints: ["l10"],
  name: "Robin Hood",
  title: "Unrivaled Archer",
  characteristics: ["hero", "storyborn"],
  text: "**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Feed The Poor",
      text: "When you play this character, if an opponent has more cards in their hand than you, draw a card.",
      resolutionConditions: [
        {
          type: "hand",
          amount: "lt",
        } as Condition,
      ],
      effects: [
        {
          type: "draw",
          amount: 1,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    }),
    whileConditionThisCharacterGains({
      name: "Good Shot",
      text: "During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
      ability: evasiveAbility,
      conditions: [
        {
          type: "during-turn",
          value: "self",
        },
      ],
    }),
  ],
  flavour:
    '"We never rob. We just sort of borrow a bit from those who can afford it."',
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  illustrator: "John Loren",
  number: 157,
  set: "TFC",
  rarity: "super_rare",
};
