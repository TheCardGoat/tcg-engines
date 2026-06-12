import type { CharacterCard } from "@tcg/lorcana-types";
import { elisaMazaIntrepidInvestigatorI18n } from "./122-elisa-maza-intrepid-investigator.i18n";

export const elisaMazaIntrepidInvestigator: CharacterCard = {
  id: "vxM",
  canonicalId: "ci_vxM",
  reprints: ["set10-122"],
  cardType: "character",
  name: "Elisa Maza",
  version: "Intrepid Investigator",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 122,
  rarity: "rare",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_78d6ec7c65b746efaec6c74337bdb84d",
    tcgPlayer: 658293,
  },
  text: [
    {
      title: "SPECIAL DETAIL",
      description:
        "While you have 2 or more other characters in play with 5 {S} or more, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Detective"],
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "65o-1",
      name: "SPECIAL DETAIL",
      text: "SPECIAL DETAIL While you have 2 or more other characters in play with 5 {S} or more, this character gets +2 {L}.",
      type: "static",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "strength-comparison",
              comparison: "gte",
              value: 5,
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
    },
  ],
  i18n: elisaMazaIntrepidInvestigatorI18n,
};
