import type { CharacterCard } from "@tcg/lorcana";

export const iagoLoudmouthedParrot: CharacterCard = {
  id: "j24",
  cardType: "character",
  name: "Iago",
  version: "Loud-Mouthed Parrot",
  fullName: "Iago - Loud-Mouthed Parrot",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  text: "YOU GOT A PROBLEM? {E} — Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 80,
  inkable: true,
  externalIds: {
    ravensburger: "44b0d2526e203d60174ddce6f251da6c54c72691",
  },
  abilities: [
    {
      id: "j24-1",
      text: "YOU GOT A PROBLEM? {E} — Chosen character gains Reckless during their next turn.",
      name: "YOU GOT A PROBLEM?",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
