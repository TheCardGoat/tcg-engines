import { plusPower, type FabEffect } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/terms-of-combat.generated.ts";
import { goAgain } from "../shared/keywords.ts";

const playedDefenseReactionDraw: FabEffect = {
  type: "grant-property",
  property: {
    kind: "ability",
    ability: {
      kind: "static",
      staticKind: "triggered",
      id: "drawAfterPlayedDefenseReaction",
      text: "",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: { kind: "any" },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: { kind: "any" },
            filter: { typeBox: { types: ["Defense Reaction"] } },
          },
        },
      },
      resolution: { kind: "effect", effect: { type: "draw", count: 1, player: "controller" } },
    },
  },
  duration: "this-turn",
  appliesTo: { next: { typeBox: { types: ["Weapon"] } }, events: ["attack", "activate"] },
};

const activatedDefenseReactionDraw: FabEffect = {
  type: "grant-property",
  property: {
    kind: "ability",
    ability: {
      kind: "static",
      staticKind: "triggered",
      id: "drawAfterActivatedDefenseReaction",
      text: "",
      trigger: {
        kind: "event",
        event: {
          name: "activate",
          abilityType: "defense-reaction",
          actor: { kind: "any" },
          observes: {
            kind: "event-object",
            selector: "activated-card",
            relationship: { kind: "any" },
            filter: { typeBox: { types: ["Defense Reaction"] } },
          },
        },
      },
      resolution: { kind: "effect", effect: { type: "draw", count: 1, player: "controller" } },
    },
  },
  duration: "this-turn",
  appliesTo: { next: { typeBox: { types: ["Weapon"] } }, events: ["attack", "activate"] },
};

export const termsOfCombat = definePitchFamily(fabPitchFamilies["terms-of-combat"], {
  keywords: [goAgain],
  abilities: () => ({
    sequence: {
      type: "sequence",
      steps: [
        plusPower(4, {
          appliesTo: {
            next: { typeBox: { types: ["Weapon"] } },
            events: ["attack", "activate"],
          },
        }),
        playedDefenseReactionDraw,
        activatedDefenseReactionDraw,
      ],
    },
  }),
});

export const { red: termsOfCombatRed } = termsOfCombat.cards;
