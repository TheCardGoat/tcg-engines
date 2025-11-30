import type { CharacterCard } from "@tcg/lorcana";

export const fixitFelixJrTrustyBuilder: CharacterCard = {
  id: "1hm",
  cardType: "character",
  name: "Fix-It Felix, Jr.",
  version: "Trusty Builder",
  fullName: "Fix-It Felix, Jr. - Trusty Builder",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cardNumber: "010",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "c139143d214c2a6edd012e7428ca9ff6081cb764",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "1hm-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
