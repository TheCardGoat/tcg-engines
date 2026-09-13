import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/exorcism.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const exorcism = definePitchFamily(fabPitchFamilies.exorcism, {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackGetsPowerAndExorcisesOnHit: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: { selector: "this-attack" },
            duration: "this-turn",
            appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } },
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "turnBanishedCardsFaceDownOnHit",
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
                  effect: {
                    type: "turn-face-down",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["banished"],
                      count: { type: "all" },
                    },
                  },
                },
              },
            },
            target: { selector: "this-attack" },
            duration: "this-turn",
            appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } },
          },
        ],
      },
    },
  }),
});
export const { red: exorcismRed } = exorcism.cards;
