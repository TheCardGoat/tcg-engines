import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mask-of-shifting-perspectives.generated.ts";

export const maskOfShiftingPerspectives = defineCard(
  fabCardIdentitiesByCanonicalId["bbr8GPmnDkdphMkdpWkcM"],
  {
    keywords: [bladeBreak],
    abilities: {
      attackReactionDestroyMaskShiftingPerspectivesWheneverDaggerHits: {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        // "whenever … this turn" → multi-fire delayed (duration this-turn).
        // Hit filter: dagger type-line (not moniker-only name match).
        // Hand pick: any card (subtypes:["Card"] is English residue).
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "event-object",
                selector: "attack",
                relationship: {
                  kind: "any",
                },
                filter: {
                  typeBox: {
                    subtypes: ["Dagger"],
                  },
                },
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "every",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "optional",
              effect: {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  count: 1,
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
              then: {
                type: "draw",
                count: 1,
                player: "controller",
              },
            },
          },
        },
      },
    },
  },
);
