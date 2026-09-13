import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hostile-encroachment.generated.ts";

export const hostileEncroachment = definePitchFamily(fabPitchFamilies["hostile-encroachment"], {
  abilities: () => ({
    attacksDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
          type: "draw",
          count: 1,
          player: "attack-target",
        },
      },
    },
    deals4MoreDamageDiscard: crushAbility({
      effect: {
        type: "discard",
        target: {
          selector: "attack-target",
        },
      },
    }),
  }),
});

export const { red: hostileEncroachmentRed } = hostileEncroachment.cards;
