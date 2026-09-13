import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/all-in.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const allIn = definePitchFamily(fabPitchFamilies["all-in"], {
  keywords: [goAgain],
  abilities: () => ({
    grantProperty: {
      type: "grant-property",
      property: {
        kind: "ability",
        ability: {
          kind: "static",
          staticKind: "triggered",
          id: "staticTriggeredAttackAttackSequence",
          text: "",
          trigger: {
            kind: "event",
            event: {
              name: "attack",
              actor: { kind: "player", player: "ability-controller" },
              observes: { kind: "source", selector: "attack" },
            },
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "destroy",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["permanent"],
                    filter: { name: "Gold" },
                    count: { type: "all" },
                  },
                },
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: { type: "count", what: "destroyed-this-way", multiplier: 2 },
                  target: { selector: "self" },
                  duration: "this-chain-link",
                },
                {
                  type: "delayed-trigger",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "chain-link-resolve",
                      didHit: false,
                      actor: { kind: "any" },
                      observes: { kind: "source", selector: "attack" },
                    },
                  },
                  policy: { kind: "windowed", duration: "this-chain-link", matching: "first" },
                  resolution: {
                    kind: "effect",
                    effect: { type: "lose-game", player: "controller" },
                  },
                },
              ],
            },
          },
        },
      },
      duration: "this-turn",
      appliesTo: {
        next: { typeBox: { subtypes: ["Sword"] } },
        events: ["attack"],
      },
    },
  }),
});

export const { red: allInRed } = allIn.cards;
