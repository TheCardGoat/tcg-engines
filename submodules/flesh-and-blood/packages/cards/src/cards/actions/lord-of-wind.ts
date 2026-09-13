import { combo } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lord-of-wind.generated.ts";

export const lordOfWind = definePitchFamily(fabPitchFamilies["lord-of-wind"], {
  keywords: [
    {
      name: "specialization",
      hero: "Katsu",
    },
    combo,
  ],
  abilities: () => ({
    mugenshiRELEASELastAttackCombatChainAdditionalCostPlayLordWindPayAnyAmountResourceShuffleManyTargetNamedSurgingStrikeWhelmingGustwaveMugenshiRELEASEGraveyardDeckThenLordWindGainsMuchPower:
      {
        kind: "static",
        staticKind: "play",
        condition: {
          type: "last-attack-this-combat-chain",
          names: ["Mugenshi: Release"],
        },
        playEffect: {
          role: "additional-cost",
          cost: {
            class: "asset",
            type: "resources",
            amount: {
              type: "x",
            },
            optional: true,
          },
          optional: true,
          then: {
            type: "sequence",
            steps: [
              {
                type: "sequence",
                steps: [
                  {
                    type: "move-card",
                    target: {
                      selector: "object",
                      declared: "on-stack",
                      player: "controller",
                      zones: ["graveyard"],
                      filter: {
                        or: [
                          {
                            name: "Surging Strike",
                          },
                          {
                            name: "Whelming Gustwave",
                          },
                          {
                            name: "Mugenshi: RELEASE",
                          },
                        ],
                      },
                      count: {
                        type: "all",
                      },
                    },
                    to: {
                      zone: "deck",
                    },
                  },
                  {
                    type: "shuffle",
                    zone: "deck",
                  },
                ],
              },
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: {
                  type: "x",
                },
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
            ],
          },
        },
        label: {
          name: "combo",
          params: {
            names: ["Mugenshi: Release"],
          },
        },
      },
  }),
});

export const { blue: lordOfWindBlue } = lordOfWind.cards;
