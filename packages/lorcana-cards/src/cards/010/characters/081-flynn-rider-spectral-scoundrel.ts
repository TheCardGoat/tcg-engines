import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderSpectralScoundrel: CharacterCard = {
  abilities: [
    {
      id: "73r-1",
      keyword: "Boost",
      text: "Boost 2 {I}",
      type: "keyword",
      value: 2,
    },
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "73r-2",
      text: "I'LL TAKE THAT As long as this character has at least one card under it, it gets +2 {S} and +1 {L}.",
      type: "static",
    },
  ],
  cardNumber: 81,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince", "Whisper"],
  cost: 1,
  externalIds: {
    ravensburger: "199b453a94bfd0c69aa0dc8fb017ff359ae33fe0",
  },
  franchise: "Tangled",
  fullName: "Flynn Rider - Spectral Scoundrel",
  id: "73r",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Flynn Rider",
  set: "010",
  strength: 1,
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck face down under this character.)\nI'LL TAKE THAT As long as this character has at least one card under it, it gets +2 {S} and +1 {L}.",
  version: "Spectral Scoundrel",
  willpower: 2,
};
