import type {
  LorcanitoActionCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";

const lightTheFuseAbility: ResolutionAbility = {
  type: "resolution",
  effects: [
    {
      type: "damage",
      amount: {
        dynamic: true,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          {
            filter: "status",
            value: "exerted",
          },
        ],
      },
      target: chosenCharacter,
    },
  ],
};

export const lightTheFuse: LorcanitoActionCard = {
  id: "cep",
  name: "Light The Fuse",
  characteristics: ["action"],
  text: "Deal 1 damage to chosen character for each exerted character you have in play.",
  type: "action",
  inkwell: false,
  colors: ["ruby", "steel"],
  cost: 1,
  illustrator: "Kenneth Anderson",
  number: 149,
  set: "008",
  rarity: "uncommon",
  abilities: [lightTheFuseAbility],
};
