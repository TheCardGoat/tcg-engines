import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderSpectralScoundrel: CharacterCard = {
  id: "73r",
  cardType: "character",
  name: "Flynn Rider",
  version: "Spectral Scoundrel",
  fullName: "Flynn Rider - Spectral Scoundrel",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck face down under this character.)\nI'LL TAKE THAT As long as this character has at least one card under it, it gets +2 {S} and +1 {L}.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 81,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "199b453a94bfd0c69aa0dc8fb017ff359ae33fe0",
  },
  abilities: [
    {
      id: "73r-1",
      type: "keyword",
      keyword: "Boost",
      value: 2,
      text: "Boost 2 {I}",
    },
    {
      id: "73r-2",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      text: "I'LL TAKE THAT As long as this character has at least one card under it, it gets +2 {S} and +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince", "Whisper"],
};
