import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/whelming-gustwave.generated.ts";
import { comboResolution } from "@tcg/flesh-and-blood-types";
import { combo, goAgain } from "../shared/keywords.ts";

export const whelmingGustwave = definePitchFamily(fabPitchFamilies["whelming-gustwave"], {
  keywords: [combo],
  abilities: () => ({
    comboResolution: comboResolution({
      names: ["Surging Strike"],
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
            duration: "this-turn",
          },
          {
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
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "triggeredStaticOnHitEffect",
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
              selector: "self",
            },
            duration: "this-turn",
          },
        ],
      },
    }),
  }),
});

export const {
  red: whelmingGustwaveRed,
  yellow: whelmingGustwaveYellow,
  blue: whelmingGustwaveBlue,
} = whelmingGustwave.cards;
