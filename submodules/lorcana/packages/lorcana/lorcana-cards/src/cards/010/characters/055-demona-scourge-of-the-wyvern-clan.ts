import type { CharacterCard } from "@tcg/lorcana-types";
import { demonaScourgeOfTheWyvernClanI18n } from "./055-demona-scourge-of-the-wyvern-clan.i18n";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const demonaScourgeOfTheWyvernClan: CharacterCard = {
  id: "e6l",
  canonicalId: "ci_Sox",
  reprints: ["set10-055"],
  cardType: "character",
  name: "Demona",
  version: "Scourge of the Wyvern Clan",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 55,
  rarity: "legendary",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ed9fc60aa63a4eafa4116188e41910f2",
    tcgPlayer: 658215,
  },
  text: [
    {
      title: "AD SAXUM COMMUTATE",
      description:
        "When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3.",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Gargoyle", "Sorcerer"],
  abilities: [
    {
      id: "4nl-1",
      text: "AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3.",
      name: "AD SAXUM COMMUTATE",
      effect: {
        steps: [
          {
            target: {
              cardTypes: ["character"],
              count: "all",
              owner: "opponent",
              selector: "all",
              zones: ["play"],
            },
            type: "exert",
          },
          {
            size: 3,
            type: "draw-until-hand-size",
            target: "CONTROLLER",
          },
          {
            size: 3,
            type: "draw-until-hand-size",
            target: "OPPONENT",
          },
        ],
        type: "sequence",
      },
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    stoneByDay,
  ],
  i18n: demonaScourgeOfTheWyvernClanI18n,
};
