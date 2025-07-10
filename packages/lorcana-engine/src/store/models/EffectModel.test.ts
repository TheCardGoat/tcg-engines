/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { EffectModel, type ResolvingParam } from "@lorcanito/lorcana-engine";
import { targetCard } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  drFacilierSavvyOpportunist,
  madamMimRivalOfMerlin,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import type { CreateLayerBasedOnTarget } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

const effect: CreateLayerBasedOnTarget = {
  type: "create-layer-based-on-target",
  target: targetCard,
  effects: [
    {
      type: "ability",
      ability: "custom",
      modifier: "add",
      duration: "turn",
      customAbility: {
        type: "static-triggered",
        trigger: {
          on: "end_turn",
          target: { type: "player", value: "self" },
        },
        layer: {
          type: "resolution",
          effects: [
            {
              type: "banish",
              target: {
                type: "card",
                value: "all",
                filters: [{ filter: "source", value: "trigger" }],
              },
            },
          ],
        },
      },
      target: targetCard,
    },
    {
      type: "ability",
      ability: "rush",
      modifier: "add",
      duration: "turn",
      target: targetCard,
    },
  ],
};

describe("Effect Model", () => {
  it('Target ({ filter: "source", value: "target" } Effects should target only the target card', async () => {
    const testEngine = new TestEngine(
      {
        hand: [drFacilierSavvyOpportunist],
        play: [madamMimRivalOfMerlin],
        deck: 1,
      },
      {
        deck: 2,
      },
    );

    const madamMimModel = testEngine.getCardModel(madamMimRivalOfMerlin);
    const target = testEngine.getCardModel(drFacilierSavvyOpportunist);
    const params: ResolvingParam = {
      targets: [target],
    };
    const model = new EffectModel(
      effect,
      madamMimModel,
      madamMimModel.ownerId,
      testEngine.store,
      true,
    );

    const cardModels = model.resolveCardTargets(targetCard, params);

    expect(cardModels).toHaveLength(1);
  });

  it('Target ({ filter: "source", value: "target" } Effects, with no targets, should fallback to empty', async () => {
    const testEngine = new TestEngine(
      {
        hand: [drFacilierSavvyOpportunist],
        play: [madamMimRivalOfMerlin],
        deck: 1,
      },
      {
        deck: 2,
      },
    );

    const madamMimModel = testEngine.getCardModel(madamMimRivalOfMerlin);
    const params: ResolvingParam = {};
    const model = new EffectModel(
      effect,
      madamMimModel,
      madamMimModel.ownerId,
      testEngine.store,
      true,
    );

    const cardModels = model.resolveCardTargets(targetCard, params);

    expect(cardModels).toHaveLength(0);
  });
});
