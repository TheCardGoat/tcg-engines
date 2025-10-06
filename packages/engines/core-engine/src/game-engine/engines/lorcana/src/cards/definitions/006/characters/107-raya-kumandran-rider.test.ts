/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  belleStrangeButBeautiful,
  goonsMaleficent,
  mauiDemiGod,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  mauiHalfshark,
  rayaKumandranRider,
  yokaiProfessorCallaghan,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Raya - Kumandran Rider", () => {
  it("can't ready itself", async () => {
    const testEngine = new TestEngine({
      play: [rayaKumandranRider, mauiHalfshark, mauiDemiGod],
      hand: [goonsMaleficent, yokaiProfessorCallaghan],
    });

    await testEngine.tapCard(mauiHalfshark); // Card to untap
    await testEngine.tapCard(rayaKumandranRider); // Card that should not be untapped

    await testEngine.putIntoInkwell(goonsMaleficent);

    expect(testEngine.stackLayers).toHaveLength(1);
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [rayaKumandranRider] }, true);
    expect(testEngine.getCardModel(rayaKumandranRider).meta.exerted).toBe(true);
    expect(testEngine.stackLayers).toHaveLength(1);
  });

  it("Doesn't trigger on opponent's turn", async () => {
    const testEngine = new TestEngine(
      {
        play: [mauiDemiGod],
        hand: [goonsMaleficent],
      },
      {
        play: [rayaKumandranRider, mauiHalfshark],
      },
    );

    await testEngine.tapCard(mauiHalfshark);
    await testEngine.tapCard(mauiDemiGod);

    await testEngine.putIntoInkwell(goonsMaleficent);

    expect(testEngine.stackLayers).toHaveLength(0);
  });

  it("COME ON, LET'S DO THIS Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.", async () => {
    const testStore = new TestStore({
      play: [rayaKumandranRider, mauiHalfshark],
      hand: [goonsMaleficent],
    });
    const cardToUnexert = testStore.getCard(mauiHalfshark);
    cardToUnexert.updateCardMeta({ exerted: true });
    const cardToInk = testStore.getCard(goonsMaleficent);
    cardToInk.addToInkwell();
    expect(testStore.stackLayers).toHaveLength(1);
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [cardToUnexert] }, true);
    expect(cardToUnexert.meta.exerted).toBe(false);
  });

  it("can't do it twice", async () => {
    const testEngine = new TestEngine({
      play: [
        rayaKumandranRider,
        mauiHalfshark,
        mauiDemiGod,
        belleStrangeButBeautiful,
      ],
      hand: [goonsMaleficent, yokaiProfessorCallaghan],
    });

    await testEngine.tapCard(mauiHalfshark); // Card to untap
    await testEngine.tapCard(mauiDemiGod); // Card that should not be untapped

    await testEngine.putIntoInkwell(goonsMaleficent);

    expect(testEngine.stackLayers).toHaveLength(1);
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [mauiHalfshark] });
    expect(testEngine.getCardModel(mauiHalfshark).meta.exerted).toBe(false);
    expect(testEngine.getCardModel(mauiHalfshark).canQuest).toBe(false);

    await testEngine.putIntoInkwell(yokaiProfessorCallaghan);

    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
