import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadowrealm-harrower.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const shadowrealmHarrower = definePitchFamily(fabPitchFamilies["shadowrealm-harrower"], {
  keywords: [bloodDebt],
  abilities: () => ({
    playFromBanishedZone: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    wasPlayedFromBanishedZoneGetsNumber1PowerWhenHitsHeroGain: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "played-this",
        per: "turn",
        onlySource: true,
        filter: { playedFromZones: ["banished"] },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenHitsHeroGainLifeEqualDamageDealtWay",
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
                    type: "gain-life",
                    amount: {
                      type: "count",
                      what: "damage-dealt",
                      per: "chain-link",
                    },
                    target: {
                      selector: "controller",
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
        ],
      },
    },
  }),
});

export const { blue: shadowrealmHarrowerBlue } = shadowrealmHarrower.cards;
