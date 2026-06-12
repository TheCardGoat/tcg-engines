import type { CharacterCard } from "@tcg/lorcana-types";
import { transformedChefCastleStoveI18n } from "./157-transformed-chef-castle-stove.i18n";

export const transformedChefCastleStove: CharacterCard = {
  id: "kyi",
  canonicalId: "ci_kyi",
  reprints: ["set4-157"],
  cardType: "character",
  name: "Transformed Chef",
  version: "Castle Stove",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 157,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a5ecfd31d79b4556ab6bf7233081349c",
    tcgPlayer: 550528,
  },
  text: [
    {
      title: "A CULINARY MASTERPIECE",
      description: "When you play this character, remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: { type: "up-to", value: 2 },
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      id: "1t8-1",
      name: "A CULINARY MASTERPIECE",
      text: "A CULINARY MASTERPIECE When you play this character, remove up to 2 damage from chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: transformedChefCastleStoveI18n,
};
