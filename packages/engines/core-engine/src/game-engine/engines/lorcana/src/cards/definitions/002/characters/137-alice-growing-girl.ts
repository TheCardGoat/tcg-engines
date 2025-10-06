import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import { yourOtherCharacters } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aliceGrowingGirl: LorcanaCharacterCardDefinition = {
  id: "wfi",
  reprints: ["rtw"],

  name: "Alice",
  title: "Growing Girl",
  characteristics: ["hero", "dreamborn"],
  text: "**GOOD ADVICE** Your other characters gain **Support**. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_\n\n**WHAT DID I DO?** While this character has 10 {S} or more, she gets +4 {L}.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Good Advice",
      text: "Your other characters gain **Support**.",
      gainedAbility: supportAbility,
      target: yourOtherCharacters,
    },
    whileConditionThisCharacterGets({
      name: "What did I Do?",
      text: "While this character has 10 {S} or more, she gets +4 {L}.",
      attribute: "lore",
      amount: 4,
      conditions: [
        {
          type: "attribute",
          attribute: "strength",
          comparison: { operator: "gte", value: 10 },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 137,
  set: "ROF",
  rarity: "legendary",
};
