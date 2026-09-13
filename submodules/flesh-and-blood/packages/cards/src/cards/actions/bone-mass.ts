import { plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bone-mass.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const boneMass = definePitchFamily(fabPitchFamilies["bone-mass"], {
  keywords: [goAgain],
  abilities: () => ({
    whenAttacksMayDiscardZombieNextAttackPlusOne: {
      kind: "static",
      staticKind: "triggered",
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
          type: "optional",
          effect: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: { typeBox: { subtypes: ["Zombie"] } },
              count: 1,
            },
          },
          then: plusPower(1, { appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } } }),
        },
      },
    },
  }),
});

export const { red: boneMassRed, yellow: boneMassYellow, blue: boneMassBlue } = boneMass.cards;
