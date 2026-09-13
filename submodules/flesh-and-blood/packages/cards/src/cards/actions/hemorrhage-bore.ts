import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hemorrhage-bore.generated.ts";

const abilities = {
  continuousHasCounterAimGrantPropertyTriggeredHitDestroyPermanent: {
    kind: "static",
    staticKind: "continuous",
    condition: {
      type: "has-counter",
      counter: {
        kind: "named",
        name: "aim",
      },
      target: {
        selector: "self",
      },
    },
    effect: {
      type: "grant-property",
      property: {
        kind: "ability",
        ability: {
          kind: "static",
          staticKind: "triggered",
          id: "triggeredHitDestroy",
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
                player: "opponent",
                zones: ["arsenal"],
                filter: {},
                count: 1,
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
  },
} as const;

export const hemorrhageBore = definePitchFamily(fabPitchFamilies["hemorrhage-bore"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: hemorrhageBoreRed,
  yellow: hemorrhageBoreYellow,
  blue: hemorrhageBoreBlue,
} = hemorrhageBore.cards;
