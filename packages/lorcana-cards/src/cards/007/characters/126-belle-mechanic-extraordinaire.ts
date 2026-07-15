import type { CharacterCard } from "@tcg/lorcana-types";

export const belleMechanicExtraordinaire: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 7,
      },
      id: "lej-1",
      keyword: "Shift",
      text: "Shift 7",
      type: "keyword",
    },
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "lej-2",
      text: "SALVAGE For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.",
      type: "action",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          type: "gain-lore",
        },
        type: "optional",
      },
      id: "lej-3",
      name: "REPURPOSE",
      text: "REPURPOSE Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 126,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess", "Inventor"],
  cost: 9,
  externalIds: {
    ravensburger: "4d23f100a066fd4f3e2360075ccf1959f705f5d7",
  },
  franchise: "Beauty and the Beast",
  fullName: "Belle - Mechanic Extraordinaire",
  id: "lej",
  inkType: ["ruby", "sapphire"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Belle",
  set: "007",
  strength: 7,
  text: "Shift 7\nSALVAGE For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.\nREPURPOSE Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.",
  version: "Mechanic Extraordinaire",
  willpower: 7,
};
