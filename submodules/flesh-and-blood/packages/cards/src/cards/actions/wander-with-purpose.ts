import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wander-with-purpose.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const wanderWithPurpose = definePitchFamily(fabPitchFamilies["wander-with-purpose"], {
  keywords: [
    {
      name: "specialization",
      hero: "Benji",
    },
    goAgain,
  ],
  abilities: () => ({
    whenHitsDiscardWithCostNumber0DoSearchDeckForWithCombo: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
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
              type: "optional",
              effect: {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  filter: {
                    cost: { op: "eq", value: 0 },
                  },
                  count: 1,
                },
                outputBinding: "it",
              },
              then: {
                type: "search",
                zones: ["deck"],
                filter: {
                  hasKeyword: "combo",
                },
                mayFail: true,
                to: {
                  zone: "banished",
                },
              },
            },
            {
              type: "shuffle",
              zone: "deck",
            },
            {
              type: "optional",
              effect: {
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: wanderWithPurposeYellow } = wanderWithPurpose.cards;
