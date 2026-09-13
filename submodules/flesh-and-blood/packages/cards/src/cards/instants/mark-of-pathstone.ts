import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/mark-of-pathstone.generated.ts";

export const markOfPathstone = definePitchFamily(fabPitchFamilies["mark-of-pathstone"], {
  abilities: () => ({
    bindToAlly: {
      kind: "resolution",
      effect: {
        type: "bind-aura",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["permanent"],
          filter: { typeBox: { subtypes: ["Ally"] } },
          count: 1,
        },
      },
    },
    boundAllyHasPowerAndPathstoneRiders: {
      kind: "static",
      staticKind: "while",
      condition: { type: "source-is-subcard-of-host" },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: { selector: "host" },
            duration: "while-condition",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "markOfPathstoneHit",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
                    actor: { kind: "player", player: "ability-controller" },
                    observes: { kind: "source", selector: "attack" },
                    target: { kind: "hero" },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
                },
              },
            },
            target: { selector: "host" },
            duration: "while-condition",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "markOfPathstoneDies",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "dies",
                    actor: { kind: "any" },
                    observes: { kind: "source", selector: "moved-object" },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
                },
              },
            },
            target: { selector: "host" },
            duration: "while-condition",
          },
        ],
      },
    },
  }),
});
export const { blue: markOfPathstoneBlue } = markOfPathstone.cards;
