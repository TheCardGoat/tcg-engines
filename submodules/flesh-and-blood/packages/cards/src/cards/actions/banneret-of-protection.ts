import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/banneret-of-protection.generated.ts";

export const banneretOfProtection = definePitchFamily(fabPitchFamilies["banneret-of-protection"], {
  abilities: () => ({
    whenIsChargedHeroSSoulCreateSpellbaneAegis: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "move-zone",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            bindAs: "it",
          },
          to: "soul",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "spellbane-aegis",
          controller: "controller",
        },
      },
      label: {
        name: "solflare",
      },
    },
  }),
});
export const { yellow: banneretOfProtectionYellow } = banneretOfProtection.cards;
