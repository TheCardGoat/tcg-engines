import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/reverent-rerebrace.generated.ts";

export const reverentRerebrace = defineCard(
  fabCardIdentitiesByCanonicalId["FfHjRwfgzHqngmjCpdCHf"],
  {
    // Printed bold "sharpen" is a glossary keyword in body text, not a resolution
    // Sharpen keyword on the equipment itself (parser artifact removed).
    keywords: [temper],
    abilities: {
      ifWouldSharpenZenithBladeInsteadMayPayDestroy: {
        kind: "static",
        staticKind: "continuous",
        // Continuous replacement on the CR 8.5.58 `sharpen` event — not a fake
        // has-status "would-sharpen-zenith-blade" gate (that status never fires).
        effect: {
          type: "replacement",
          replacementKind: "standard",
          replaces: {
            name: "sharpen",
            subject: {
              name: "Zenith Blade",
            },
            player: "controller",
          },
          modification: {
            type: "optional",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "pay",
                  cost: {
                    class: "asset",
                    type: "resources",
                    amount: 1,
                  },
                  payer: "controller",
                },
                {
                  type: "destroy",
                  target: {
                    selector: "self",
                  },
                },
              ],
            },
            then: {
              type: "sharpen",
              target: {
                selector: "binding",
                binding: "it",
              },
              times: 1,
            },
          },
          duration: "while-in-arena",
        },
      },
    },
  },
);
