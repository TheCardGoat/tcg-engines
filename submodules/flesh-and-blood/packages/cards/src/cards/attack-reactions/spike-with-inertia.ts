import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/spike-with-inertia.generated.ts";

export const spikeWithInertia = definePitchFamily(fabPitchFamilies["spike-with-inertia"], {
  abilities: () => ({
    boostStealthAndCreateInertia: {
      kind: "resolution",
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
              filter: attackActionFilter({ hasKeyword: "stealth" }),
              count: 1,
            },
            duration: "this-turn",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "createInertiaOnHit",
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
                    type: "create-token",
                    token: "inertia",
                    controller: "attack-target",
                  },
                },
              },
            },
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: attackActionFilter({ hasKeyword: "stealth" }),
              count: 1,
            },
            duration: "this-turn",
          },
        ],
        outputBinding: "it",
      },
    },
  }),
});

export const { red: spikeWithInertiaRed } = spikeWithInertia.cards;
