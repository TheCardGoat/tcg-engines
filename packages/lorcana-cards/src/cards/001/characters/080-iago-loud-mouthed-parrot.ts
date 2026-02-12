import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoLoudmouthedParrot: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "j24-1",
      name: "YOU GOT A PROBLEM?",
      text: "YOU GOT A PROBLEM? {E} — Chosen character gains Reckless during their next turn.",
      type: "activated",
    },
  ],
  cardNumber: 80,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "44b0d2526e203d60174ddce6f251da6c54c72691",
  },
  franchise: "Aladdin",
  fullName: "Iago - Loud-Mouthed Parrot",
  id: "j24",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Iago",
  set: "001",
  strength: 1,
  text: "YOU GOT A PROBLEM? {E} — Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  version: "Loud-Mouthed Parrot",
  willpower: 4,
};
