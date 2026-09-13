import {
  attackActionFilter,
  draw,
  grantKeyword,
  nextAttackAction,
  nextAttackActionLatch,
  plusPower,
} from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/art-of-war.generated.ts";

export const artOfWar = definePitchFamily(fabPitchFamilies["art-of-war"], {
  abilities: () => ({
    chooseModes: modalAbility({
      kind: "modal",
      modal: {
        choose: 2,
      },
      modes: {
        attackActionControlGain11Turn: {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              plusPower(1, {
                appliesTo: {
                  ...nextAttackActionLatch(),
                  count: { type: "all" },
                },
              }),
              {
                type: "modify-numeric",
                property: "defense",
                op: "add",
                amount: 1,
                duration: "this-turn",
                appliesTo: {
                  ...nextAttackActionLatch(),
                  events: ["play", "attack", "defend"],
                  count: { type: "all" },
                },
              },
            ],
          },
        },
        nextAttackActionPlayTurnGainsGoAgain: {
          kind: "resolution",
          effect: nextAttackAction({
            grant: grantKeyword(goAgain),
          }),
        },
        untilEndTurnMayDefendAttackActionFromArsenal: {
          kind: "resolution",
          effect: {
            type: "rule-modification",
            mode: "allow",
            action: "defend",
            filter: attackActionFilter(),
            subject: {
              playedFromZones: ["arsenal"],
            },
            duration: "this-turn",
          },
        },
        mayBanishAttackActionFromHandIfDoDraw: {
          kind: "resolution",
          effect: {
            type: "optional",
            effect: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: attackActionFilter(),
                count: 1,
              },
            },
            then: draw(2),
          },
        },
      },
    }),
  }),
});

export const { yellow: artOfWarYellow } = artOfWar.cards;
