import type { ActionCard } from "@tcg/lorcana-types";

export const developYourBrain: ActionCard = {
  id: "z3c",
  cardType: "action",
  name: "Develop Your Brain",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "009",
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.",
  cost: 1,
  cardNumber: 163,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7e7a5204a324e3773bc06deedaedb33fe5803b64",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { developYourBrain as ogDevelopYourBrain } from "@lorcanito/lorcana-engine/cards/001/actions/161-develop-your-brain";
//
// export const developYourBrain: LorcanitoActionCard = {
//   ...ogDevelopYourBrain,
//   id: "ph9",
//   reprints: [ogDevelopYourBrain.id],
//   number: 163,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650097,
//   },
// };
//
