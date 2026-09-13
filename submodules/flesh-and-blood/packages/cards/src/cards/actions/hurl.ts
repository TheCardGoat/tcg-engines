import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hurl.generated.ts";

export const hurl = definePitchFamily(fabPitchFamilies["hurl"], {
  supertypeSets: [["Assassin"], ["Ninja"]],
  keywords: [goAgain],

  abilities: () => ({
    playResourcesGrantPropertyTriggeredAttackSequenceDealDamageConditionalBindingNumericSetStatusHitDestroyPermanent:
      {
        kind: "static",
        staticKind: "play",
        playEffect: {
          role: "additional-cost",
          cost: {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          optional: true,
          then: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "throwDaggerOnAttack",
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
                      kind: "source",
                      selector: "attack",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "sequence",
                    steps: [
                      {
                        type: "deal-damage",
                        damageType: "generic",
                        amount: 1,
                        target: {
                          selector: "any-hero",
                        },
                        source: {
                          selector: "object",
                          declared: "on-stack",
                          player: "controller",
                          zones: ["weapon", "permanent", "combat-chain"],
                          filter: {
                            typeBox: {
                              subtypes: ["Dagger"],
                            },
                          },
                          count: 1,
                        },
                        outputBinding: "it",
                      },
                      {
                        type: "conditional",
                        condition: {
                          type: "binding-numeric",
                          binding: "damage-dealt-this-way",
                          comparison: { op: "gt", value: 0 },
                        },
                        then: {
                          type: "set-status",
                          status: "hit",
                          target: {
                            selector: "binding",
                            binding: "it",
                          },
                        },
                      },
                      {
                        type: "destroy",
                        target: {
                          selector: "binding",
                          binding: "it",
                        },
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
        },
      },
  }),
});
export const { red: hurlRed, yellow: hurlYellow, blue: hurlBlue } = hurl.cards;
