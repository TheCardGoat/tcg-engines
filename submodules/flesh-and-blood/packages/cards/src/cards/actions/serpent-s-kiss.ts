import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/serpent-s-kiss.generated.ts";
import { stealth } from "../shared/keywords.ts";

export const serpentSKiss = definePitchFamily(fabPitchFamilies["serpent-s-kiss"], {
  keywords: [stealth],
  abilities: () => ({
    whenAttacksCreateFangStrikeSlitherInHandVeTranscendedTurnInstead: {
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
        effect: {
          type: "conditional",
          condition: {
            type: "performed-this-turn",
            event: "transcend",
            player: "controller",
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "create-token",
                token: "fang-strike",
                controller: "controller",
                to: { zone: "hand" },
              },
              {
                type: "create-token",
                token: "slither",
                controller: "controller",
                to: { zone: "hand" },
              },
            ],
          },
          else: {
            type: "choice",
            options: [
              {
                type: "create-token",
                token: "fang-strike",
                controller: "controller",
                to: { zone: "hand" },
              },
              {
                type: "create-token",
                token: "slither",
                controller: "controller",
                to: { zone: "hand" },
              },
            ],
          },
        },
      },
    },
    whenHitsHeroLookAtTopNumber2TheirDeckBanishNumber1Them: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "look",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["deck"],
                position: "top",
                count: 2,
              },
            },
            {
              type: "banish",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: serpentSKissBlue } = serpentSKiss.cards;
