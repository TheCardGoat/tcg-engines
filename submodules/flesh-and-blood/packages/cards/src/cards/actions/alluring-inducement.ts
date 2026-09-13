import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/alluring-inducement.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

export const alluringInducement = definePitchFamily(fabPitchFamilies["alluring-inducement"], {
  keywords: [
    {
      name: "specialization",
      hero: "Shiyana",
    },
  ],
  abilities: () => ({
    whenAttacksDefendingHeroRevealsTheirHandMayChoose: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "defending-hero",
                zones: ["hand"],
                count: {
                  type: "all",
                },
              },
            },
            {
              type: "optional",
              effect: {
                type: "choose-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "defending-hero",
                  zones: ["hand"],
                  filter: attackActionFilter({ inObjectBinding: "revealed-this-way" }),
                  count: 1,
                },
                outputBinding: "chosen-card",
              },
              then: {
                type: "copy",
                target: {
                  selector: "self",
                },
                source: {
                  selector: "binding",
                  binding: "chosen-card",
                },
                duration: "permanent",
              },
            },
          ],
        },
      },
    },
    whenDefendsTogetherFromHandCreateEloquenceTokenUnder: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
          cohort: {
            kind: "together-with",
            filter: {
              playedFromZones: ["hand"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "eloquence",
          controller: "any",
        },
      },
      label: {
        name: "unity",
      },
    },
  }),
});
export const { yellow: alluringInducementYellow } = alluringInducement.cards;
