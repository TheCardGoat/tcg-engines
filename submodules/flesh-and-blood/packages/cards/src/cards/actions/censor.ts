import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/censor.generated.ts";

export const censor = definePitchFamily(fabPitchFamilies["censor"], {
  abilities: () => ({
    whenHitsHeroNameTheyCanTPlayNamed: {
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
          type: "sequence",
          steps: [
            {
              type: "name-card",
              suggestions: ["visible-cards"],
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "play",
              filter: {
                name: "chosen",
              },
              duration: "until-end-of-next-turn",
            },
          ],
        },
      },
    },
  }),
});
export const { red: censorRed } = censor.cards;
