import type { CharacterCard } from "@tcg/lorcana-types";

export const demonaScourgeOfTheWyvernClan: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "exert",
            target: {
              selector: "all",
              count: "all",
              filter: [{ type: "owner", owner: "opponent" }],
            },
          },
          {
            type: "draw-until-hand-size",
            size: 3,
          },
        ],
        type: "sequence",
      },
      id: "4nl-1",
      name: "AD SAXUM COMMUTATE",
      text: "AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      condition: {
        comparison: "greater-or-equal",
        controller: "you",
        type: "resource-count",
        value: 0,
        what: "cards-in-hand",
      },
      effect: {
        restriction: "cant-ready",
        target: "SELF",
        type: "restriction",
      },
      id: "4nl-2",
      name: "STONE BY DAY",
      text: "STONE BY DAY If you have {d} or more cards in your hand, this character can't ready.",
      type: "static",
    },
  ],
  cardNumber: 55,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Gargoyle", "Sorcerer"],
  cost: 6,
  externalIds: {
    ravensburger: "10c766afc5fa9f94ef0c2ad708688e101324896c",
  },
  franchise: "Gargoyles",
  fullName: "Demona - Scourge of the Wyvern Clan",
  id: "4nl",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Demona",
  set: "010",
  strength: 5,
  text: "AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  version: "Scourge of the Wyvern Clan",
  willpower: 6,
};
