import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/cheater-s-charm.generated.ts";

export const cheaterSCharm = definePitchFamily(fabPitchFamilies["cheater-s-charm"], {
  abilities: () => ({
    chooseModes: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "any-number",
        },
      },
      modes: {
        stealConfidenceToughnessToken: {
          kind: "resolution",
          effect: {
            type: "gain-control",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  metatypes: ["Token"],
                },
                or: [
                  {
                    name: "Confidence",
                  },
                  {
                    name: "Toughness",
                  },
                ],
              },
              count: 1,
            },
            controller: "controller",
            duration: "this-turn",
          },
        },
        crowdBoos: {
          kind: "resolution",
          effect: {
            type: "crowd-boos",
            target: "controller",
          },
        },
        ifControlAttack6MoreDeal2DamageTarget: {
          kind: "resolution",
          effect: {
            type: "conditional",
            condition: {
              type: "control-object",
              filter: {
                and: [
                  {
                    typeBox: {
                      subtypes: ["Attack"],
                    },
                  },
                  {
                    numeric: [
                      {
                        property: "power",
                        basis: "base",
                        comparison: {
                          op: "gte",
                          value: 6,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            then: {
              type: "unless",
              effect: {
                type: "deal-damage",
                damageType: "generic",
                amount: 2,
                target: {
                  selector: "any-hero",
                },
              },
              escape: {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["hand"],
                  count: 1,
                },
              },
            },
          },
        },
      },
      label: {
        name: "steal",
      },
    }),
  }),
});

export const { yellow: cheaterSCharmYellow } = cheaterSCharm.cards;
