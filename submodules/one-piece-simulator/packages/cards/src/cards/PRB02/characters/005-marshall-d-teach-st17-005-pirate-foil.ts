import type { CharacterCard } from "@tcg/op-types";
import { prb02MarshallDTeachSt17005PirateFoil005I18n } from "./005-marshall-d-teach-st17-005-pirate-foil.i18n.ts";

export const prb02MarshallDTeachSt17005PirateFoil005: CharacterCard = {
  id: "ST17-005",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "PRB02",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Blackbeard Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST17-005_p1.jpg",
      imageId: "ST17-005_p1",
    },
  ],
  effect:
    "[Activate: Main] [Once Per Turn] You may place 1 card from your hand at the top of your deck: Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02MarshallDTeachSt17005PirateFoil005I18n,
};
