import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThis } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicaDeSpellShadowForm: LorcanaCharacterCardDefinition = {
  id: "t1p",
  name: "Magica De Spell",
  title: "Shadow Form",
  characteristics: ["storyborn", "villain", "sorcerer"],
  text: "Evasive (Only characters with Evasive can challenge this character.)\nDANCE OF DARKNESS When you play this character, you may return one of your other characters to your hand to draw a card.",
  type: "character",
  abilities: [
    evasiveAbility,
    whenYouPlayThis({
      name: "DANCE OF DARKNESS",
      text: "When you play this character, you may return one of your other characters to your hand to draw a card.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "hand",
          isPrivate: false,
          shouldRevealMoved: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "source", value: "other" },
            ],
          },
        },
        {
          type: "draw",
          amount: 1,
          target: self,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amethyst", "emerald"],
  cost: 5,
  strength: 3,
  willpower: 3,
  illustrator: "Sandara Tang",
  number: 66,
  set: "008",
  rarity: "uncommon",
  lore: 2,
};
