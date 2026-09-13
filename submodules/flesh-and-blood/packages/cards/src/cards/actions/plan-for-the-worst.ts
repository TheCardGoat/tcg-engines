import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/plan-for-the-worst.generated.ts";

export const planForTheWorst = definePitchFamily(fabPitchFamilies["plan-for-the-worst"], {
  abilities: () => ({
    lookTargetHerosHandArsenalBeginningNextEndPhaseDiscardAllHandDestroyAllArsenal: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              playerTarget: { selector: "any-hero" },
              playerTargetBinding: "looked-hero",
              zones: ["hand", "arsenal"],
              count: {
                type: "all",
              },
            },
          },
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "end-phase",
                actor: {
                  kind: "player",
                  player: "opponent",
                },
                observes: {
                  kind: "none",
                },
              },
            },
            policy: {
              kind: "windowed",
              duration: "during-their-next-end-phase",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "discard",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["hand"],
                      count: {
                        type: "all",
                      },
                    },
                  },
                  {
                    type: "destroy",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["arsenal"],
                      count: {
                        type: "all",
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
    searchDeckUp3TrapsRevealPutHandThenShuffle2HandDeck: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            filter: {
              typeBox: {
                subtypes: ["Trap"],
              },
            },
            count: {
              type: "up-to",
              amount: 3,
            },
            mayFail: true,
            to: {
              zone: "hand",
            },
          },
          {
            type: "sequence",
            steps: [
              {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  count: 2,
                },
                to: {
                  zone: "deck",
                },
              },
              {
                type: "shuffle",
                zone: "deck",
              },
            ],
          },
        ],
      },
    },
  }),
});

export const { blue: planForTheWorstBlue } = planForTheWorst.cards;
