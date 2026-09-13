import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tooth-and-claw.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const toothAndClaw = definePitchFamily(fabPitchFamilies["tooth-and-claw"], {
  keywords: [goAgain],
  abilities: () => ({
    whenAttacksRevealAnyNumberCrouchingTigersFromHandRevealNumber1More: {
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
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "reveal",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  filter: {
                    name: "Crouching Tiger",
                  },
                  count: {
                    type: "all",
                  },
                },
              },
            },
            {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: { type: "count", what: "revealed-this-way" },
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
                duration: "this-turn",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: { type: "count", what: "revealed-this-way" },
                comparison: { op: "gte", value: 2 },
              },
              then: {
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
            {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: { type: "count", what: "revealed-this-way" },
                comparison: { op: "gte", value: 3 },
              },
              then: {
                type: "draw",
                count: 1,
                player: "controller",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: toothAndClawRed } = toothAndClaw.cards;
