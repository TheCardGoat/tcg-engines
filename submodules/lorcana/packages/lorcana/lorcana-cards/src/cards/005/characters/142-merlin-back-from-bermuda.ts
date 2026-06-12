import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinBackFromBermudaI18n } from "./142-merlin-back-from-bermuda.i18n";

export const merlinBackFromBermuda: CharacterCard = {
  id: "gdk",
  canonicalId: "ci_gdk",
  reprints: ["set5-142"],
  cardType: "character",
  name: "Merlin",
  version: "Back from Bermuda",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 142,
  rarity: "common",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0a76a477c4d142439e5005d76bc01da2",
    tcgPlayer: 561966,
  },
  text: [
    {
      title: "LONG LIVE THE KING!",
      description: "Your characters named Arthur gain Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  abilities: [
    {
      id: "eka-1",
      name: "LONG LIVE THE KING!",
      text: "LONG LIVE THE KING! Your characters named Arthur gain Resist +1.",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["play"],
          filter: [{ type: "attribute", attribute: "name", comparison: "equals", value: "Arthur" }],
        },
      },
    },
  ],
  i18n: merlinBackFromBermudaI18n,
};
