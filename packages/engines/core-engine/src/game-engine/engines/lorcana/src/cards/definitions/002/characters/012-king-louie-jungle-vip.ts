import { wheneverAnotherCharIsBanished } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kingLouieJungleVip: LorcanaCharacterCardDefinition = {
  id: "xiu",
  name: "King Louie",
  title: "Jungle VIP",
  characteristics: ["storyborn", "king"],
  text: "**LAY IT ON THE LINE** Whenever another character is banished, you may remove up to 2 damage from this character.",
  type: "character",
  abilities: [
    wheneverAnotherCharIsBanished({
      name: "Lay It On The Line",
      text: "Whenever another character is banished, you may remove up to 2 damage from this character.",
      effects: [
        {
          type: "heal",
          amount: 2,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    }),
  ],
  flavour: "Cool it, boy. Unwind yourself.",
  inkwell: true,
  colors: ["amber"],
  cost: 7,
  strength: 3,
  willpower: 8,
  lore: 2,
  illustrator: "Hadjie Joos",
  number: 12,
  set: "ROF",
  rarity: "super_rare",
};
