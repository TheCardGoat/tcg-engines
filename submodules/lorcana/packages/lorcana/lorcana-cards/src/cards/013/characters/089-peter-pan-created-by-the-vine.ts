import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanCreatedByTheVineI18n } from "./089-peter-pan-created-by-the-vine.i18n";

export const peterPanCreatedByTheVine: CharacterCard = {
  id: "ATq",
  canonicalId: "ci_9kq",
  slug: "lorcana-ci_9kq",
  printings: [
    {
      id: "set13-089",
      artId: "set13-089",
      setCode: "set13",
      collectorNumber: "89",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-089"],
  cardType: "character",
  name: "Peter Pan",
  version: "Created by the Vine",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "013",
  cardNumber: 89,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_25b0c2af6a7e482687ccdf1c28972104",
  },
  text: [
    {
      title: "Clever Trick",
      description:
        "Whenever one of your Floodborn characters is challenged, the challenging player chooses and discards a card.",
    },
  ],
  classifications: ["Floodborn", "Vineling"],
  abilities: [
    {
      type: "triggered",
      name: "CLEVER TRICK",
      text: "CLEVER TRICK Whenever one of your Floodborn characters is challenged, the challenging player chooses and discards a card.",
      trigger: {
        event: "challenged",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        type: "discard",
        amount: 1,
        chosen: true,
        from: "hand",
        target: "CHALLENGING_PLAYER",
      },
    },
  ],
  i18n: peterPanCreatedByTheVineI18n,
};
