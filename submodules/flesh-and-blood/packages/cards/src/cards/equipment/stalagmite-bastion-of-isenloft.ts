import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/stalagmite-bastion-of-isenloft.generated.ts";

export const stalagmiteBastionOfIsenloft = defineCard(
  fabCardIdentitiesByCanonicalId["BCpDT6GfzNwKW8qz7WbrN"],
  {
    keywords: [temper],
    abilities: {
      wheneverDefendStalagmiteCreateFrostbiteTokenUnderAttackingHero: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "create-token",
                token: "frostbite",
                controller: "opponent",
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: temper,
                },
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
            ],
          },
        },
      },
    },
  },
);
