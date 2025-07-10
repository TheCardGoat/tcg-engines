/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  littleSisterResponsibleRabbit,
  roquefortLockExpert,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import exp from "constants";

describe("Little Sister - Responsible Rabbit", () => {
  it("LET ME HELP When you play this character, you may remove up to 1 damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: littleSisterResponsibleRabbit.cost + roquefortLockExpert.cost,
      hand: [littleSisterResponsibleRabbit],
      play: [roquefortLockExpert],
    });

    const littleSisterCard = testEngine.getCardModel(
      littleSisterResponsibleRabbit,
    );
    const roquefortCard = testEngine.getCardModel(roquefortLockExpert);

    roquefortCard.meta.damage = 1;
    expect(roquefortCard.meta.damage).toBe(1);

    await testEngine.playCard(littleSisterResponsibleRabbit);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [roquefortCard] });
  });
});
