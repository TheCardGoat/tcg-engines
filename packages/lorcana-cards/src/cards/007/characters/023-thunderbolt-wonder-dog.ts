import type { CharacterCard } from "@tcg/lorcana";

export const thunderboltWonderDog: CharacterCard = {
  id: "18d",
  cardType: "character",
  name: "Thunderbolt",
  version: "Wonder Dog",
  fullName: "Thunderbolt - Wonder Dog",
  inkType: ["amber", "sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  text: "Puppy Shift 3 (You may pay 3 {I} to play this on top of one of your Puppy characters.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  cardNumber: 23,
  inkable: true,
  externalIds: {
    ravensburger: "9ff1e3265aaa35ad585e9111ab61f6c0c7b2db71",
  },
  abilities: [
    {
      id: "18d-1",
      text: "Puppy Shift 3",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "18d-2",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
