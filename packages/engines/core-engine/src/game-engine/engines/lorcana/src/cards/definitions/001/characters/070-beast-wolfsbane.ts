import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beastWolfbane: LorcanaCharacterCardDefinition = {
  id: "njm",
  name: "Beast",
  title: "Wolfsbane",
  characteristics: ["hero", "dreamborn", "prince"],
  text: "**Rush** _(This character can challenge the turn they're played.)_\n**Roar** When you play this character, exert all opposing damaged characters.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "ROAR",
      text: "When you play this character, exert all opposing damaged characters.",
      effects: [
        {
          type: "exert",
          exert: true,
          target: {
            type: "card",
            value: "all",
            filters: [
              {
                filter: "status",
                value: "damage",
                comparison: { operator: "gte", value: 1 },
              },
              { filter: "owner", value: "opponent" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    }),
    rushAbility,
  ],
  flavour: "I'll take on all of you if I have to!",
  colors: ["emerald"],
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  illustrator: "Jeff Murchie",
  number: 70,
  set: "TFC",
  rarity: "legendary",
};
