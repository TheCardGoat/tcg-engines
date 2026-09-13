import { dominate } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/murky-water.generated.ts";

export const murkyWater = definePitchFamily(fabPitchFamilies["murky-water"], {
  keywords: [
    {
      name: "specialization",
      hero: "Riptide",
    },
    dominate,
  ],
  abilities: () => ({
    aimCounterGets1PowerDominate: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-counter",
        counter: {
          kind: "named",
          name: "aim",
        },
        target: {
          selector: "self",
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
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
        ],
      },
    },
    hitsBanish3TrapsCost0MoreGraveyardFaceDownChooseOneRandomPutArsenal: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  subtypes: ["Trap"],
                },
                cost: {
                  op: "gte",
                  value: 0,
                },
              },
              count: 3,
            },
            faceDown: true,
            outputBinding: "banished-this-way",
          },
          then: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["banished"],
              count: 1,
              random: true,
              filter: {
                inObjectBinding: "banished-this-way",
              },
            },
            to: {
              zone: "arsenal",
            },
          },
        },
      },
    },
  }),
});

export const { red: murkyWaterRed } = murkyWater.cards;
