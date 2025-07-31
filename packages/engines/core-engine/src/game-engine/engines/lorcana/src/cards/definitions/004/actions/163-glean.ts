import { chosenItem } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const glean: LorcanaActionCardDefinition = {
  id: "aqx",
  name: "Glean",
  characteristics: ["action"],
  text: "Banish chosen item. Its owner gains 2 lore.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Glean",
      text: "Banish chosen item. Its owner gains 2 lore.",
      effects: [
        {
          type: "banish",
          target: chosenItem,
        },
        {
          type: "lore",
          amount: 2,
          modifier: "add",
          target: { type: "player", value: "target_owner" },
        },
      ],
    },
  ],
  flavour: "This could be just the thing I need to get my invention working.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Veronica Di Lorenzo / Livio Cacciatore",
  number: 163,
  set: "URR",
  rarity: "common",
};
