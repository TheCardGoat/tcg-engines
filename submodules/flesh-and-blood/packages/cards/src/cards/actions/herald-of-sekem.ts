import { phantasm } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/herald-of-sekem.generated.ts";

export const heraldOfSekem = definePitchFamily(fabPitchFamilies["herald-of-sekem"], {
  keywords: [phantasm],
  abilities: () => ({
    attacksPutYellowHandSoulDeal2ArcaneDamageAnyTarget: {
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
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                color: ["yellow"],
              },
              count: 1,
            },
            to: {
              zone: "soul",
            },
          },
          then: {
            type: "deal-damage",
            damageType: "arcane",
            amount: 2,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["hero", "permanent"],
              count: 1,
            },
          },
        },
      },
    },
  }),
});

export const { red: heraldOfSekemRed } = heraldOfSekem.cards;
