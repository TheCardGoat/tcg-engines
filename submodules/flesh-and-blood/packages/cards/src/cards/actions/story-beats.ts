import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/story-beats.generated.ts";

export const storyBeats = definePitchFamily(fabPitchFamilies["story-beats"], {
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
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
          type: "optional",
          effect: {
            type: "choice",
            options: [
              {
                type: "add-counter",
                counter: {
                  kind: "named",
                  name: "suspense",
                },
                count: 1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    and: [
                      {
                        typeBox: {
                          subtypes: ["Aura"],
                        },
                      },
                      {
                        hasKeyword: "suspense",
                      },
                    ],
                  },
                  count: 1,
                },
              },
              {
                type: "remove-counters",
                counter: {
                  kind: "named",
                  name: "suspense",
                },
                count: 1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    and: [
                      {
                        typeBox: {
                          subtypes: ["Aura"],
                        },
                      },
                      {
                        hasKeyword: "suspense",
                      },
                    ],
                  },
                  count: 1,
                },
              },
            ],
          },
        },
      },
    },
    triggeredStaticOnDefendEffect: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "choice",
            options: [
              {
                type: "add-counter",
                counter: {
                  kind: "named",
                  name: "suspense",
                },
                count: 1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    and: [
                      {
                        typeBox: {
                          subtypes: ["Aura"],
                        },
                      },
                      {
                        hasKeyword: "suspense",
                      },
                    ],
                  },
                  count: 1,
                },
              },
              {
                type: "remove-counters",
                counter: {
                  kind: "named",
                  name: "suspense",
                },
                count: 1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    and: [
                      {
                        typeBox: {
                          subtypes: ["Aura"],
                        },
                      },
                      {
                        hasKeyword: "suspense",
                      },
                    ],
                  },
                  count: 1,
                },
              },
            ],
          },
        },
      },
    },
  }),
});

export const {
  red: storyBeatsRed,
  yellow: storyBeatsYellow,
  blue: storyBeatsBlue,
} = storyBeats.cards;
