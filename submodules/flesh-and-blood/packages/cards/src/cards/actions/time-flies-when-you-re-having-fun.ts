import { attackActionFilter, nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/time-flies-when-you-re-having-fun.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const timeFliesWhenYouReHavingFun = definePitchFamily(
  fabPitchFamilies["time-flies-when-you-re-having-fun"],
  {
    keywords: [goAgain],
    abilities: () => ({
      nextTimeAttackActionHitsHeroTurnDestroyAuraTheyControl: {
        kind: "resolution",
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "event-object",
                selector: "attack",
                relationship: {
                  kind: "any",
                },
                filter: attackActionFilter(),
              },
              target: {
                kind: "hero",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "optional",
              effect: {
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["permanent"],
                  filter: {
                    typeBox: {
                      subtypes: ["Aura"],
                    },
                  },
                  count: 1,
                },
              },
            },
          },
        },
      },
      wasPlayedFromArsenalNextAttackActionPlayTurnGetsNumber3Power: {
        kind: "resolution",
        condition: {
          type: "played-this",
          per: "turn",
          onlySource: true,
          filter: { playedFromZones: ["arsenal"] },
        },
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 3,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: nextAttackActionLatch(),
        },
      },
    }),
  },
);

export const { red: timeFliesWhenYouReHavingFunRed } = timeFliesWhenYouReHavingFun.cards;
