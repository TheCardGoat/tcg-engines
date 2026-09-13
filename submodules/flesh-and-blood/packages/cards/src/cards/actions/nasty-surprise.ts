import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/nasty-surprise.generated.ts";

export const nastySurprise = definePitchFamily(fabPitchFamilies["nasty-surprise"], {
  abilities: () => ({
    opponentsEffectPutsGraveyardAnywhereCreateAgilityMightVigorToken: {
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
              token: "agility",
              controller: "controller",
            },
            {
              type: "create-token",
              token: "might",
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

export const { blue: nastySurpriseBlue } = nastySurprise.cards;
