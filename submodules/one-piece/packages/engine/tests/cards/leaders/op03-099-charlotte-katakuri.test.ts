import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op03CharlotteKatakuri099 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-099 Charlotte Katakuri", () => {
  test("privately repositions either top Life card before gaining battle power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op03CharlotteKatakuri099, activeDon: 1 },
      { life: [eb01Doma005, eb01Fourtricks025], hand: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lookedId = engine.findCardInZone("north", "life", eb01Doma005);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    const ownerDecision = engine.pendingDecision("effectLookAtLifeOwner", "south");
    const ownerStep = ownerDecision.steps[0];
    expect(ownerStep?.kind).toBe("chooseOption");
    if (ownerStep?.kind !== "chooseOption") {
      throw new Error("Expected Charlotte Katakuri's controller to choose a Life owner.");
    }
    expect(ownerStep.options.map((option) => option.id)).toEqual(["skip", "self", "opponent"]);
    engine.resolveDecision("effectLookAtLifeOwner", { optionId: "opponent" }, "south");

    const positionDecision = engine.pendingDecision("effectLookAtLifePosition", "south");
    expect(positionDecision.message).toContain(eb01Doma005.name);
    expect(JSON.stringify(engine.getView("north").decisions)).not.toContain(eb01Doma005.name);
    engine.resolveDecision("effectLookAtLifePosition", { optionId: "bottom" }, "south");

    expect(engine.pendingDecision("battleCounter", "north")).toBeDefined();
    expect(engine.getState().players.north.life.at(-1)).toBe(lookedId);
    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("skipping the Life look still gives battle power and it expires after battle", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op03CharlotteKatakuri099, activeDon: 1 },
      { hand: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.attachDon(engine.leader("south"), 1, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectLookAtLifeOwner", { optionId: "skip" }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(engine.getView("south").players.south.leader.power).toBe(6000);
  });

  test("gains battle power with neither player having Life when attacking a Character", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op03CharlotteKatakuri099, life: [], activeDon: 1 },
      { life: [], character: [{ card: eb01Doma005, rested: true }], hand: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.attachDon(engine.leader("south"), 1, "south");
    engine.declareAttack(
      engine.leader("south"),
      engine.findCardInZone("north", "character", eb01Doma005),
      "south",
    );
    expect(engine.pendingDecision("battleCounter", "north")).toBeDefined();
    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    expect(engine.getView("south").status).toBe("active");
  });

  test.each(["top", "bottom"])("keeps face-up Life public when placing it at %s", (position) => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op03CharlotteKatakuri099, activeDon: 1 },
      {
        life: [{ card: eb01Doma005, faceUp: true, publicKnowledge: true }, eb01Fourtricks025],
        hand: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lookedId = engine.findCardInZone("north", "life", eb01Doma005);
    engine.attachDon(engine.leader("south"), 1, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectLookAtLifeOwner", { optionId: "opponent" }, "south");
    engine.resolveDecision("effectLookAtLifePosition", { optionId: position }, "south");
    const life = engine.getView("south").players.north.life;
    expect(life[position === "top" ? 0 : life.length - 1]).toMatchObject({
      instanceId: lookedId,
      cardId: eb01Doma005.id,
      hidden: false,
    });
    // The public card projection has no face-orientation field.
    expect(engine.getState().cards[lookedId]?.faceUp).toBe(true);
    expect(engine.getView("south").players.south.leader.power).toBe(7000);
  });

  test("without attached DON neither looks at Life nor gains power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op03CharlotteKatakuri099 },
      { hand: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.pendingDecision("battleCounter", "north")).toBeDefined();
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
  });
});
