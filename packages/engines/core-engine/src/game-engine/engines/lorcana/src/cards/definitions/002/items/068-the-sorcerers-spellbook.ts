import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theSorcerersSpellbook: LorcanaItemCardDefinition = {
  id: "gdz",

  name: "The Sorcerer's Spellbook",
  characteristics: ["item"],
  text: "**KNOWLEDGE** {E}, 1 {I} − Gain 1 lore.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Knowledge",
      text: "{E}, 1 {I} − Gain 1 lore.",
      optional: false,
      costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
      effects: [
        {
          type: "lore",
          amount: 1,
          modifier: "add",
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    },
  ],
  flavour:
    "Illumineers seek the power of knowledge−but must be aware of the price.",
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Julie Vu",
  number: 68,
  set: "ROF",
  rarity: "rare",
};
