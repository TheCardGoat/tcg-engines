import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { ward } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/waning-vengeance.generated.ts";

export const waningVengeance = definePitchFamily(fabPitchFamilies["waning-vengeance"], {
  parameters: pitchMap({
    red: 3,
    yellow: 2,
    blue: 1,
  }),
  keywords: pitchMap({ red: [ward(3)], yellow: [ward(2)], blue: [ward(1)] }),
  abilities: () => ({
    spectralShieldOnLeave: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "leave-arena",
          actor: { kind: "any" },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
        state: {
          type: "pitch-zone-has",
          filter: { color: ["blue"] },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "spectral-shield",
          controller: "controller",
        },
      },
    },
  }),
});

export const {
  red: waningVengeanceRed,
  yellow: waningVengeanceYellow,
  blue: waningVengeanceBlue,
} = waningVengeance.cards;
