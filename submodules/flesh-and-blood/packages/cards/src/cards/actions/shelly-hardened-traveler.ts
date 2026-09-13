import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shelly-hardened-traveler.generated.ts";
import { wateryGrave } from "../shared/keywords.ts";

export const shellyHardenedTraveler = definePitchFamily(
  fabPitchFamilies["shelly-hardened-traveler"],
  {
    keywords: [wateryGrave],
    abilities: () => ({
      actionResourceResourceResourceTAttack: {
        kind: "activated",
        abilityType: "attack",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 3,
            },
            {
              class: "effect",
              type: "tap-self",
            },
          ],
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      instantTNextAttackActionDefendWithTurnGetsNumber1Defense: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "tap-self",
        },
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: nextAttackActionLatch({ defending: true }),
        },
      },
    }),
  },
);

export const { yellow: shellyHardenedTravelerYellow } = shellyHardenedTraveler.cards;
