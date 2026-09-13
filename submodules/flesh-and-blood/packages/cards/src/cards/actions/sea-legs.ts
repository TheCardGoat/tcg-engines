import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sea-legs.generated.ts";

export const seaLegs = definePitchFamily(fabPitchFamilies["sea-legs"], {
  abilities: () => ({
    whenDiscardedCreateGoldkissRumToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "discard",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "goldkiss-rum",
          controller: "controller",
        },
      },
    },
  }),
});

export const { yellow: seaLegsYellow } = seaLegs.cards;
