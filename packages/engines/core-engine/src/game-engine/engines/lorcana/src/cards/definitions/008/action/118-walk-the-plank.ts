import type {
  LorcanitoActionCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";

const walkThePlankGainedAbility: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "exert" }],
  effects: [
    {
      type: "banish",
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          {
            filter: "status",
            value: "damage",
            comparison: { operator: "gte", value: 1 },
          },
        ],
      },
    },
  ],
};

const walkThePlankAbility: ResolutionAbility = {
  type: "resolution",
  effects: [
    {
      type: "ability",
      ability: "custom",
      duration: "turn",
      modifier: "add",
      customAbility: walkThePlankGainedAbility,
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          { filter: "characteristics", value: ["pirate"] },
        ],
      },
    },
  ],
};

export const walkThePlank: LorcanaActionCardDefinition = {
  id: "yl4",
  name: "Walk The Plank!",
  characteristics: ["action"],
  text: 'Your Pirate characters gain "{E} – Banish chosen damaged character" this turn.',
  type: "action",
  inkwell: false,
  colors: ["emerald", "steel"],
  cost: 3,
  illustrator: "Alberto Zermeno",
  number: 118,
  set: "008",
  rarity: "uncommon",
  abilities: [walkThePlankAbility],
};
