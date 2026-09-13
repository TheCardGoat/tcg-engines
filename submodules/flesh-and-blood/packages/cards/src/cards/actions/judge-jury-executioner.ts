import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/judge-jury-executioner.generated.ts";

export const judgeJuryExecutioner = definePitchFamily(fabPitchFamilies["judge-jury-executioner"], {
  keywords: [
    legendary,
    {
      name: "specialization",
      hero: "Azalea",
    },
  ],
  abilities: () => ({
    aimCounterGetsHitsDiscardAllBut1Hand: {
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
            id: "hitsDiscardAllBut1Hand",
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
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "attack-target",
                  zones: ["hand"],
                  count: {
                    type: "all",
                  },
                  keep: 1,
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
  }),
});

export const { red: judgeJuryExecutionerRed } = judgeJuryExecutioner.cards;
