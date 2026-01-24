import type { CharacterCard } from "@tcg/lorcana-types";

export const taffytaMuttonfudgeSourSpeedster: CharacterCard = {
  id: "1a5",
  cardType: "character",
  name: "Taffyta Muttonfudge",
  version: "Sour Speedster",
  fullName: "Taffyta Muttonfudge - Sour Speedster",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Taffyta Muttonfudge.)\nNEW ROSTER Once per turn, when this character moves to a location, gain 2 lore.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 117,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a6526d76935a9eb3160ed4ab73e7b32e9458369b",
  },
  abilities: [
    {
      id: "1a5-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2",
    },
    {
      id: "1a5-2",
      type: "triggered",
      name: "NEW ROSTER",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "NEW ROSTER Once per turn, when this character moves to a location, gain 2 lore.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Racer"],
};
