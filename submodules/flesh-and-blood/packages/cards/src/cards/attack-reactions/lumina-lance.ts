import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/lumina-lance.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const luminaLance = definePitchFamily(fabPitchFamilies["lumina-lance"], {
  abilities: () => ({
    banishSoulAndChooseModes: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "count",
          what: "banished-for-cost",
        },
      },
      modes: {
        boostLightAttack: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  supertypes: ["Light"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
        },
        drawOnHit: {
          kind: "resolution",
          effect: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "drawOnHit",
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
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "draw",
                    count: 1,
                    player: "controller",
                  },
                },
              },
            },
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  supertypes: ["Light"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
        },
        gainGoAgainOnHit: {
          kind: "resolution",
          effect: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "gainGoAgainOnHit",
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
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "grant-property",
                    property: {
                      kind: "keyword",
                      keyword: goAgain,
                    },
                    target: {
                      selector: "self",
                    },
                    duration: "this-turn",
                  },
                },
              },
            },
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  supertypes: ["Light"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
        },
      },
      additionalCost: {
        class: "effect",
        type: "banish",
        from: "soul",
        count: {
          type: "up-to",
          amount: 3,
        },
        outputBinding: "them",
      },
    }),
  }),
});

export const { yellow: luminaLanceYellow } = luminaLance.cards;
