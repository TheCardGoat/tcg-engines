import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/find-center.generated.ts";

import { comboResolution } from "@tcg/flesh-and-blood-types";

import { combo } from "../shared/keywords.ts";

export const findCenter = definePitchFamily(fabPitchFamilies["find-center"], {
  keywords: [combo],
  abilities: () => ({
    craneDanceCombo: comboResolution({
      names: ["Crane Dance"],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "rule-modification",
            mode: "restrict",
            action: "defend",
            filter: {
              cost: {
                op: "lt",
                value: {
                  type: "count",
                  what: "chain-links",
                  player: "controller",
                },
              },
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
                id: "whenHitsCreateZenStateToken",
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
                    type: "create-token",
                    token: "zen-state",
                    controller: "controller",
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
    }),
  }),
});
export const { blue: findCenterBlue } = findCenter.cards;
