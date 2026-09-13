import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/second-strike.generated.ts";

const abilities = {
  triggeredEffect: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event-and-state",
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
      state: {
        type: "damage-dealt",
        player: "controller",
        per: "turn",
        comparison: {
          op: "gte",
          value: 1,
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
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
            duration: "permanent",
          },
        ],
      },
    },
  },
} as const;

export const secondStrike = definePitchFamily(fabPitchFamilies["second-strike"], {
  abilities: () => abilities,
});

export const {
  red: secondStrikeRed,
  yellow: secondStrikeYellow,
  blue: secondStrikeBlue,
} = secondStrike.cards;
