import { combo, goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/retrace-the-past.generated.ts";

export const retraceThePast = definePitchFamily(fabPitchFamilies["retrace-the-past"], {
  keywords: [
    {
      name: "specialization",
      hero: "Katsu",
    },
    combo,
  ],
  abilities: () => ({
    attacksGustwaveNameLastAttackCombatChainNameThenGetsName2PowerGoAgain: {
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
          type: "last-attack-this-combat-chain",
          nameIncludes: ["Gustwave"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "name-card",
              suggestions: ["your-hand"],
            },
            {
              type: "sequence",
              steps: [
                {
                  type: "grant-property",
                  property: {
                    kind: "name",
                    value: "chosen",
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
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
                    kind: "keyword",
                    keyword: goAgain,
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
              ],
            },
          ],
        },
      },
      label: {
        name: "combo",
        params: {
          names: ["*Gustwave*"],
        },
      },
    },
  }),
});

export const { blue: retraceThePastBlue } = retraceThePast.cards;
