import { semanticTriggeredModalResolution } from "../../authoring/card.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/battlefield-beacon.generated.ts";

export const battlefieldBeacon = definePitchFamily(fabPitchFamilies["battlefield-beacon"], {
  abilities: () => ({
    whenAttacksChoose1EachVeBanishedFromSoul: {
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
      resolution: semanticTriggeredModalResolution({
        kind: "modal",
        choose: {
          type: "count",
          what: "cards-banished-from-soul-this-combat-chain",
        },
        allowRepeat: true,
        modes: {
          createCourageToken: {
            kind: "resolution",
            effect: {
              type: "create-token",
              token: "courage",
              controller: "controller",
            },
          },
          createToughnessToken: {
            kind: "resolution",
            effect: {
              type: "create-token",
              token: "toughness",
              controller: "controller",
            },
          },
          createVigorToken: {
            kind: "resolution",
            effect: {
              type: "create-token",
              token: "vigor",
              controller: "controller",
            },
          },
        },
      }),
    },
  }),
});
export const { yellow: battlefieldBeaconYellow } = battlefieldBeacon.cards;
