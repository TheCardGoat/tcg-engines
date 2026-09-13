import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/kick-the-hornet-s-nest.generated.ts";

export const kickTheHornetSNest = definePitchFamily(fabPitchFamilies["kick-the-hornet-s-nest"], {
  abilities: () => ({
    opponentsEffectPutsGraveyardAnywhereCreateConfidenceMightToughnessVigorToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "put-into-graveyard",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "create-token",
              token: "confidence",
              controller: "controller",
            },
            {
              type: "create-token",
              token: "might",
              controller: "controller",
            },
            {
              type: "create-token",
              token: "toughness",
              controller: "controller",
            },
            {
              type: "create-token",
              token: "vigor",
              controller: "controller",
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: kickTheHornetSNestYellow } = kickTheHornetSNest.cards;
