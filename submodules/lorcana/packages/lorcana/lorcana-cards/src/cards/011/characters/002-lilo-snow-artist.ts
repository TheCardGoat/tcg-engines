import type { CharacterCard } from "@tcg/lorcana-types";
import { liloSnowArtistI18n } from "./002-lilo-snow-artist.i18n";

export const liloSnowArtist: CharacterCard = {
  id: "pzM",
  canonicalId: "ci_pzM",
  reprints: ["set11-002"],
  cardType: "character",
  name: "Lilo",
  version: "Snow Artist",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 2,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_df49511658c9468b9a5353f1561cc9cc",
    tcgPlayer: 675377,
  },
  text: [
    {
      title: "CREATIVE INSPIRATION",
      description: "While you have a character named Stitch in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "12l-1",
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      condition: {
        type: "has-named-character",
        controller: "you",
        name: "Stitch",
      },
      name: "CREATIVE INSPIRATION",
      type: "static",
      text: "CREATIVE INSPIRATION While you have a character named Stitch in play, this character gets +1 {L}.",
    },
  ],
  i18n: liloSnowArtistI18n,
};
