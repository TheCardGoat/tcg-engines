import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const flynnRiderHisOwnBiggestFan: LorcanitoCharacterCardDefinition = {
  id: "t36",

  name: "Flynn Rider",
  title: "His Own Biggest Fan",
  characteristics: ["hero", "floodborn", "prince"],
  text: "**Shift** 2 _You may pay 2 {I} to play this on top of one of your characters named Flynn Rider.)_\n\n**Evasive** (_Only characters with Evasive can challenge this character._)\n\n**ONE LAST, BIG SCORE** This character gets -1 {L} for each card in your opponents' hands.",
  type: "character",
  abilities: [
    shiftAbility(2, "flynn rider"),
    evasiveAbility,
    {
      type: "static",
      ability: "effects",
      name: "One Last, Big Score",
      text: "This character gets -1 {L} for each card in your opponents' hands.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          modifier: "subtract",
          amount: {
            dynamic: true,
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "opponent" },
            ],
          },
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    },
  ],
  colors: ["emerald"],
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 4,
  illustrator: "E. Meleranci / L. Giammichele",
  number: 82,
  set: "ROF",
  rarity: "rare",
};
