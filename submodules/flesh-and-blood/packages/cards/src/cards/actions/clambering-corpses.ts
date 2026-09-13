import { grantKeyword, plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/clambering-corpses.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const clamberingCorpses = definePitchFamily(fabPitchFamilies["clambering-corpses"], {
  abilities: () => ({
    whenAttacksMayDiscardZombiePlusThreeAndGoAgain: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: { typeBox: { subtypes: ["Zombie"] } },
              count: 1,
            },
          },
          then: {
            type: "sequence",
            steps: [plusPower(3), grantKeyword(goAgain)],
          },
        },
      },
    },
    whenHitsHeroZombieAttacksGetGoAgain: {
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
        effect: grantKeyword(goAgain, {
          appliesTo: {
            next: { typeBox: { subtypes: ["Zombie"] } },
            events: ["attack"],
            count: { type: "all" },
          },
        }),
      },
    },
  }),
});

export const { blue: clamberingCorpsesBlue } = clamberingCorpses.cards;
