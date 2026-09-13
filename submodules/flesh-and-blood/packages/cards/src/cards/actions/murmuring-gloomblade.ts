import { createToken, onHit } from "@tcg/flesh-and-blood-types";
import { bloodDebt, usurp } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/murmuring-gloomblade.generated.ts";

export const murmuringGloomblade = definePitchFamily(fabPitchFamilies["murmuring-gloomblade"], {
  keywords: [usurp, bloodDebt],
  abilities: () => ({
    banishedPermission: {
      kind: "static",
      staticKind: "play",
      playEffect: { role: "permission", fromZones: ["banished"] },
    },
    onAttackCreateRunechant: {
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
        effect: createToken("runechant"),
      },
    },
    onHitCreateRunechant: onHit(createToken("runechant")),
  }),
});

export const {
  red: murmuringGloombladeRed,
  yellow: murmuringGloombladeYellow,
  blue: murmuringGloombladeBlue,
} = murmuringGloomblade.cards;
