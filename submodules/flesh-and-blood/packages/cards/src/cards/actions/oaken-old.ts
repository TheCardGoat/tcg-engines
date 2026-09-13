import { dominate } from "../shared/keywords.ts";
import { fusion } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/oaken-old.generated.ts";

export const oakenOld = definePitchFamily(fabPitchFamilies["oaken-old"], {
  keywords: [fusion(["Earth", "Ice"], "and")],
  abilities: () => ({
    oakenOldFusedGains2PowerDominateHitsPut2RandomHandBottomDeckAnyOrder: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "fused",
      },
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
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: dominate,
            },
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
                id: "hitsPut2RandomHandBottomDeckAnyOrder",
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
                    type: "move-card",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "attack-target",
                      zones: ["hand"],
                      count: 2,
                      random: true,
                    },
                    to: {
                      zone: "deck",
                      position: "bottom",
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
    },
  }),
});

export const { red: oakenOldRed } = oakenOld.cards;
