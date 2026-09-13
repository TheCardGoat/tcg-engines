import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/coercive-tendency.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const coerciveTendency = definePitchFamily(fabPitchFamilies["coercive-tendency"], {
  keywords: [
    {
      name: "specialization",
      hero: "Arakni",
    },
  ],
  abilities: () => ({
    reorderAndBanishTopCard: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "defending-hero",
              zones: ["deck"],
              position: "top",
              count: 3,
            },
            outputBinding: "them",
          },
          {
            type: "reorder-deck",
            target: {
              selector: "binding",
              binding: "them",
            },
            position: "top",
          },
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "banished",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-numeric",
              binding: "completed-contract-this-way",
              comparison: { op: "eq", value: 1 },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["combat-chain"],
                filter: {
                  typeBox: {
                    supertypes: ["Assassin"],
                  },
                },
                count: {
                  type: "all",
                },
              },
              duration: "this-combat-chain",
            },
          },
        ],
      },
    },
  }),
});

export const { blue: coerciveTendencyBlue } = coerciveTendency.cards;
