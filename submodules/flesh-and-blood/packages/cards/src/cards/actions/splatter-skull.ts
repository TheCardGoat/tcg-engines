import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/splatter-skull.generated.ts";

export const splatterSkull = definePitchFamily(fabPitchFamilies["splatter-skull"], {
  abilities: () => ({
    whenHitsHeroChooseFaceDownInTheirBanishedZoneWasBanished: {
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
          type: "move-card",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "opponent",
            zones: ["banished"],
            filter: {
              and: [
                {
                  hasStatus: "face-down",
                },
                {
                  banishedByIntimidateThisTurn: true,
                },
              ],
            },
            count: 1,
          },
          to: {
            zone: "graveyard",
          },
        },
      },
    },
  }),
});

export const { red: splatterSkullRed } = splatterSkull.cards;
