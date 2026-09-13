import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/become-the-arknight.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const becomeTheArknight = definePitchFamily(fabPitchFamilies["become-the-arknight"], {
  keywords: [
    {
      name: "specialization",
      hero: "Viserai",
    },
    goAgain,
  ],
  abilities: () => ({
    mayDiscardActionIfDiscardAttackActionWaySearch: {
      kind: "resolution",
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {
                  typeBox: {
                    types: ["Action"],
                  },
                },
                count: 1,
              },
              outputBinding: "it",
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "conditional",
                  condition: {
                    type: "compare-amount",
                    amount: {
                      type: "count",
                      what: "discarded-this-way",
                      filter: attackActionFilter(),
                    },
                    comparison: { op: "gte", value: 1 },
                  },
                  then: {
                    type: "search",
                    zones: ["deck"],
                    filter: {
                      typeBox: {
                        types: ["Action"],
                      },
                      and: [
                        {
                          typeBox: {
                            supertypes: ["Runeblade"],
                          },
                        },
                        {
                          typeBox: {
                            excludeSubtypes: ["Attack"],
                          },
                        },
                      ],
                    },
                    mayFail: true,
                    to: {
                      zone: "hand",
                    },
                  },
                },
                {
                  type: "conditional",
                  condition: {
                    type: "compare-amount",
                    amount: {
                      type: "count",
                      what: "discarded-this-way",
                      filter: { typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] } },
                    },
                    comparison: { op: "gte", value: 1 },
                  },
                  then: {
                    type: "search",
                    zones: ["deck"],
                    filter: {
                      typeBox: {
                        types: ["Action"],
                      },
                      and: [
                        {
                          typeBox: {
                            supertypes: ["Runeblade"],
                          },
                        },
                        {
                          typeBox: {
                            subtypes: ["Attack"],
                          },
                        },
                      ],
                    },
                    mayFail: true,
                    to: {
                      zone: "hand",
                    },
                  },
                },
              ],
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  }),
});
export const { blue: becomeTheArknightBlue } = becomeTheArknight.cards;
