import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/bonded-burial.generated.ts";

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

export const bondedBurial = definePitchFamily(fabPitchFamilies["bonded-burial"], {
  abilities: () => ({
    whenHitsHeroMayDestroyOrDiscardAllyTheyDiscard: {
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
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attack-target",
              zones: ["hand"],
              count: 1,
              chooser: "attack-target",
            },
          },
        },
      },
    },
  }),
});

export const {
  red: bondedBurialRed,
  yellow: bondedBurialYellow,
  blue: bondedBurialBlue,
} = bondedBurial.cards;
