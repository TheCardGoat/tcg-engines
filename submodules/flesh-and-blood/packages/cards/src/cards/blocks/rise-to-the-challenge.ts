import { plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/rise-to-the-challenge.generated.ts";

export const riseToTheChallenge = definePitchFamily(fabPitchFamilies["rise-to-the-challenge"], {
  abilities: () => ({
    whenDefendsRevealTopPlusDefenseIfSixBasePowerElseBottom: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  numeric: [
                    { property: "power", basis: "base", comparison: { op: "gte", value: 6 } },
                  ],
                },
              },
              then: {
                type: "modify-numeric",
                property: "defense",
                op: "add",
                amount: 2,
                target: { selector: "self" },
                duration: "this-chain-link",
              },
              else: {
                type: "move-card",
                target: { selector: "binding", binding: "it" },
                to: { zone: "deck", position: "bottom" },
              },
            },
          ],
        },
      },
    },
    instantDiscardThisNextAttackPlusTwo: {
      kind: "activated",
      abilityType: "instant",
      functionalZones: ["hand"],
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: plusPower(2, { appliesTo: { next: { typeBox: { subtypes: ["Attack"] } } } }),
    },
  }),
});

export const {
  red: riseToTheChallengeRed,
  yellow: riseToTheChallengeYellow,
  blue: riseToTheChallengeBlue,
} = riseToTheChallenge.cards;
