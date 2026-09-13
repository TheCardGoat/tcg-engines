import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/command-and-conquer.generated.ts";

export const commandAndConquer = definePitchFamily(fabPitchFamilies["command-and-conquer"], {
  abilities: () => ({
    defenseReactionCanTBePlayedChainLink: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "play",
        filter: {
          typeBox: {
            types: ["Defense Reaction"],
          },
        },
        duration: "this-chain-link",
      },
    },
    whenHitsHeroDestroyAllTheirArsenal: {
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
          type: "destroy",
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
export const { red: commandAndConquerRed } = commandAndConquer.cards;
