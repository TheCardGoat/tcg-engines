import type { CharacterCard } from "@tcg/lorcana-types";

export const taffytaMuttonfudgeSourSpeedster: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "1a5-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "1a5-2",
      name: "NEW ROSTER",
      text: "NEW ROSTER Once per turn, when this character moves to a location, gain 2 lore.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 117,
  cardType: "character",
  classifications: ["Floodborn", "Ally", "Racer"],
  cost: 4,
  externalIds: {
    ravensburger: "a6526d76935a9eb3160ed4ab73e7b32e9458369b",
  },
  franchise: "Wreck It Ralph",
  fullName: "Taffyta Muttonfudge - Sour Speedster",
  id: "1a5",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Taffyta Muttonfudge",
  set: "005",
  strength: 3,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Taffyta Muttonfudge.)\nNEW ROSTER Once per turn, when this character moves to a location, gain 2 lore.",
  version: "Sour Speedster",
  willpower: 3,
};
