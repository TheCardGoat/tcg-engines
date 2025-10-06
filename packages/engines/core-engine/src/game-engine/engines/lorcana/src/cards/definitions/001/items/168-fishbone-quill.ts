import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fishboneQuill: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "k4a",

  name: "Fishbone Quill",
  text: "**GO AHEAD AND SIGN** {E} − Put any card from your hand into your inkwell facedown.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Go Ahead And Sign",
      text: "Put any card from your hand into your inkwell facedown.",
      costs: [{ type: "exert" }],
      isPrivate: true,
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: false,
          isPrivate: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
            ],
          },
        },
      ],
    } as ActivatedAbility,
  ],
  flavour:
    "If you want to cross the bridge, my sweet, you've got to pay the toll. \n−Ursula",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  number: 168,
  set: "TFC",
  rarity: "rare",
  illustrator: "TBD",
};
