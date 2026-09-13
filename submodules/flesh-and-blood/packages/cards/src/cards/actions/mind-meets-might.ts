import { mirage } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mind-meets-might.generated.ts";

export const mindMeetsMight = definePitchFamily(fabPitchFamilies["mind-meets-might"], {
  keywords: [mirage],
  abilities: () => ({
    hitsRevealHandDiscardAll6MorePowerThenDrawMany: {
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
              type: "sequence",
              steps: [
                {
                  type: "reveal",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "attack-target",
                    zones: ["hand"],
                    count: {
                      type: "all",
                    },
                  },
                },
                {
                  type: "discard",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "attack-target",
                    zones: ["hand"],
                    filter: {
                      power: {
                        op: "gte",
                        value: 6,
                      },
                    },
                    count: {
                      type: "all",
                    },
                  },
                  outputBinding: "it",
                },
              ],
            },
            {
              type: "draw",
              count: {
                type: "count",
                what: "discarded-this-way",
              },
              player: "attack-target",
            },
          ],
        },
      },
    },
  }),
});

export const { red: mindMeetsMightRed } = mindMeetsMight.cards;
