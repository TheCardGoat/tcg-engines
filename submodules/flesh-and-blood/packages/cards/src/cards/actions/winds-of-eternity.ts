import { comboResolution } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/winds-of-eternity.generated.ts";
import { combo } from "../shared/keywords.ts";

export const windsOfEternity = definePitchFamily(fabPitchFamilies["winds-of-eternity"], {
  keywords: [combo],
  abilities: () => ({
    comboResolution: comboResolution({
      names: ["Winds Of Eternity"],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "self",
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
                id: "whenHitsShuffleAllNamedHundredWindsControlOnCombatChainInto",
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
                    type: "sequence",
                    steps: [
                      {
                        type: "move-card",
                        target: {
                          selector: "object",
                          declared: "at-resolution",
                          player: "controller",
                          zones: ["combat-chain"],
                          filter: {
                            name: "Hundred Winds",
                          },
                          count: {
                            type: "all",
                          },
                        },
                        to: {
                          zone: "deck",
                          shuffle: true,
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
            duration: "this-turn",
          },
        ],
      },
    }),
  }),
});

export const { blue: windsOfEternityBlue } = windsOfEternity.cards;
