import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/enflame-the-firebrand.generated.ts";

import { goAgain } from "../shared/keywords.ts";

/** Model notes (hand-authored): go again is only the 2+ Draconic-link branch, not a static keyword. */
export const enflameTheFirebrand = definePitchFamily(fabPitchFamilies["enflame-the-firebrand"], {
  keywords: [],
  abilities: () => ({
    whenAttacksIfControl2MoreDraconicChainLinks: {
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
          type: "sequence",
          steps: [
            {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: {
                  type: "count",
                  what: "chain-links",
                  player: "controller",
                  filter: { typeBox: { supertypes: ["Draconic"] } },
                },
                comparison: { op: "gte", value: 2 },
              },
              then: {
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
            },
            {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: {
                  type: "count",
                  what: "chain-links",
                  player: "controller",
                  filter: { typeBox: { supertypes: ["Draconic"] } },
                },
                comparison: { op: "gte", value: 3 },
              },
              then: {
                type: "grant-property",
                property: {
                  kind: "supertype",
                  value: "Draconic",
                },
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["combat-chain"],
                  filter: {
                    typeBox: {
                      subtypes: ["Attack"],
                    },
                  },
                  count: {
                    type: "all",
                  },
                },
                duration: "this-combat-chain",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: {
                  type: "count",
                  what: "chain-links",
                  player: "controller",
                  filter: { typeBox: { supertypes: ["Draconic"] } },
                },
                comparison: { op: "gte", value: 4 },
              },
              then: {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 2,
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  }),
});
export const { red: enflameTheFirebrandRed } = enflameTheFirebrand.cards;
