import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stoke-vengeance.generated.ts";
import { comboResolution } from "@tcg/flesh-and-blood-types";
import { goAgain, combo } from "../shared/keywords.ts";

export const stokeVengeance = definePitchFamily(fabPitchFamilies["stoke-vengeance"], {
  keywords: [combo],
  abilities: () => ({
    combo: comboResolution({
      names: ["Edge of Autumn"],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: { kind: "keyword", keyword: goAgain },
            target: { selector: "self" },
            duration: "this-combat-chain",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                id: "vengeance",
                text: "",
                kind: "static",
                staticKind: "triggered",
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
                  effect: {
                    type: "modify-numeric",
                    property: "power",
                    op: "add",
                    amount: 2,
                    duration: "this-combat-chain",
                    target: { selector: "this-attack" },
                    appliesTo: { next: { typeBox: { subtypes: ["Attack"] } }, events: ["attack"] },
                  },
                },
              },
            },
            target: { selector: "self" },
            duration: "this-combat-chain",
          },
        ],
      },
    }),
  }),
});
export const { red: stokeVengeanceRed } = stokeVengeance.cards;
