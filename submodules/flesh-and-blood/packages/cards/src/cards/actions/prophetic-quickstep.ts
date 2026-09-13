import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/prophetic-quickstep.generated.ts";

export const propheticQuickstep = definePitchFamily(fabPitchFamilies["prophetic-quickstep"], {
  abilities: () => ({
    goAgainGets1PowerAttacksDeal1ArcaneDamage: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-keyword",
        keyword: "go-again",
        target: {
          selector: "self",
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "attacksDeal1ArcaneDamage",
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
                    target: {
                      kind: "hero",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "deal-damage",
                    damageType: "arcane",
                    amount: 1,
                    target: {
                      selector: "attack-target",
                    },
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
      label: {
        name: "quickstrike",
      },
    },
    firstTimeDealsDamageCreatePonderToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "ponder",
          controller: "controller",
        },
      },
      limit: {
        count: 1,
        per: "turn",
        ordinals: [1],
      },
    },
  }),
});

export const { yellow: propheticQuickstepYellow } = propheticQuickstep.cards;
