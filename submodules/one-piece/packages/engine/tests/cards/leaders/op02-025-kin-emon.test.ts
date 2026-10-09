import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Urashima092, op02KinEmon025 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-025 Kin'emon", () => {
  test("discounts the next qualifying Wano Character without revealing a hand choice", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02KinEmon025,
      hand: [eb01MountainGod018, op01Urashima092],
      activeDon: 10,
    });
    const mountainGodId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const urashimaId = engine.findCardInZone("south", "hand", op01Urashima092);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    let hand = engine.getView("south").players.south.hand;
    expect(hand.find((card) => card.instanceId === mountainGodId)?.cost).toBe(5);
    expect(hand.find((card) => card.instanceId === urashimaId)?.cost).toBe(7);
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.playCard(eb01MountainGod018);
    hand = engine.getView("south").players.south.hand;
    expect(hand.find((card) => card.instanceId === urashimaId)?.cost).toBe(7);
    const failure = engine.expectFailure({
      type: "playCard",
      seat: "south",
      instanceId: urashimaId,
    });
    expect(failure.reason).toBe("Not enough active DON!! to pay the cost.");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 6, restedDon: 4 });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("does not consume the discount for a Wano Character below cost 3", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02KinEmon025,
      hand: ["OP01-041", eb01MountainGod018],
      activeDon: 5,
    });
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.playCard("OP01-041");
    expect(engine.getView("south").players.south.activeDon).toBe(4);
    engine.playCard(eb01MountainGod018);
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
  });

  test("discounts a qualifying Character drawn after activation", () => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: op02KinEmon025,
      hand: ["OP07-096"],
      deck: [eb01MountainGod018, "EB01-005"],
      activeDon: 5,
    });
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.playCard("OP07-096");
    engine.playCard(eb01MountainGod018);
    expect(engine.getView("south").players.south.activeDon).toBe(0);
    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.cardId === eb01MountainGod018.id),
    ).toBe(true);
  });

  test("does not lower the card cost used by Law's effect-play limit", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02KinEmon025,
      hand: ["OP01-047", "OP14-026", "OP01-043"],
      character: ["EB01-005"],
      activeDon: 5,
    });
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.playCard("OP01-047");
    engine.acceptLeadingOptional("south");
    engine.resolveDecision(
      "effectCostReturnCharacter",
      { selectedIds: [engine.findCardInZone("south", "character", "EB01-005")] },
      "south",
    );
    const step = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Law's play selection.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      engine.findCardInZone("south", "hand", "OP14-026"),
    );
  });

  test("pays the discounted cost once before full-field replacement retry and saved-state restore", () => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: op02KinEmon025,
      character: ["EB01-005"],
      hand: ["EB01-005", "EB01-005", "EB01-005", "EB01-005", "OP01-043"],
      activeDon: 6,
    });
    const replacedId = engine.findCardInZone("south", "character", "EB01-005");
    const shinobuId = engine.findCardInZone("south", "hand", "OP01-043");
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    for (let index = 0; index < 4; index++) engine.playCard("EB01-005");

    const before = engine.getView("south").players.south;
    expect(before).toMatchObject({ activeDon: 2, restedDon: 4 });
    expect(before.characters.filter(Boolean)).toHaveLength(5);
    expect(before.hand.find((card) => card.instanceId === shinobuId)?.cost).toBe(3);
    engine.playCard("OP01-043");
    const decision = engine.pendingDecision("playCharacterReplacement", "south");
    const failed = engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: decision.id,
      selectedIds: [shinobuId],
    });
    engine = OnePieceTestEngine.fromState(failed.state);
    expect(engine.pendingDecision("playCharacterReplacement", "south").id).toBe(decision.id);
    const afterRetry = engine.getView("south").players.south;
    expect(afterRetry).toMatchObject({ activeDon: 0, restedDon: 6 });
    expect(afterRetry.characters).toEqual(before.characters);
    expect(afterRetry.trash).toHaveLength(0);
    expect(afterRetry.hand.map((card) => card.instanceId)).toContain(shinobuId);

    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    expect(engine.pendingDecision("playCharacterReplacement", "south").id).toBe(decision.id);
    engine.resolveDecision("playCharacterReplacement", { selectedIds: [replacedId] }, "south");
    const after = engine.getView("south").players.south;
    expect(after).toMatchObject({ activeDon: 0, restedDon: 6 });
    expect(after.characters.filter(Boolean)).toHaveLength(5);
    expect(after.characters.some((card) => card?.instanceId === shinobuId)).toBe(true);
    expect(after.characters.some((card) => card?.instanceId === replacedId)).toBe(false);
    expect(after.trash.map((card) => card.instanceId)).toEqual([replacedId]);
    expect(after.hand).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("effect play does not consume the next paid-play discount", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02KinEmon025,
      hand: ["OP01-047", "OP01-043", eb01MountainGod018],
      character: ["EB01-005"],
      activeDon: 9,
    });
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.playCard("OP01-047");
    engine.acceptLeadingOptional("south");
    engine.resolveDecision(
      "effectCostReturnCharacter",
      { selectedIds: [engine.findCardInZone("south", "character", "EB01-005")] },
      "south",
    );
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [engine.findCardInZone("south", "hand", "OP01-043")] },
      "south",
    );
    engine.playCard(eb01MountainGod018);
    expect(engine.getView("south").players.south.activeDon).toBe(0);
  });
});
