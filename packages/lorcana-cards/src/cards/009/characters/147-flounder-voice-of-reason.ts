import type { CharacterCard } from "@tcg/lorcana-types";

export const flounderVoiceOfReason: CharacterCard = {
  id: "gyk",
  cardType: "character",
  name: "Flounder",
  version: "Voice of Reason",
  fullName: "Flounder - Voice of Reason",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "009",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 147,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "3d1fec6cbeed388a7009113f866cf41cb9c468d1",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { flounderVoiceOfReason as flounderVoiceOfReasonAsOrig } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
//
// export const flounderVoiceOfReason: LorcanitoCharacterCard = {
//   ...flounderVoiceOfReasonAsOrig,
//   id: "yyq",
//   reprints: [flounderVoiceOfReasonAsOrig.id],
//   number: 147,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650082,
//   },
// };
//
