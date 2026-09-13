import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ten-foot-tall-and-bulletproof.generated.ts";

export const tenFootTallAndBulletproof = definePitchFamily(
  fabPitchFamilies["ten-foot-tall-and-bulletproof"],
  {
    abilities: () => ({
      whenAttacksDefendsHeroGetsNumber2IntellectDuringNextEndPhase: {
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
            type: "modify-numeric",
            property: "intellect",
            op: "subtract",
            amount: 2,
            target: {
              selector: "controller",
            },
            duration: "during-own-next-end-phase",
          },
        },
      },
      whenAttacksDefendsHeroGetsNumber2IntellectDuringNextEndPhaseWhenAttacksDefendsHeroGetsNumber2IntellectDuringNextEndPhase:
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "defend",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "defender",
              },
            },
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "modify-numeric",
              property: "intellect",
              op: "subtract",
              amount: 2,
              target: {
                selector: "controller",
              },
              duration: "during-own-next-end-phase",
            },
          },
        },
    }),
  },
);

export const { red: tenFootTallAndBulletproofRed } = tenFootTallAndBulletproof.cards;
