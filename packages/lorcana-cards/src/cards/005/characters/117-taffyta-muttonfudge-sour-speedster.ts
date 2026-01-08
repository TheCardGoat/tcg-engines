import type { CharacterCard } from "@tcg/lorcana-types";

export const taffytaMuttonfudgeSourSpeedster: CharacterCard = {
  id: "1a5",
  cardType: "character",
  name: "Taffyta Muttonfudge",
  version: "Sour Speedster",
  fullName: "Taffyta Muttonfudge - Sour Speedster",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Taffyta Muttonfudge.)\nNEW ROSTER Once per turn, when this character moves to a location, gain 2 lore.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 117,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a6526d76935a9eb3160ed4ab73e7b32e9458369b",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenMovesToALocation } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const taffytaMuttonfudgeSourSpeedster: LorcanitoCharacterCard = {
//   id: "hep",
//   missingTestCase: true,
//   name: "Taffyta Muttonfudge",
//   title: "Sour Speedster",
//   characteristics: ["floodborn", "ally", "racer"],
//   text: "**Shift** 2 _(You may pay 2 {I} to play this on top of one of your characters named Taffyta Muttonfudge.)_ **NEW ROSTER** Once per turn, when this character moves to a location, gain 2 lore.",
//   type: "character",
//   abilities: [
//     shiftAbility(2, "Taffyta Muttonfudge"),
//     whenMovesToALocation({
//       name: "New Roster",
//       text: "Once per turn, when this character moves to a location, gain 2 lore.",
//       oncePerTurn: true,
//       effects: [youGainLore(2)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Jiahui Eva Gao",
//   number: 117,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555270,
//   },
//   rarity: "uncommon",
// };
//
