import type { CharacterCard } from "@tcg/lorcana-types";

export const aliceClumsyAsCanBe: CharacterCard = {
  id: "luf",
  cardType: "character",
  name: "Alice",
  version: "Clumsy as Can Be",
  fullName: "Alice - Clumsy as Can Be",
  inkType: ["emerald", "ruby"],
  franchise: "Alice in Wonderland",
  set: "008",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Alice.)\nACCIDENT PRONE Whenever this character quests, put 1 damage counter on each other character.",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 104,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4ebbac71024f902baab0a404f68a139bfc927b05",
  },
  abilities: [
    {
      id: "luf-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "luf-2",
      type: "triggered",
      name: "ACCIDENT PRONE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "put-damage",
        amount: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "ACCIDENT PRONE Whenever this character quests, put 1 damage counter on each other character.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
