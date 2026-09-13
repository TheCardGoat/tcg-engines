import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/figment-of-protection.generated.ts";

export const figmentOfProtection = definePitchFamily(fabPitchFamilies["figment-of-protection"], {
  keywords: [legendary],
  abilities: () => ({
    whenEntersArenaCreateSpectralShieldToken: {
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
          type: "create-token",
          token: "spectral-shield",
          controller: "controller",
        },
      },
    },
  }),
});

export const { yellow: figmentOfProtectionYellow } = figmentOfProtection.cards;
