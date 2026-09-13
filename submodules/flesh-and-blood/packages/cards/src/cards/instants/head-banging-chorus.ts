import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/head-banging-chorus.generated.ts";

export const headBangingChorus = definePitchFamily(fabPitchFamilies["head-banging-chorus"], {
  keywords: [{ name: "suspense" }],
  abilities: () => ({
    chorus: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "drawOnHitWithEmptyHand",
            text: "",
            trigger: {
              kind: "event-and-state",
              event: {
                name: "hit",
                actor: { kind: "player", player: "ability-controller" },
                observes: { kind: "source", selector: "attack" },
                target: { kind: "hero" },
              },
              state: {
                type: "zone-count",
                zone: "hand",
                player: "controller",
                comparison: { op: "eq", value: 0 },
              },
            },
            resolution: {
              kind: "effect",
              effect: { type: "draw", count: 1, player: "controller" },
            },
          },
        },
        appliesTo: {
          next: attackActionFilter({
            or: [
              { typeBox: { supertypes: ["Guardian"] } },
              { typeBox: { supertypes: ["Revered"] } },
            ],
          }),
          events: ["play"],
          count: 1,
          perTurn: true,
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { yellow: headBangingChorusYellow } = headBangingChorus.cards;
