import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { davidXanatosSteelClanLeader } from "./184-david-xanatos-steel-clan-leader";

const discardFodder = createMockCharacter({
  id: "david-xanatos-steel-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const damageTarget = createMockCharacter({
  id: "david-xanatos-steel-damage-target",
  name: "Damage Target",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("David Xanatos - Steel Clan Leader", () => {
  it("MINOR INCONVENIENCE - discards a card to deal 2 damage to a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [davidXanatosSteelClanLeader, discardFodder],
        inkwell: davidXanatosSteelClanLeader.cost,
        deck: 2,
      },
      {
        play: [damageTarget],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(davidXanatosSteelClanLeader)).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(davidXanatosSteelClanLeader, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [discardFodder] }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [damageTarget] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerTwo().getDamage(damageTarget)).toBe(2);
  });

  it("can decline MINOR INCONVENIENCE", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [davidXanatosSteelClanLeader, discardFodder],
        inkwell: davidXanatosSteelClanLeader.cost,
        deck: 2,
      },
      {
        play: [damageTarget],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(davidXanatosSteelClanLeader)).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(davidXanatosSteelClanLeader, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("hand");
    expect(testEngine.asPlayerTwo().getDamage(damageTarget)).toBe(0);
  });
});
