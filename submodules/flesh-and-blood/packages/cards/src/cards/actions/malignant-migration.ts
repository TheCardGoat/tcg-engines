import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/malignant-migration.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const malignantMigration = definePitchFamily(fabPitchFamilies["malignant-migration"], {
  keywords: [goAgain],
  abilities: () => ({
    whenAttacksMayDiscardZombiePutBanishedIntoGraveyard: {
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
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["banished"],
              count: 1,
            },
            to: { zone: "graveyard" },
          },
        },
      },
    },
  }),
});

export const {
  red: malignantMigrationRed,
  yellow: malignantMigrationYellow,
  blue: malignantMigrationBlue,
} = malignantMigration.cards;
