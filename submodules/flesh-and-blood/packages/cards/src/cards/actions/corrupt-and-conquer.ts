import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/corrupt-and-conquer.generated.ts";

import { bloodDebt } from "../shared/keywords.ts";

export const corruptAndConquer = definePitchFamily(fabPitchFamilies["corrupt-and-conquer"], {
  keywords: [bloodDebt],
  abilities: () => ({
    mayPlayFromBanishedZone: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    ifWasPlayedFromBanishedZoneGetsDefenseReaction: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "played-this",
        per: "turn",
        onlySource: true,
        filter: { playedFromZones: ["banished"] },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            id: "defenseReactionCanTBePlayedChainLink",
            text: "",
            kind: "resolution",
            effect: {
              type: "rule-modification",
              mode: "restrict",
              action: "play",
              filter: {
                typeBox: { types: ["Defense Reaction"] },
              },
              duration: "this-chain-link",
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
    whenHitsHeroBanishAllTheirArsenal: {
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
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["arsenal"],
            count: {
              type: "all",
            },
          },
        },
      },
    },
  }),
});
export const { red: corruptAndConquerRed } = corruptAndConquer.cards;
