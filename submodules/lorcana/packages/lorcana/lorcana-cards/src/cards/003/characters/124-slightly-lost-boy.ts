import type { CharacterCard } from "@tcg/lorcana-types";
import { slightlyLostBoyI18n } from "./124-slightly-lost-boy.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const slightlyLostBoy: CharacterCard = {
  id: "pa7",
  canonicalId: "ci_pa7",
  reprints: ["set3-124"],
  cardType: "character",
  name: "Slightly",
  version: "Lost Boy",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 124,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3893e351132b4fc28df9093b721f4f28",
    tcgPlayer: 537948,
  },
  text: [
    {
      title: "THE FOX",
      description:
        "If you have a character named Peter Pan in play, you pay 1 {I} less to play this character.",
    },
    {
      title: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1pb-1",
      name: "THE FOX",
      text: "THE FOX If you have a character named Peter Pan in play, you pay 1 {I} less to play this character.",
      type: "static",
      sourceZones: ["hand"],
      effect: {
        type: "cost-reduction",
        amount: {
          type: "clamp",
          value: {
            type: "filtered-count",
            owner: "you",
            zones: ["play"],
            cardType: "character",
            filters: [
              {
                type: "has-name",
                name: "Peter Pan",
              },
            ],
          },
          max: 1,
        },
        cardType: "character",
      },
    },
    evasive,
  ],
  i18n: slightlyLostBoyI18n,
};
