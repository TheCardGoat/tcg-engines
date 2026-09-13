import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/strength-rules-all.generated.ts";

export const strengthRulesAll = definePitchFamily(fabPitchFamilies["strength-rules-all"], {
  abilities: () => ({
    whenHitsHeroTurnInTheirArsenalFaceUpBanishAttackAction: {
      kind: "static",
      staticKind: "triggered",
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
              type: "turn-face-up",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["arsenal"],
                count: 1,
              },
            },
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["arsenal"],
                filter: attackActionFilter({
                  numeric: [
                    {
                      property: "power",
                      basis: "current",
                      comparison: {
                        op: "lt",
                        value: {
                          type: "reference",
                          binding: "trigger-event-damage",
                          missing: "zero",
                        },
                      },
                    },
                  ],
                }),
                count: 1,
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: strengthRulesAllRed } = strengthRulesAll.cards;
