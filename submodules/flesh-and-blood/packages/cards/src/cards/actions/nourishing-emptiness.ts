import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/nourishing-emptiness.generated.ts";

import { dominate } from "../shared/keywords.ts";

export const nourishingEmptiness = definePitchFamily(fabPitchFamilies["nourishing-emptiness"], {
  abilities: () => ({
    thereNoAttackActionGraveyardNourishingEmptinessDominateHitsGains1IntellectEndTurn: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "zone-count",
        zone: "graveyard",
        player: "controller",
        filter: attackActionFilter(),
        comparison: {
          op: "eq",
          value: 0,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: dominate,
            },
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
                id: "hitsGains1IntellectEndTurn",
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
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "modify-numeric",
                    property: "intellect",
                    op: "add",
                    amount: 1,
                    target: {
                      selector: "controller",
                    },
                    duration: "this-turn",
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

export const { red: nourishingEmptinessRed } = nourishingEmptiness.cards;
