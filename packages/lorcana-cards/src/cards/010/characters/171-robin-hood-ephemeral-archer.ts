import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodEphemeralArcher: CharacterCard = {
  abilities: [
    {
      id: "1pw-1",
      keyword: "Boost",
      text: "Boost 1 {I}",
      type: "keyword",
      value: 1,
    },
    {
      effect: {
        condition: {
          expression: "there's a card under him",
          type: "if",
        },
        then: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "conditional",
      },
      id: "1pw-2",
      name: "EXPERT SHOT",
      text: "EXPERT SHOT Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 171,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Whisper"],
  cost: 4,
  externalIds: {
    ravensburger: "df1c98b7c8a1c176ffb2e7a8dc37a3f540f9244d",
  },
  franchise: "Robin Hood",
  fullName: "Robin Hood - Ephemeral Archer",
  id: "1pw",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Robin Hood",
  set: "010",
  strength: 2,
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nEXPERT SHOT Whenever this character quests, if there's a card under him, deal 1 damage to up to 2 chosen characters.",
  version: "Ephemeral Archer",
  willpower: 4,
};
