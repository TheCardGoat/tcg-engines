import type { CharacterCard } from "@tcg/lorcana-types";
import { liShangNewlyPromotedP2ChallengeI18n } from "./p2-022-li-shang-newly-promoted-challenge.i18n";

export const liShangNewlyPromotedP2Challenge: CharacterCard = {
  id: "2HL",
  canonicalId: "ci_7wy",
  slug: "lorcana-ci_7wy",
  printings: [
    {
      id: "set7-p2-022-challenge",
      artId: "ci_7wy-challenge",
      setCode: "set7",
      collectorNumber: "22",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set7-133"],
  cardType: "character",
  name: "Li Shang",
  version: "Newly Promoted",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "007",
  cardNumber: 22,
  rarity: "special",
  specialRarity: "challenge",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_82fe7f4aeec649bbba476dddb838a620",
    tcgPlayer: "619479",
  },
  text: [
    {
      title: "I WON'T LET YOU DOWN",
      description: "This character can challenge ready characters.",
    },
    {
      title: "BIG RESPONSIBILITY",
      description: "While this character is damaged, he gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Captain"],
  abilities: [
    {
      effect: {
        ability: "can-challenge-ready",
        target: "SELF",
        type: "grant-ability",
      },
      id: "1s1-1",
      name: "I WON'T LET YOU DOWN",
      text: "I WON'T LET YOU DOWN This character can challenge ready characters.",
      type: "static",
    },
    {
      condition: {
        type: "self-has-damage",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1s1-2",
      name: "BIG RESPONSIBILITY",
      text: "BIG RESPONSIBILITY While this character is damaged, he gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: liShangNewlyPromotedP2ChallengeI18n,
};
