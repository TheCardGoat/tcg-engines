import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mask-of-malicious-manifestations.generated.ts";

export const maskOfMaliciousManifestations = defineCard(
  fabCardIdentitiesByCanonicalId["WLbcgwmGhWDWgdcbdjgWt"],
  {
    keywords: [bladeBreak],
    abilities: {
      actionPutFromHandArsenalBottomDeckDestroyMask: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            {
              class: "effect",
              type: "move-to-deck",
              from: "hand-and-arsenal",
              position: "bottom",
              count: 1,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        layerKeywords: [goAgain],
        effect: {
          type: "sequence",
          steps: [
            {
              // Printed "reveal until you reveal an attack action card" — bind the
              // first AAC from the top. Intermediate non-AAC reveals are not yet
              // modeled as public observations; the put-to-hand outcome is the
              // rules-visible core. (star would collect every AAC and rebind last.)
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                filter: attackActionFilter(),
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "move-card",
              target: {
                selector: "binding",
                binding: "it",
              },
              to: {
                zone: "hand",
              },
            },
            {
              type: "shuffle",
              zone: "deck",
            },
          ],
        },
      },
    },
  },
);
