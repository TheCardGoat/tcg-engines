import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/red-hot.generated.ts";

export const redHot = definePitchFamily(fabPitchFamilies["red-hot"], {
  keywords: [
    {
      name: "specialization",
      hero: "Dromai or Fai",
    },
  ],
  abilities: () => ({
    redHotPlayedChainLink4HigherAttackRevealTopXDeckWhereXNumberDraconicChainLinksDealDamageEqualNumberRedRevealedWayAnyTargetThenShuffle:
      {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "has-status",
          status: "played-at-chain-link-4-or-higher",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "attackRevealTopXDeckWhereXNumberDraconicChainLinksDealDamageEqualNumberRedRevealedWayAnyTargetThenShuffle",
              text: "",
              trigger: {
                kind: "event",
                event: {
                  name: "attack",
                  actor: {
                    kind: "player",
                    player: "ability-controller",
                  },
                  observes: {
                    kind: "event-object",
                    selector: "attack",
                    relationship: {
                      kind: "any",
                    },
                    filter: {
                      name: "This",
                    },
                  },
                },
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "sequence",
                  steps: [
                    {
                      type: "reveal",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "controller",
                        zones: ["deck"],
                        position: "top",
                        count: {
                          type: "count",
                          what: "chain-links",
                          player: "controller",
                          filter: {
                            typeBox: {
                              supertypes: ["Draconic"],
                            },
                          },
                        },
                      },
                    },
                    {
                      type: "deal-damage",
                      damageType: "generic",
                      amount: {
                        type: "count",
                        what: "cards-revealed-this-way",
                        filter: {
                          color: ["red"],
                        },
                      },
                      target: {
                        selector: "object",
                        declared: "on-stack",
                        zones: ["hero", "permanent"],
                        count: 1,
                      },
                    },
                    {
                      type: "shuffle",
                      zone: "deck",
                    },
                  ],
                },
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        label: {
          name: "rupture",
        },
      },
  }),
});

export const { red: redHotRed } = redHot.cards;
