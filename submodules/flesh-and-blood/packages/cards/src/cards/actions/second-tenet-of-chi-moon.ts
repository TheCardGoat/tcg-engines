import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/second-tenet-of-chi-moon.generated.ts";

export const secondTenetOfChiMoon = definePitchFamily(
  fabPitchFamilies["second-tenet-of-chi-moon"],
  {
    abilities: () => ({
      veTranscendedTurnGetsWhenChainLinkResolvesDraw: {
        kind: "static",
        staticKind: "continuous",
        condition: { type: "performed-this-turn", event: "transcend", player: "controller" },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "whenChainLinkResolvesDraw",
              text: "",
              trigger: {
                kind: "event",
                event: {
                  name: "chain-link-resolve",
                  actor: {
                    kind: "any",
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
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
              },
            },
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    }),
  },
);

export const { blue: secondTenetOfChiMoonBlue } = secondTenetOfChiMoon.cards;
