import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/song-of-sinew.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const songOfSinew = definePitchFamily(fabPitchFamilies["song-of-sinew"], {
  keywords: [goAgain],
  abilities: () => ({
    revealTopNumber4DeckNextAttackTurnGetsXPowerWhereX: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 4,
            },
            outputBinding: "them",
          },
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: {
              type: "count",
              what: "cards-revealed-this-way",
              filter: {
                power: {
                  op: "gte",
                  value: 6,
                },
              },
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                or: [{ typeBox: { subtypes: ["Attack"] } }, { typeBox: { types: ["Weapon"] } }],
              },
            },
          },
          {
            type: "reorder-deck",
            target: {
              selector: "binding",
              binding: "them",
            },
            position: "top",
          },
        ],
      },
    },
  }),
});

export const { yellow: songOfSinewYellow } = songOfSinew.cards;
