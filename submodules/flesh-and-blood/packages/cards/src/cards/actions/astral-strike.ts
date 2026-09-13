import { semanticTriggeredModalResolution } from "../../authoring/card.ts";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/astral-strike.generated.ts";

export const astralStrike = definePitchFamily(fabPitchFamilies["astral-strike"], {
  keywords: [goAgain],
  abilities: () => ({
    whenAttacksIfVeDestroyedLightningFlowTurnChoose: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "performed-this-turn",
          event: "destroy-lightning-flow",
          player: "controller",
        },
      },
      resolution: semanticTriggeredModalResolution({
        kind: "modal",
        choose: 1,
        modes: {
          draw: {
            kind: "resolution",
            effect: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
          gets2: {
            kind: "resolution",
            effect: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 2,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
          getsGoAgain: {
            kind: "resolution",
            effect: {
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
        },
      }),
    },
  }),
});
export const { red: astralStrikeRed } = astralStrike.cards;
