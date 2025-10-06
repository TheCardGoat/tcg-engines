import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ladyTremaineImperiousQueen: LorcanitoCharacterCardDefinition = {
  id: "m9y",

  name: "Lady Tremaine",
  title: "Imperious Queen",
  characteristics: ["floodborn", "queen", "villain"],
  text: "**Shift** 4 _You may pay 4 {I} to play this on top of one of your characters named Lady Tremaine.)_<br>\n**POWER TO RULE AT LAST** When you play this character, each opponent chooses and banishes one of their characters.",
  type: "character",
  abilities: [
    shiftAbility(4, "lady tremaine"),
    {
      type: "resolution",
      name: "Power to Rule at Last",
      text: "When you play this character, each opponent chooses and banishes one of their characters.",
      responder: "opponent",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    "The twelfth Rule of Villainy: If you don't have a throne, take one.",
  colors: ["ruby"],
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Arianna Rea",
  number: 110,
  set: "ROF",
  rarity: "super_rare",
};
