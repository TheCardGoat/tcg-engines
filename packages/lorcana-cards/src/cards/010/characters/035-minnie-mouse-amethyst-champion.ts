import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseAmethystChampion: CharacterCard = {
  id: "1kv",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Amethyst Champion",
  fullName: "Minnie Mouse - Amethyst Champion",
  inkType: ["amethyst"],
  set: "010",
  text: "MYSTICAL BALANCE Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 35,
  inkable: true,
  externalIds: {
    ravensburger: "ccf42c36e04eff8e85e6c695ec9ed7ae661666f7",
  },
  abilities: [
    {
      id: "1kv-1",
      type: "triggered",
      name: "MYSTICAL BALANCE",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
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
      text: "MYSTICAL BALANCE Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverOneOfYourCharactersIsBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const minnieMouseAmethystChampion: LorcanitoCharacterCard = {
//   id: "egg",
//   name: "Minnie Mouse",
//   title: "Amethyst Champion",
//   characteristics: ["dreamborn", "hero"],
//   text: "MYSTICAL BALANCE Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Lisa Parfenova",
//   number: 35,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659760,
//   },
//   rarity: "rare",
//   lore: 2,
//   abilities: [
//     wheneverOneOfYourCharactersIsBanishedInAChallenge({
//       name: "MYSTICAL BALANCE",
//       text: "Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.",
//       optional: true,
//       triggerFilter: [
//         { filter: "owner", value: "self" },
//         { filter: "type", value: "character" },
//         { filter: "color", value: "amethyst" },
//       ],
//       effects: [drawACard],
//     }),
//   ],
// };
//
