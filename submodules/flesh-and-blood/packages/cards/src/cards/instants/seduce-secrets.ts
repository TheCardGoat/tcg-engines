import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/seduce-secrets.generated.ts";

export const seduceSecrets = definePitchFamily(fabPitchFamilies["seduce-secrets"], {
  abilities: () => ({
    lookAtTargetHeroSHandTopTheirDeck: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              playerTarget: { selector: "any-hero" },
              playerTargetBinding: "looked-hero",
              zones: ["hand"],
              count: {
                type: "all",
              },
            },
          },
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              playerTargetBinding: "looked-hero",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
          },
        ],
      },
    },
    ifWasPlayedFromArsenalDraw: {
      kind: "resolution",
      condition: {
        type: "played-this",
        per: "turn",
        onlySource: true,
        filter: { playedFromZones: ["arsenal"] },
      },
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});

export const { yellow: seduceSecretsYellow } = seduceSecrets.cards;
