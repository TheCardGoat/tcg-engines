import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/thunderous-retort.generated.ts";
import { arcaneBarrier, goAgain } from "../shared/keywords.ts";

export const thunderousRetort = definePitchFamily(fabPitchFamilies["thunderous-retort"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: pitchMap({
    red: [arcaneBarrier(3)],
    yellow: [arcaneBarrier(2)],
    blue: [arcaneBarrier(1)],
  }),
  abilities: () => ({
    armNextAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    subtypes: ["Attack"],
                  },
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: thunderousRetortRed,
  yellow: thunderousRetortYellow,
  blue: thunderousRetortBlue,
} = thunderousRetort.cards;
