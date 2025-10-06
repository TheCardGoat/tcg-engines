import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanImperialSoldier: LorcanitoCharacterCardDefinition = {
  id: "cqk",
  name: "Mulan",
  title: "Imperial Soldier",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**Lead by example** During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
  type: "character",
  abilities: [
    wheneverBanishesAnotherCharacterInChallenge({
      name: "Lead by example",
      text: "During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            excludeSelf: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  illustrator: "Mel Milton",
  number: 118,
  set: "TFC",
  rarity: "super_rare",
};
