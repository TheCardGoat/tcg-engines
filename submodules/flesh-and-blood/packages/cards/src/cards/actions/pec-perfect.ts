import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pec-perfect.generated.ts";

export const pecPerfect = definePitchFamily(fabPitchFamilies["pec-perfect"], {
  abilities: () => ({
    wheneverDefendsClashDefendingWinnerDestroysTopOtherHerosDeck: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          target: {
            kind: "any",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "clash",
          with: {
            selector: "defending-hero",
          },
          prize: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
          },
        },
      },
      label: {
        name: "clash",
      },
    },
  }),
});

export const { red: pecPerfectRed } = pecPerfect.cards;
