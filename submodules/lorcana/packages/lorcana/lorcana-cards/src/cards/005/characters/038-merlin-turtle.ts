import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinTurtleI18n } from "./038-merlin-turtle.i18n";

export const merlinTurtle: CharacterCard = {
  id: "Xwi",
  canonicalId: "ci_Xwi",
  reprints: ["set5-038"],
  cardType: "character",
  name: "Merlin",
  version: "Turtle",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 38,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_830fee590a4e49c1a54622779b4380c3",
    tcgPlayer: 561951,
  },
  text: [
    {
      title: "GIVE ME TIME TO THINK",
      description:
        "When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 2,
        destinations: [
          {
            zone: "deck-top",
            min: 1,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      id: "1ed-1",
      name: "GIVE ME TIME TO THINK",
      text: "GIVE ME TIME TO THINK When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "scry",
        amount: 2,
        destinations: [
          {
            zone: "deck-top",
            min: 1,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      id: "1ed-2",
      name: "GIVE ME TIME TO THINK",
      text: "GIVE ME TIME TO THINK When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      trigger: {
        event: "leave-play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: merlinTurtleI18n,
};
