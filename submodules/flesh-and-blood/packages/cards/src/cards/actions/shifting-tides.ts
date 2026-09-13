import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shifting-tides.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const shiftingTides = definePitchFamily(fabPitchFamilies["shifting-tides"], {
  keywords: [goAgain],
  abilities: () => ({
    atStartTurnPitchTopDeckSBluePutOnBottomOwner: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
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
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              to: {
                zone: "pitch",
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  color: ["blue"],
                },
              },
              then: {
                type: "move-card",
                target: {
                  selector: "self",
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
              else: {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: shiftingTidesBlue } = shiftingTides.cards;
