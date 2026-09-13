import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/bone-barrier.generated.ts";

export const boneBarrier = definePitchFamily(fabPitchFamilies["bone-barrier"], {
  abilities: () => ({
    defend: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "choice",
            options: [
              {
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: { typeBox: { subtypes: ["Ally"] } },
                  count: 1,
                },
              },
              {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  filter: { typeBox: { subtypes: ["Ally"] } },
                  count: 1,
                },
              },
            ],
          },
          then: {
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: 2,
            target: { selector: "self" },
            duration: "this-chain-link",
          },
        },
      },
    },
  }),
});
export const { blue: boneBarrierBlue } = boneBarrier.cards;
