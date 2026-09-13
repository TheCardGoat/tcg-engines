import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/crown-of-dominion.generated.ts";

export const crownOfDominion = defineCard(fabCardIdentitiesByCanonicalId["QbRRGgm9QNjFGchhLkbtF"], {
  abilities: {
    heroIsRoyal: {
      kind: "static",
      staticKind: "continuous",
      // Royal is a talent supertype (FAB_TALENT_SUPERTYPES), not a free-form
      // status. Continuous set-status is not a continuous-effect producer;
      // grant-property supertype is the scalable path (same as Universal → class).
      effect: {
        type: "grant-property",
        property: {
          kind: "supertype",
          value: "Royal",
        },
        target: {
          selector: "controller",
        },
        duration: "permanent",
      },
    },
    whenEquipCrownDominionCreateGoldToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "equip",
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
          token: "gold",
          controller: "controller",
        },
      },
    },
  },
});
