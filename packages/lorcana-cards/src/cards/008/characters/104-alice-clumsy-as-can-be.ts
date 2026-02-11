import type { CharacterCard } from "@tcg/lorcana-types";

export const aliceClumsyAsCanBe: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "luf-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
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
      id: "luf-2",
      name: "ACCIDENT PRONE",
      text: "ACCIDENT PRONE Whenever this character quests, put 1 damage counter on each other character.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 104,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "4ebbac71024f902baab0a404f68a139bfc927b05",
  },
  franchise: "Alice in Wonderland",
  fullName: "Alice - Clumsy as Can Be",
  id: "luf",
  inkType: ["emerald", "ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Alice",
  set: "008",
  strength: 2,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Alice.)\nACCIDENT PRONE Whenever this character quests, put 1 damage counter on each other character.",
  version: "Clumsy as Can Be",
  willpower: 6,
};
