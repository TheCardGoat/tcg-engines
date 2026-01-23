// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenPlayer } from "@lorcanito/lorcana-engine/abilities/targets";
// import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const secondStarToTheRight: LorcanitoActionCard = {
//   id: "k7z",
//   reprints: ["dac"],
//   missingTestCase: true,
//   name: "Second Star To The Right",
//   characteristics: ["action", "song"],
//   text: "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nChosen player draws 5 cards.",
//   type: "action",
//   abilities: [
//     singerTogetherAbility(10),
//     {
//       type: "resolution",
//       effects: [drawXCards(5, chosenPlayer)],
//     },
//   ],
//   flavour: "Lead us to the land we dream of",
//   colors: ["amethyst"],
//   cost: 10,
//   illustrator: "Natalia Trykowska",
//   number: 61,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547846,
//   },
//   rarity: "rare",
// };
//
