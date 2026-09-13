import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { spectra } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/merciful-retribution.generated.ts";

export const mercifulRetribution = definePitchFamily(fabPitchFamilies["merciful-retribution"], {
  keywords: [spectra],
  abilities: () => ({
    wheneverAuraAttackActionControlIsDestroyedDeal1: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "destroy",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              or: [
                {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                },
                attackActionFilter(),
              ],
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "any-hero",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  and: [
                    {
                      typeBox: {
                        supertypes: ["Light"],
                      },
                    },
                    {
                      typeBox: {
                        excludeMetatypes: ["Token"],
                      },
                    },
                  ],
                },
              },
              then: {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                to: {
                  zone: "soul",
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: mercifulRetributionYellow } = mercifulRetribution.cards;
