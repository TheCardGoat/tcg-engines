import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/fist-pump.generated.ts";

export const fistPump = defineCard(fabCardIdentitiesByCanonicalId["PGCBWLPcTWcHRh7CwW8K7"], {
  keywords: [battleworn],
  abilities: {
    wheneverBanishHyperDriverFromBoostingTargetWrenchControl: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "banish",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Hyper Driver",
              hasStatus: "from-boosting",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["weapon", "permanent", "combat-chain"],
            filter: {
              typeBox: {
                subtypes: ["Wrench"],
              },
            },
            count: 1,
          },
          duration: "this-turn",
        },
      },
    },
  },
});
