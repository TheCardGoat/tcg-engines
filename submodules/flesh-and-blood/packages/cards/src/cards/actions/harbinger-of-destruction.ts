import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/harbinger-of-destruction.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const harbingerOfDestruction = definePitchFamily(
  fabPitchFamilies["harbinger-of-destruction"],
  {
    keywords: [bloodDebt],
    abilities: () => ({
      cost: {
        kind: "static",
        staticKind: "play",
        playEffect: {
          role: "additional-cost",
          cost: { class: "effect", type: "banish", from: "hand", count: 1 },
        },
      },
      rider: {
        kind: "resolution",
        condition: {
          type: "compare-amount",
          amount: {
            type: "count",
            what: "banished-this-way",
            filter: { typeBox: { supertypes: ["Shadow"] } },
          },
          comparison: { op: "gte", value: 1 },
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "createGatesOnHit",
              text: "",
              trigger: {
                kind: "event",
                event: {
                  name: "hit",
                  actor: { kind: "player", player: "ability-controller" },
                  observes: { kind: "source", selector: "attack" },
                  target: { kind: "hero" },
                },
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "create-token",
                  token: "gate-to-i-arathael",
                  controller: "controller",
                  count: 2,
                },
              },
            },
          },
          target: { selector: "self" },
          duration: "permanent",
        },
      },
    }),
  },
);

export const { red: harbingerOfDestructionRed } = harbingerOfDestruction.cards;
