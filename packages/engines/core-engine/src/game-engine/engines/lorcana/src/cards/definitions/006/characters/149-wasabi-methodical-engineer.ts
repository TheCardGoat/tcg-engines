// TODO: Once the set is released, we organize the cards by set and type

import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { chosenItem } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileConditionThisCharacterGains } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const wasabiMethodicalEngineer: LorcanaCharacterCardDefinition = {
  id: "lzm",
  name: "Wasabi",
  title: "Methodical Engineer",
  characteristics: ["hero", "storyborn", "inventor"],
  text: "**BLADES OF FURY** When you play this character, you may banish chosen item. Its player gains 1 lore.\n\n**QUICK REFLEXES** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
  type: "character",
  abilities: [
    whileConditionThisCharacterGains({
      name: "QUICK REFLEXES",
      text: "During your turn, this character gains **Evasive**.",
      ability: evasiveAbility,
      conditions: [
        {
          type: "during-turn",
          value: "self",
        },
      ],
    }),
    {
      type: "resolution",
      name: "BLADES OF FURY",
      optional: true,
      text: "When you play this character, you may banish chosen item. Its player gains 1 lore.",
      effects: [
        {
          type: "banish",
          target: chosenItem,
        },
        {
          type: "lore",
          amount: 1,
          modifier: "add",
          target: { type: "player", value: "target_owner" },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Taraneh",
  number: 149,
  set: "006",
  rarity: "uncommon",
};
