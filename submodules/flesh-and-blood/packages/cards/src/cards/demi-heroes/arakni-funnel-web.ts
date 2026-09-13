import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/demi-heroes/arakni-funnel-web.generated.ts";

export const arakniFunnelWeb = defineCard(fabCardIdentitiesByCanonicalId.QrrLFqPwPhPkqTwqnzCMq, {
  abilities: {
    empowerStealthAndBanishArsenalOnHit: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "discard",
        count: 1,
        filter: {
          typeBox: {
            supertypes: ["Assassin"],
          },
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  supertypes: ["Assassin"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                hasKeyword: "stealth",
              },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "banishArsenalCardOnHit",
                  text: "",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "hit",
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
                      type: "banish",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "attack-target",
                        zones: ["arsenal"],
                        count: 1,
                      },
                    },
                  },
                },
              },
              target: {
                selector: "binding",
                binding: "it",
              },
              duration: "permanent",
            },
          },
        ],
      },
    },
    returnToBrood: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "return-to-brood" },
      },
    },
  },
});
