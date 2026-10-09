import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiAtTheCrosswalkI18n } from "./103-heihei-at-the-crosswalk.i18n";

export const heiheiAtTheCrosswalk: CharacterCard = {
  id: "cPq",
  canonicalId: "ci_cPq",
  slug: "lorcana-ci_cPq",
  printings: [
    {
      id: "set14-103",
      artId: "set14-103",
      setCode: "set14",
      collectorNumber: "103",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-103"],
  cardType: "character",
  name: "Heihei",
  version: "At the Crosswalk",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "014",
  cardNumber: 103,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b65c67bf9f794aceb5e22dd51c6f1736",
  },
  text: [
    {
      title: "AIMLESS WANDERING",
      description:
        "Once during your turn, if this character is at a location, you may move him to another location for free. If you do, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "AW-1",
      name: "AIMLESS WANDERING",
      type: "activated",
      text: "AIMLESS WANDERING Once during your turn, if this character is at a location, you may move him to another location for free. If you do, gain 1 lore.",
      cost: {},
      condition: {
        type: "at-location",
      },
      restrictions: [{ type: "once-per-turn" }, { type: "during-turn", whose: "your" }],
      effect: {
        type: "move-to-location",
        character: "SELF",
        location: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["location"],
          filter: [{ type: "not", filter: { type: "same-location-as-source" } }],
        },
        cost: "free",
        forEach: [{ type: "gain-lore", amount: 1 }],
      },
    },
  ],
  i18n: heiheiAtTheCrosswalkI18n,
};
