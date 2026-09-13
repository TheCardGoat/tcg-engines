import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/figment-of-triumph.generated.ts";

export const figmentOfTriumph = definePitchFamily(fabPitchFamilies["figment-of-triumph"], {
  keywords: [legendary],
  abilities: () => ({
    whenEntersArenaAttackActionOpponentsControlGet1: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "subtract",
          amount: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["combat-chain"],
            filter: attackActionFilter(),
            count: {
              type: "all",
            },
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { yellow: figmentOfTriumphYellow } = figmentOfTriumph.cards;
