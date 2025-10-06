import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { wheneverYouPlayAFloodBorn } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const blueFairyRewardingGoodDeeds: LorcanitoCharacterCardDefinition = {
  id: "aid",
  name: "Blue Fairy",
  title: "Rewarding Good Deeds",
  characteristics: ["storyborn", "ally", "fairy"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**ETHEREAL GLOW** Whenever you play a Floodborn character, you may draw a card.",
  type: "character",
  abilities: [
    evasiveAbility,
    wheneverYouPlayAFloodBorn({
      optional: true,
      text: "Whenever you play a Floodborn character, you may draw a card.",
      name: "Ethereal Glow",
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
  ],
  flavour:
    "To make Geppetto's wish come true will be entirely up to you. –Blue Fairy",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  illustrator: "Kiersten Hale",
  number: 36,
  set: "ROF",
  rarity: "uncommon",
};
