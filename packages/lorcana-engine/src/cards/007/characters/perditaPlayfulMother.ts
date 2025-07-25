import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { youPayXLessToPlayNextCharThisTurn } from "@lorcanito/lorcana-engine/effects/effects";

export const perditaPlayfulMother: LorcanitoCharacterCard = {
  id: "u9b",
  name: "Perdita",
  title: "Playful Mother",
  characteristics: ["storyborn", "hero"],
  text: "WHO'S NEXT? Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.\nDON'T BE AFRAID Your Puppy characters gain Ward. (Opponents can't choose them except to challenge.)",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "WHO'S NEXT?",
      text: "Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.",
      effects: [
        youPayXLessToPlayNextCharThisTurn(2, [
          { filter: "characteristics", value: ["puppy"] },
        ]),
      ],
    }),
    {
      type: "static",
      ability: "gain-ability",
      name: "Don't be afraid",
      text: "Your Puppy characters gain Ward. (Opponents can't choose them except to challenge.)",
      gainedAbility: wardAbility,
      target: {
        type: "card",
        value: "all",
        excludeSelf: true,
        filters: [
          { filter: "zone", value: "play" },
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          { filter: "characteristics", value: ["puppy"] },
        ],
      },
    },
  ],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amber", "sapphire"],
  cost: 4,
  strength: 1,
  willpower: 4,
  illustrator: "Cécile Carre",
  number: 2,
  set: "007",
  rarity: "rare",
  lore: 2,
};
