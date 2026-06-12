import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelAppreciativeArtistI18n } from "./153-rapunzel-appreciative-artist.i18n";

export const rapunzelAppreciativeArtist: CharacterCard = {
  id: "Mbz",
  canonicalId: "ci_Mbz",
  reprints: ["set4-153"],
  cardType: "character",
  name: "Rapunzel",
  version: "Appreciative Artist",
  inkType: ["sapphire"],
  franchise: "Tangled",
  set: "004",
  cardNumber: 153,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_7cfbdaa5c45f4ee9a73d3359c2f206c7",
    tcgPlayer: 543915,
  },
  text: [
    {
      title: "PERCEPTIVE PARTNER",
      description: "While you have a character named Pascal in play, this character gains Ward.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      condition: {
        type: "has-named-character",
        name: "Pascal",
        controller: "you",
      },
      effect: {
        keyword: "Ward",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1qj-1",
      name: "PERCEPTIVE PARTNER",
      text: "PERCEPTIVE PARTNER While you have a character named Pascal in play, this character gains Ward.",
      type: "static",
    },
  ],
  i18n: rapunzelAppreciativeArtistI18n,
};
