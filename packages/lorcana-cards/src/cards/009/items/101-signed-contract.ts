import type { ItemCard } from "@tcg/lorcana-types";

export const signedContract: ItemCard = {
  id: "1y6",
  cardType: "item",
  name: "Signed Contract",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "009",
  text: "FINE PRINT Whenever an opponent plays a song, you may draw a card.",
  cost: 2,
  cardNumber: 101,
  inkable: true,
  externalIds: {
    ravensburger: "fd1f3ba849d2d59ce5e0e3e8c3e3e7a146685998",
  },
  abilities: [
    {
      id: "1y6-1",
      type: "triggered",
      name: "FINE PRINT",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "opponent",
          cardType: "action",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "FINE PRINT Whenever an opponent plays a song, you may draw a card.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { signedContract as signedContractAsOrig } from "@lorcanito/lorcana-engine/cards/004/items/099-signed-contract";
//
// export const signedContract: LorcanitoItemCard = {
//   ...signedContractAsOrig,
//   id: "no1",
//   reprints: [signedContractAsOrig.id],
//   number: 101,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650039,
//   },
// };
//
