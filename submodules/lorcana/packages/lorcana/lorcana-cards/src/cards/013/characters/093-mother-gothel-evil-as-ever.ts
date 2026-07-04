import type { CharacterCard } from "@tcg/lorcana-types";
import { motherGothelEvilAsEverI18n } from "./093-mother-gothel-evil-as-ever.i18n";

export const motherGothelEvilAsEver: CharacterCard = {
  id: "v11",
  canonicalId: "ci_v11",
  slug: "lorcana-ci_v11",
  printings: [
    {
      id: "set13-093",
      artId: "set13-093",
      setCode: "set13",
      collectorNumber: "93",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-093"],
  cardType: "character",
  name: "Mother Gothel",
  version: "Evil as Ever",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "013",
  cardNumber: 93,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a132f96da79f44ada3f1ceffe29bf543",
  },
  text: [
    {
      title: "MUMMY'S BACK",
      description:
        "During your turn, when you discard this card, you may play this character from your discard. (You pay all costs.)",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      type: "triggered",
      sourceZones: ["discard"],
      name: "MUMMY'S BACK",
      text: "MUMMY'S BACK During your turn, when you discard this card, you may play this character from your discard. (You pay all costs.)",
      trigger: {
        event: "discard",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          from: "discard",
          cardType: "character",
          filter: {
            cardType: "character",
            sameInstanceAsSource: true,
          },
        },
      },
    },
  ],
  i18n: motherGothelEvilAsEverI18n,
};
