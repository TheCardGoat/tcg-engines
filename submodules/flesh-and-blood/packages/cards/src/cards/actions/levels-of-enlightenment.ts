import { semanticTriggeredModalResolution } from "../../authoring/card.ts";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/levels-of-enlightenment.generated.ts";

export const levelsOfEnlightenment = definePitchFamily(
  fabPitchFamilies["levels-of-enlightenment"],
  {
    abilities: () => ({
      attacksChoose1BluePitchedTurnDrawGets2PowerGetsGoAgain: {
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
            what: "cards-pitched-this-turn",
            filter: {
              color: ["blue"],
            },
          },
          modes: {
            draw: {
              kind: "resolution",
              effect: {
                type: "draw",
                count: 1,
                player: "controller",
              },
            },
            gets2Power: {
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
  },
);

export const { blue: levelsOfEnlightenmentBlue } = levelsOfEnlightenment.cards;
