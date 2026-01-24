import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodEphemeralArcher: CharacterCard = {
  id: "1pw",
  cardType: "character",
  name: "Robin Hood",
  version: "Ephemeral Archer",
  fullName: "Robin Hood - Ephemeral Archer",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "010",
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nEXPERT SHOT Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 171,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "df1c98b7c8a1c176ffb2e7a8dc37a3f540f9244d",
  },
  abilities: [
    {
      id: "1pw-1",
      type: "keyword",
      keyword: "Boost",
      value: 1,
      text: "Boost 1 {I}",
    },
    {
      id: "1pw-2",
      type: "triggered",
      name: "EXPERT SHOT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "there's a card under him",
        },
        then: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "EXPERT SHOT Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Whisper"],
};
