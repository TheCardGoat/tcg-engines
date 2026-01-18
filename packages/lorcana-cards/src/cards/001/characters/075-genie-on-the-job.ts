import type { CharacterCard } from "@tcg/lorcana-types";
import { evasive, moveCards, optional, whenPlay } from "../../ability-helpers";

export const genieOnTheJob: CharacterCard = {
  id: "n53",
  cardType: "character",
  name: "Genie",
  version: "On the Job",
  fullName: "Genie - On the Job",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nDISAPPEAR When you play this character, you may return chosen character to their player's hand.",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 75,
  inkable: false,
  externalIds: {
    ravensburger: "53677bcf26b3b3a85ed1c61ea70cfd53296be7c2",
  },
  abilities: [
    evasive("n53-1"),
    whenPlay("n53-2", {
      name: "DISAPPEAR",
      text: "DISAPPEAR When you play this character, you may return chosen character to their player's hand.",
      playedBy: "you",
      playedCard: "SELF",
      then: optional(
        moveCards("play", "hand", {
          target: "CHOSEN_CHARACTER",
        }),
      ),
    }),
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const genieOnTheJob: LorcanitoCharacterCard = {
//   id: "tgk",
//   name: "Genie",
//   title: "On the Job",
//   characteristics: ["storyborn", "ally"],
//   text: "**Evasive** (_Only characters with Evasive can challenge this character._)\n**DISAPPEAR** When you play this character, you may return chosen character to their player's hand.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Disappear",
//       text: "When you play this character, you may return chosen character to their player's hand.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "Can your friends go ‘Abracadabra, let ’er rip’ and then make the sucker disappear?",
//   colors: ["emerald"],
//   cost: 6,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Giulia Riva",
//   number: 75,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 501228,
//   },
//   rarity: "super_rare",
// };
//
