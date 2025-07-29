import type {
  BanishEffect,
  LorcanitoActionCard,
} from "@lorcanito/lorcana-engine";

export const riseOfTheTitans: LorcanaActionCardDefinition = {
  id: "ukw",
  name: "Rise of the Titans",
  characteristics: ["action"],
  text: "Banish chosen location or item.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Rise of the Titans",
      text: "Banish chosen location or item.",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["location", "item"] },
              { filter: "zone", value: "play" },
            ],
          },
        } as BanishEffect,
      ],
    },
  ],
  flavour: "Oh, we're in trouble, big trouble! \n–Hermes",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Nicola Saviori",
  number: 198,
  set: "ITI",
  rarity: "uncommon",
};
