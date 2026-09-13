import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/double-trouble.generated.ts";
import { stealth } from "../shared/keywords.ts";
const abilities = {
  empowerAndBanishOnHitAfterTwoReactions: {
    kind: "static",
    staticKind: "continuous",
    condition: {
      type: "compare-amount",
      amount: {
        type: "count",
        what: "attack-reactions-this-chain-link",
      },
      comparison: {
        op: "gte",
        value: 2,
      },
    },
    effect: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "banishDeckCardsOnHit",
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
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "opponent",
                    zones: ["deck"],
                    position: "top",
                    count: 2,
                  },
                  outputBinding: "banished",
                },
              },
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
} as const;
export const doubleTrouble = definePitchFamily(fabPitchFamilies["double-trouble"], {
  keywords: [stealth],
  abilities: () => abilities,
});
export const {
  red: doubleTroubleRed,
  yellow: doubleTroubleYellow,
  blue: doubleTroubleBlue,
} = doubleTrouble.cards;
