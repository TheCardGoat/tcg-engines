import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanCreatedByTheVineEpicI18n } from "./216-peter-pan-created-by-the-vine-epic.i18n";

export const peterPanCreatedByTheVineEpic: CharacterCard = {
  id: "9kq",
  canonicalId: "ci_9kq",
  slug: "lorcana-ci_9kq",
  printings: [
    {
      id: "set13-216-epic",
      artId: "ci_9kq-epic",
      setCode: "set13",
      collectorNumber: "216",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  cardType: "character",
  name: "Peter Pan",
  version: "Created by the Vine",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "013",
  cardNumber: 216,
  rarity: "common",
  specialRarity: "epic",
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
      title: "CLEVER TRICK",
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
  i18n: peterPanCreatedByTheVineEpicI18n,
};
