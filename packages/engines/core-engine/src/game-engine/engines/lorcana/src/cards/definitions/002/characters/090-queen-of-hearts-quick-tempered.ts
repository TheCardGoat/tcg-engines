import { chosenOpposingDamagedCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const queenOfHeartsQuickTempered: LorcanaCharacterCardDefinition = {
  id: "zbq",
  name: "Queen of Hearts",
  title: "Quick-Tempered",
  characteristics: ["dreamborn", "queen", "villain"],
  text: "**ROYALE RAGE** When you play this character, deal 1 damage to chosen damaged opposing character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Royale Rage",
      text: "When you play this character, deal 1 damage to chosen damaged opposing character.",
      optional: false,
      effects: [
        {
          type: "damage",
          amount: 1,
          target: chosenOpposingDamagedCharacter,
        },
      ],
    },
  ],
  flavour:
    '"You know, we could make her really angry. Shall we try?"  \\n−Cheshire Cat',
  colors: ["emerald"],
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  illustrator: "Matthew Robert Davies",
  number: 90,
  set: "ROF",
  rarity: "common",
};
