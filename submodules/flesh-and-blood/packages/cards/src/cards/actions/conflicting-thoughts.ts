import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/conflicting-thoughts.generated.ts";

export const conflictingThoughts = definePitchFamily(fabPitchFamilies["conflicting-thoughts"], {
  abilities: () => ({
    opt: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
        },
      },
      resolution: { kind: "effect", effect: { type: "opt", count: 1 } },
    },
  }),
});

export const {
  red: conflictingThoughtsRed,
  yellow: conflictingThoughtsYellow,
  blue: conflictingThoughtsBlue,
} = conflictingThoughts.cards;
