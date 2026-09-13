import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/no-tall-tales.generated.ts";

export const noTallTales = definePitchFamily(fabPitchFamilies["no-tall-tales"], {
  abilities: () => ({
    powerGreaterThanBaseGets1Power: {
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
    ability13MorePowerGetsHitsLoseCantGetGoAgainDuringNextActionPhase: {
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
            id: "hitsLoseCantGetGoAgainDuringNextActionPhase",
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
                type: "sequence",
                steps: [
                  {
                    type: "remove-property",
                    property: {
                      kind: "keyword",
                      keyword: goAgain,
                    },
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "attack-target",
                      zones: ["permanent", "combat-chain", "stack", "hand", "deck", "arsenal"],
                      count: {
                        type: "all",
                      },
                    },
                    duration: "until-end-of-next-turn",
                  },
                  {
                    type: "rule-modification",
                    mode: "restrict",
                    action: "gain-keyword",
                    keyword: "go-again",
                    duration: "until-end-of-next-turn",
                  },
                ],
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

export const { yellow: noTallTalesYellow } = noTallTales.cards;
