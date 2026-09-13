import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/phoenix-form.generated.ts";

const phoenixFlamesYouControl = {
  type: "count" as const,
  what: "cards-in-zone" as const,
  zone: "combat-chain" as const,
  player: "controller" as const,
  filter: {
    name: "Phoenix Flame",
  },
};

export const phoenixForm = definePitchFamily(fabPitchFamilies["phoenix-form"], {
  abilities: () => ({
    ability1MorePhoenixFlamesPhoenixFormGoAgain2More2Power3MoreHitsDraw3: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: phoenixFlamesYouControl,
              comparison: { op: "gte", value: 1 },
            },
            then: {
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
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: phoenixFlamesYouControl,
              comparison: { op: "gte", value: 2 },
            },
            then: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 2,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: phoenixFlamesYouControl,
              comparison: { op: "gte", value: 3 },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "hitsDraw3",
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
                      type: "draw",
                      count: 3,
                      player: "controller",
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
        ],
      },
    },
  }),
});

export const { red: phoenixFormRed } = phoenixForm.cards;
