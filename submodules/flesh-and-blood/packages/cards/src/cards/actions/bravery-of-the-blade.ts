import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bravery-of-the-blade.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const braveryOfTheBlade = definePitchFamily(fabPitchFamilies["bravery-of-the-blade"], {
  abilities: () => ({
    optionalCharge: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: { class: "effect", type: "charge" },
        optional: true,
      },
      label: { name: "charge" },
    },
    chargedGetsGoAgainAndCourageOnHit: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "charge", player: "controller" },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: { kind: "keyword", keyword: goAgain },
            target: { selector: "self" },
            duration: "this-turn",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "createCourageOnHit",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
                    actor: { kind: "player", player: "ability-controller" },
                    observes: { kind: "source", selector: "attack" },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: { type: "create-token", token: "courage", controller: "controller" },
                },
              },
            },
            target: { selector: "self" },
            duration: "this-turn",
          },
        ],
      },
    },
  }),
});

export const { red: braveryOfTheBladeRed } = braveryOfTheBlade.cards;
