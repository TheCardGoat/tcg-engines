import { grantKeyword } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ice-aged-oak.generated.ts";
import { dominate } from "../shared/keywords.ts";

export const iceAgedOak = definePitchFamily(fabPitchFamilies["ice-aged-oak"], {
  abilities: () => ({
    embodiment: {
      kind: "static",
      staticKind: "triggered",
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
        effect: { type: "create-token", token: "embodiment-of-earth", controller: "controller" },
      },
    },
    iceBond: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-ice-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "sequence",
        steps: [
          grantKeyword(dominate, { target: { selector: "self" } }),
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "createFrostbitesInExposedZonesOnHit",
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
                    type: "repeat",
                    times: 4,
                    effect: {
                      type: "create-token",
                      token: "frostbite",
                      controller: "attack-target",
                      amongExposed: [
                        "equipment-head",
                        "equipment-chest",
                        "equipment-arms",
                        "equipment-legs",
                      ],
                    },
                  },
                },
              },
            },
            target: { selector: "self" },
            duration: "this-turn",
          },
        ],
      },
      label: { name: "ice-bond" },
    },
  }),
});

export const { blue: iceAgedOakBlue } = iceAgedOak.cards;
