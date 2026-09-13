import { goAgain, legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/imperial-edict.generated.ts";

export const imperialEdict = definePitchFamily(fabPitchFamilies["imperial-edict"], {
  keywords: [legendary],
  abilities: () => ({
    actionDestroyImperialEdictNameNamedCantPlayedStartNextTurnRoyalInsteadOpponentRevealsHandThenNameGoAgain:
      {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        layerKeywords: [goAgain],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "conditional",
              condition: {
                type: "has-status",
                status: "hero-is-royal",
              },
              then: {
                type: "reveal",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "each-other-hero",
                  zones: ["hand"],
                  count: {
                    type: "all",
                  },
                },
              },
            },
            {
              type: "name-card",
              suggestions: ["revealed-this-resolution"],
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "play",
              filter: {
                name: "chosen",
              },
              duration: "until-start-of-own-next-turn",
            },
          ],
        },
      },
  }),
});

export const { red: imperialEdictRed } = imperialEdict.cards;
