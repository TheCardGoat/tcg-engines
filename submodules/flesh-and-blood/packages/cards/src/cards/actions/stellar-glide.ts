import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stellar-glide.generated.ts";

const abilities = {
  triggeredEffect: {
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
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              name: "Lightning Flow",
            },
            count: 1,
          },
        },
        then: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: {
              name: "go-again",
            },
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  },
} as const;

export const stellarGlide = definePitchFamily(fabPitchFamilies["stellar-glide"], {
  abilities: () => abilities,
});

export const {
  red: stellarGlideRed,
  yellow: stellarGlideYellow,
  blue: stellarGlideBlue,
} = stellarGlide.cards;
