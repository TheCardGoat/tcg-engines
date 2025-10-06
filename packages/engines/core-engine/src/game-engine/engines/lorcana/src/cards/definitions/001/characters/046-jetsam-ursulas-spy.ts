import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jetsamUrsulaSpy: LorcanaCharacterCardDefinition = {
  id: "lh1",
  name: "Jetsam",
  title: "Ursula's Spy",
  characteristics: ["storyborn", "ally"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n**SINISTER SLITHER** Your characters named Flotsam gain **Evasive.**",
  type: "character",
  abilities: [
    evasiveAbility,
    {
      type: "static",
      ability: "gain-ability",
      name: "Sinister Slither",
      text: "Your characters named Flotsam gain **Evasive.**",
      gainedAbility: evasiveAbility,
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "zone", value: "play" },
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: "Flotsam" },
          },
        ],
      },
    },
  ],
  flavour: "We can help you get anything you want. . . .",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Brian Weisz",
  number: 46,
  set: "TFC",
  rarity: "common",
};
