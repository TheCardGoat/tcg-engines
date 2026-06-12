import type { CharacterCard } from "@tcg/lorcana-types";
import { crikeePartOfTheTeamI18n } from "./131-cri-kee-part-of-the-team.i18n";

export const crikeePartOfTheTeam: CharacterCard = {
  id: "2w3",
  canonicalId: "ci_2w3",
  reprints: ["set8-131"],
  cardType: "character",
  name: "Cri-Kee",
  version: "Part of the Team",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "008",
  cardNumber: 131,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_084eb569ca02425791bf38993a74f23f",
    tcgPlayer: 631436,
  },
  text: [
    {
      title: "AT HER SIDE",
      description:
        "While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      name: "AT HER SIDE",
      condition: {
        type: "target-query",
        comparison: {
          operator: "gte",
          value: 2,
        },
        query: {
          selector: "all",
          zones: ["play"],
          cardType: "character",
          owner: "you",
          excludeSelf: true,
          filters: [
            {
              type: "exerted",
            },
          ],
        },
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "17k-1",
      text: "AT HER SIDE While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: crikeePartOfTheTeamI18n,
};
