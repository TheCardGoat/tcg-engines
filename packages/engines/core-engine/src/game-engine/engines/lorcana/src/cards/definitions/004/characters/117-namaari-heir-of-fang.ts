import { wheneverThisCharacterDealsDamageInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const namaariHeirOfFang: LorcanitoCharacterCardDefinition = {
  id: "mnr",
  name: "Namaari",
  title: "Heir of Fang",
  characteristics: ["storyborn", "villain", "princess"],
  text: "**TWO-WEAPON FIGHTING** During your turn, whenever this character deals damage to another character in a challenge, you may deal the same amount of damage to another chosen character.",
  type: "character",
  abilities: [
    wheneverThisCharacterDealsDamageInChallenge({
      name: "Two-Weapon Fighting",
      text: "During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to another chosen character.",
      conditions: [{ type: "during-turn", value: "self" }],
      optional: true,
      effects: [
        {
          type: "damage",
          amount: {
            dynamic: true,
            getAmountFromTrigger: true,
          },
          target: {
            type: "card",
            value: 1,
            excludeSelf: true,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "source", value: "other" },
            ],
          },
        },
      ],
    }),
  ],
  colors: ["ruby"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Kasia Brezinska",
  number: 117,
  set: "URR",
  rarity: "rare",
};
