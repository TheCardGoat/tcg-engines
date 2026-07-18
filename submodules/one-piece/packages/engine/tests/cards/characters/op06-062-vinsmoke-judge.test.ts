import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06Germa66078,
  op06VinsmokeIchiji060,
  op06VinsmokeIchiji061,
  op06VinsmokeJudge062,
  op06VinsmokeNiji064,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function acceptJudgeOnPlay(engine: OnePieceTestEngine) {
  const firstDiscardId = engine.findCardInZone("south", "hand", eb01Doma005);
  const secondDiscardId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
  engine.playCard(op06VinsmokeJudge062, "south");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
  engine.resolveDecision(
    "effectCostTrashFromHand",
    { selectedIds: [firstDiscardId, secondDiscardId] },
    "south",
  );
}

describe("OP06-062 Vinsmoke Judge", () => {
  test("pays printed DON!! -1 before asking which two hand cards to trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06VinsmokeJudge062, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: 9,
    });

    engine.playCard(op06VinsmokeJudge062, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.pendingDecision("effectCostReturnDon", "south").steps[0]?.kind).toBe("payCost");
  });

  test("pays DON!! and hand costs before mapping only low-power GERMA 66 Characters", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06VinsmokeJudge062, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      trash: [op06VinsmokeIchiji060, op06VinsmokeNiji064, op06VinsmokeIchiji061, op06Germa66078],
      activeDon: 9,
    });
    const ichijiId = engine.findCardInZone("south", "trash", op06VinsmokeIchiji060);
    const nijiId = engine.findCardInZone("south", "trash", op06VinsmokeNiji064);
    const tooPowerfulId = engine.findCardInZone("south", "trash", op06VinsmokeIchiji061);
    const eventId = engine.findCardInZone("south", "trash", op06Germa66078);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    acceptJudgeOnPlay(engine);

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 2 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Judge's trash play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([ichijiId, nijiId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(eventId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [ichijiId, nijiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toEqual(
      expect.arrayContaining([ichijiId, nijiId]),
    );
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.trash).toHaveLength(4);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not allow two played Characters to share a card name", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06VinsmokeJudge062, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      trash: [op06VinsmokeNiji064, op06VinsmokeNiji064],
      activeDon: 9,
    });
    acceptJudgeOnPlay(engine);
    const duplicateNijiIds = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(duplicateNijiIds?.kind).toBe("selectEntity");
    if (duplicateNijiIds?.kind !== "selectEntity")
      throw new Error("Expected Judge's trash play choice.");

    expect(() =>
      engine.resolveDecision(
        "effectPlaySelection",
        { selectedIds: duplicateNijiIds.candidates.map((candidate) => candidate.ref.id) },
        "south",
      ),
    ).toThrow();
  });

  test("once per turn returns DON!! to rest up to one opposing DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06VinsmokeJudge062], activeDon: 1, restedDon: 1 },
      { activeDon: 2 },
    );
    const judgeId = engine.findCardInZone("south", "character", op06VinsmokeJudge062);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(judgeId, "activateMain", "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const count = engine.pendingDecision("effectRestDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Judge's DON!! rest count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectRestDonCount", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(engine.getView("south").players.north).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: judgeId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
