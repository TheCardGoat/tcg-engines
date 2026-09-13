import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mutual-sacrifice.generated.ts";

const destroyOrDiscardAlly = {
  type: "choice",
  options: [
    {
      type: "destroy",
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: ["permanent"],
        filter: { typeBox: { subtypes: ["Ally"] } },
        count: 1,
      },
    },
    {
      type: "discard",
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: ["hand"],
        filter: { typeBox: { subtypes: ["Ally"] } },
        count: 1,
      },
    },
  ],
} as const;

export const mutualSacrifice = definePitchFamily(fabPitchFamilies["mutual-sacrifice"], {
  abilities: () => ({
    whenHitsHeroMayDestroyOrDiscardAllyTheyLoseTwoLife: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
          target: { kind: "hero" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: destroyOrDiscardAlly,
          then: {
            type: "lose-life",
            amount: 2,
            target: { selector: "attack-target" },
          },
        },
      },
    },
  }),
});

export const {
  red: mutualSacrificeRed,
  yellow: mutualSacrificeYellow,
  blue: mutualSacrificeBlue,
} = mutualSacrifice.cards;
