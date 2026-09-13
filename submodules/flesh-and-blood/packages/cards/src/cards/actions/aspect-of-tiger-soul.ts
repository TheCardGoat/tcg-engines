import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aspect-of-tiger-soul.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { combo, goAgain } from "../shared/keywords.ts";

export const aspectOfTigerSoul = definePitchFamily(fabPitchFamilies["aspect-of-tiger-soul"], {
  keywords: [goAgain, combo],
  abilities: () => ({
    whenAttacksIfYellowAttackActionWasLastAttack: {
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
          type: "last-attack-this-combat-chain",
          color: "Yellow",
          filter: attackActionFilter(),
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "sequence",
              steps: [
                {
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
                {
                  type: "create-token",
                  token: "crouching-tiger",
                  controller: "controller",
                  to: {
                    zone: "banished",
                  },
                  outputBinding: "it",
                },
              ],
            },
            {
              type: "optional",
              effect: {
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            },
          ],
        },
      },
      label: {
        name: "combo",
        params: {
          names: ["Yellow attack action card"],
        },
      },
    },
  }),
});
export const { yellow: aspectOfTigerSoulYellow } = aspectOfTigerSoul.cards;
