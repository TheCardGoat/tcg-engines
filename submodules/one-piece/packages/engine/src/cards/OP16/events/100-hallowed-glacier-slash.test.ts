import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-100 Hallowed Glacier Slash", () => {
  test.each(["battle", "effect", "previous-turn", "no-ko"])(
    "Main requires an opponent Character KO this turn: %s",
    (cause) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: "OP06-022", hand: ["OP16-100", "ST01-015"], activeDon: 10 },
        { character: [{ cardId: "EB01-005", rested: true }] },
      );
      const target = e.findCardInZone("north", "character", "EB01-005");
      if (cause === "effect") {
        e.playCard("ST01-015");
        e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
        e.declareAttack(e.leader("south"), e.leader("north"));
      } else if (cause !== "no-ko") {
        e.declareAttack(e.leader("south"), target);
      } else {
        e.declareAttack(e.leader("south"), e.leader("north"));
      }
      if (cause === "previous-turn") {
        e.endTurn("south");
        e.endTurn("north");
        e.declareAttack(e.leader("south"), e.leader("north"));
        // No usable Counter remains, so the Counter Step ends automatically.
      }
      e.playCard("OP16-100");
      e.acceptLeadingOptional("south");
      expect(e.getView("south").players.south.leader?.rested).toBe(
        cause === "previous-turn" || cause === "no-ko",
      );
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );

  test("K.O.ing an opponent Stage does not satisfy the Character condition", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP06-022", hand: ["OP16-100", "OP17-116"], activeDon: 10 },
      { stage: "OP17-057" },
    );
    e.playCard("OP17-116");
    e.acceptLeadingOptional("south");
    e.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [e.findCardInZone("north", "stage", "OP17-057")] },
      "south",
    );
    e.declareAttack(e.leader("south"), e.leader("north"));
    e.playCard("OP16-100");
    e.acceptLeadingOptional("south");
    expect(e.getView("south").players.south.leader?.rested).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("a replaced K.O. does not satisfy the Main condition", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP06-022", hand: ["OP16-100"], activeDon: 4 },
      { character: [{ cardId: "OP15-003", rested: true }], hand: ["EB01-005"] },
    );
    e.attachDon(e.leader("south"), 1);
    e.declareAttack(e.leader("south"), e.findCardInZone("north", "character", "OP15-003"));
    e.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    e.resolveDecision(
      "battleKoReplacement",
      { selectedIds: [e.findCardInZone("north", "hand", "EB01-005")] },
      "north",
    );
    e.playCard("OP16-100");
    e.acceptLeadingOptional("south");
    expect(e.getView("south").players.south.leader?.rested).toBe(true);
    expect(e.getView("south").players.north.characters[0]?.cardId).toBe("OP15-003");
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("K.O.ing your own Character does not satisfy the Main condition", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP06-022",
        hand: ["OP16-100"],
        activeDon: 4,
        character: ["OP05-087", "EB01-005"],
      },
      {},
    );
    e.declareAttack(e.leader("south"), e.leader("north"));
    const hakuba = e.findCardInZone("south", "character", "OP05-087");
    e.attachDon(hakuba, 1);
    e.declareAttack(hakuba, e.leader("north"));
    e.acceptLeadingOptional("south");
    // No usable Counter remains, so the Counter Step ends automatically.
    e.playCard("OP16-100");
    e.acceptLeadingOptional("south");
    expect(e.getView("south").players.south.leader?.rested).toBe(true);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("EB01-005");
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] saves the Leader with +3000 power", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-100"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP16-100");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("[Counter] resolves as a battle counter", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-100"], activeDon: 5 },
      { activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack(engine.leader("north"), engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP16-100");
    const boost = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    if (boost?.extensions?.resolutionIntent === "effectTargetSelection") {
      engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP16-100");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: opponent Marco's own replacement K.O. permits Yamato reactivation", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP06-022", hand: ["ST01-015", "OP16-100"], activeDon: 10 },
      { character: ["EB01-005", "OP16-014"] },
    );
    const protectedId = e.findCardInZone("north", "character", "EB01-005");
    const marcoId = e.findCardInZone("north", "character", "OP16-014");
    e.declareAttack(e.leader("south"), e.leader("north"));
    expect(e.getView("south").players.south.leader?.rested).toBe(true);
    e.playCard("ST01-015");
    e.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "south");
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    const before = e.getView("south");
    expect(before.players.north.trash.map((card) => card.instanceId)).toContain(marcoId);
    expect(before.players.north.characters.map((card) => card?.instanceId)).toContain(protectedId);
    expect(before.players.south.leader?.rested).toBe(true);
    e.playCard("OP16-100");
    e.acceptLeadingOptional("south");
    expect(e.getView("south").players.south.leader?.rested).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declining the affordable DON rest leaves an eligible Yamato Leader rested", () => {
    const event = "OP16-100";
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP06-022", hand: [event, "ST01-015"], activeDon: 7 },
      { character: ["EB01-005"] },
    );
    e.playCard("ST01-015");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "EB01-005"));
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.playCard(event);
    const before = e.getView("south").players.south;
    e.asSouth().declineOptional();
    const after = e.getView("south").players.south;
    expect(after.leader.rested).toBe(true);
    expect(after.activeDon).toBe(before.activeDon);
    expect(after.restedDon).toBe(before.restedDon);
    expect(after.hand).toEqual(before.hand);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
