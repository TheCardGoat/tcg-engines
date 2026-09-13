import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cut-the-small-talk.generated.ts";

export const cutTheSmallTalk = definePitchFamily(fabPitchFamilies["cut-the-small-talk"], {
  abilities: () => ({
    ifHasGreaterThanBaseGets1: {
      kind: "resolution",
      condition: {
        type: "object-numeric-comparison",
        property: "power",
        left: "current",
        op: "gt",
        right: "base",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    ifHas13MoreGetsWhenHitsHeroDestroy: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "attack-power",
        comparison: { op: "gte", value: 13 },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroDestroyAllAurasTheyControl",
            text: "",
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
                target: {
                  kind: "hero",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "attack-target",
                  zones: ["permanent"],
                  filter: {
                    typeBox: {
                      subtypes: ["Aura"],
                    },
                  },
                  count: {
                    type: "all",
                  },
                },
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
      label: {
        name: "tower",
      },
    },
  }),
});
export const { yellow: cutTheSmallTalkYellow } = cutTheSmallTalk.cards;
