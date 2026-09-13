import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sound-the-alarm.generated.ts";

export const soundTheAlarm = definePitchFamily(fabPitchFamilies["sound-the-alarm"], {
  abilities: () => ({
    whenAttacksHeroTheyRevealTheirHandAttackReactionRevealedWaySearch: {
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
              type: "reveal",
              outputBinding: "revealed",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["hand"],
                count: {
                  type: "all",
                },
              },
            },
            {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: {
                  type: "count",
                  what: "revealed-this-way",
                  filter: { typeBox: { types: ["Attack Reaction"] } },
                },
                comparison: { op: "gte", value: 1 },
              },
              then: {
                type: "optional",
                effect: {
                  type: "sequence",
                  steps: [
                    {
                      type: "shuffle",
                      zone: "deck",
                    },
                    {
                      type: "search",
                      zones: ["deck"],
                      filter: {
                        typeBox: {
                          types: ["Defense Reaction"],
                        },
                      },
                      mayFail: true,
                      to: {
                        zone: "deck",
                        position: "top",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: soundTheAlarmRed } = soundTheAlarm.cards;
