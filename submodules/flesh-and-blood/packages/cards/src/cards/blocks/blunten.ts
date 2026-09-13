import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/blunten.generated.ts";

export const blunten = definePitchFamily(fabPitchFamilies["blunten"], {
  abilities: () => ({
    discardOnWeaponDefense: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
          defendedAttack: {
            typeBox: { types: ["Weapon"] },
          },
          target: {
            kind: "any",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attacking-hero",
            chooser: "attacking-hero",
            zones: ["hand"],
            count: 1,
          },
        },
      },
    },
  }),
});

export const { yellow: bluntenYellow } = blunten.cards;
