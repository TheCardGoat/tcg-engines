import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/acrid-stench.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const acridStench = definePitchFamily(fabPitchFamilies["acrid-stench"], {
  keywords: [goAgain],
  abilities: () => ({
    whenAttacksMayDiscardZombieCreateCorruptedCorpse: {
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
          then: {
            type: "create-card",
            name: "Corrupted Corpse",
            to: { zone: "banished" },
            controller: "controller",
          },
        },
      },
    },
  }),
});

export const {
  red: acridStenchRed,
  yellow: acridStenchYellow,
  blue: acridStenchBlue,
} = acridStench.cards;
