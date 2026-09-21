import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ancient-earth-oak.generated.ts";

export const ancientEarthOak = definePitchFamily(fabPitchFamilies["ancient-earth-oak"], {
  abilities: () => ({
    frostbite: {
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
        effect: {
          type: "create-token",
          token: "frostbite",
          creator: "effect-controller",
          controller: "attack-target",
        },
      },
    },
    earthBond: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "pitch-zone-has", filter: { typeBox: { supertypes: ["Earth"] } } },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: { selector: "self" },
            duration: "while-condition",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "returnToDeckOnHit",
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
                    type: "move-card",
                    target: { selector: "self" },
                    to: { zone: "deck", position: "bottom" },
                  },
                },
              },
            },
            target: { selector: "self" },
            duration: "while-condition",
          },
        ],
      },
      label: { name: "earth-bond" },
    },
  }),
});

export const { red: ancientEarthOakRed } = ancientEarthOak.cards;
