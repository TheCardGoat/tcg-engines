import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineQueenOfAgrabah: CharacterCard = {
  id: "8w9",
  cardType: "character",
  name: "Jasmine",
  version: "Queen of Agrabah",
  fullName: "Jasmine - Queen of Agrabah",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "001",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Jasmine.)\nCARETAKER When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 149,
  inkable: true,
  externalIds: {
    ravensburger: "200fff92d3781279a953ae4972866a4954a0ed17",
  },
  abilities: [
    {
      id: "8w9-1",
      text: "Shift 3",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "8w9-2",
      text: "CARETAKER When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
      name: "CARETAKER",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "YOUR_CHARACTERS",
          upTo: true,
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess", "Queen"],
};
