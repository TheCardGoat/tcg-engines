import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";
function parsed(id: string, run: () => void) {
  const c = getCard(id),
    old = c.effects;
  try {
    const trigger = "trigger" in c && typeof c.trigger === "string" ? c.trigger : "";
    c.effects = buildCardEffects(
      `${c.effect ?? ""} ${trigger ? "[Trigger] " + trigger.replace(/^\[Trigger\]\s*/, "") : ""}`,
    );
    run();
  } finally {
    c.effects = old;
  }
}

test.each([0, 1])(
  "generated Kinemon alternative %s retains draw two then chosen discard",
  (branch) =>
    parsed("ST32-001", () => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "OP01-002",
        hand: ["ST32-001"],
        activeDon: 2,
        deck: ["ST02-002", "ST02-006", "ST02-012"],
      });
      e.asSouth().play("ST32-001");
      e.asSouth().acceptOptional();
      e.resolveDecision("effectAlternativeCost", { optionId: String(branch) }, "south");
      e.resolveDecision(
        "effectTrashFromHandSelection",
        { selectedIds: [e.findCardInZone("south", "hand", "ST02-006")] },
        "south",
      );
      expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
      expect(e.getView("south").players.south.leader.rested).toBe(branch === 0);
      expect(e.getView("south").players.south.activeDon).toBe(branch === 0 ? 1 : 0);
    }),
);

test.each(["OP06-093", "ST01-011"])(
  "generated Mihawk allows Perona or Slash %s, excludes wrong type and cost",
  (card) =>
    parsed("ST32-003", () => {
      const e = OnePieceTestEngine.create({
        leaderCardId: "OP01-002",
        hand: ["ST32-003", card, "ST32-003", "ST02-002"],
        activeDon: 6,
      });
      const chosen = e.findCardInZone("south", "hand", card);
      e.asSouth().play("ST32-003");
      const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("play");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([chosen]);
      e.asSouth().choosePlay(chosen);
      if (card === "ST01-011") e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
      expect(e.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
        chosen,
      );
    }),
);

test.each(["ST32-004", "ST32-005"])(
  "generated %s applies Slash gate to its conditional clause",
  (id) =>
    parsed(id, () => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", hand: [id], activeDon: 10 },
        { character: [{ cardId: "ST02-002", rested: true }] },
      );
      e.asSouth().play(id);
      const actor = e.findCardInZone("south", "character", id);
      if (id === "ST32-004")
        expect(
          e.expectFailure({
            type: "declareAttack",
            seat: "south",
            attackerId: actor,
            targetId: e.findCardInZone("north", "character", "ST02-002"),
          }).accepted,
        ).toBe(false);
      else expect(e.getView("south").prompts).toHaveLength(0);
    }),
);

test("generated Borsalino reads actual discard history and expires next turn", () =>
  parsed("ST33-004", () => {
    const e = OnePieceTestEngine.create(
      {
        character: ["OP03-060"],
        hand: ["ST33-004", "ST02-002"],
        deck: ["ST02-006", "ST02-012", "ST02-002"],
        activeDon: 1,
      },
      {},
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "OP03-060"), e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [e.findCardInZone("south", "hand", "ST02-002")] },
      "south",
    );
    expect(e.getView("south").players.south.hand.find((c) => c.cardId === "ST33-004")?.cost).toBe(
      3,
    );
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.hand.find((c) => c.cardId === "ST33-004")?.cost).toBe(
      6,
    );
  }));

test("generated Linlin gathers both cost choices then sets base power even when Life choice is zero", () =>
  parsed("ST34-004", () => {
    let e = OnePieceTestEngine.create(
      {
        hand: ["ST34-004", "ST02-002", "ST02-006"],
        activeDon: 10,
        donDeckCount: 0,
        deck: ["ST02-012", "ST02-006"],
      },
      { character: [{ cardId: "ST02-002", attachedDon: 1 }] },
    );
    e.asSouth().play("ST34-004");
    e.asSouth().acceptOptional();
    e.pendingDecision("effectCostTrashFromHand", "south");
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [e.findCardInZone("south", "hand", "ST02-006")] },
      "south",
    );
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "0" }, "south");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST02-002"));
    expect(e.getView("south").players.north.characters[0]?.power).toBe(0);
    expect(e.getView("south").players.south).toMatchObject({
      restedDon: 6,
      donDeckCount: 4,
      lifeCount: 4,
    });
  }));

test.each(["ST35-004", "ST35-005"])(
  "generated %s keeps mixed-source play restrictions after zero DON",
  (id) =>
    parsed(id, () => {
      const e = OnePieceTestEngine.create({
        hand: [id, "ST21-005", "ST35-004", "ST21-016"],
        trash: ["ST35-002"],
        activeDon: 10,
      });
      e.asSouth().play(id);
      e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
      const chosen = e.findCardInZone("south", "trash", "ST35-002");
      const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("play");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([chosen]);
      e.asSouth().choosePlay(chosen);
      expect(e.getView("south").players.south.characters[1]?.instanceId).toBe(chosen);
    }),
);

test.each(["ST02-001", "ST05-001"])(
  "generated Apoo Life Trigger draws and restricts base setting for %s",
  (leader) =>
    parsed("ST36-003", () => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: leader, life: ["ST36-003"], deck: ["ST02-002", "ST02-006"] },
        {},
        { activeSeat: "north", firstPlayer: "south" },
      );
      e.asNorth().attack(e.leader("north"), e.leader("south"));
      e.asSouth().activateLifeTrigger();
      expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
      expect(e.getView("south").players.south.leader.power).toBe(
        leader === "ST02-001" ? 7000 : 5000,
      );
    }),
);

test("generated Kid uses distinct Main and attack costs with saved top/bottom selection", () =>
  parsed("ST36-005", () => {
    let e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST02-001",
        character: ["ST36-005"],
        restedDon: 1,
        life: ["ST02-002", "ST02-006", "ST02-012"],
      },
      { character: ["ST21-006"] },
    );
    const kid = e.findCardInZone("south", "character", "ST36-005"),
      bottom = e.findCardInZone("south", "life", "ST02-012"),
      middle = e.findCardInZone("south", "life", "ST02-006");
    e.asSouth().activateMain(kid);
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectCostTurnLifeFaceUp", "south"),
      step = p.steps[0];
    if (step?.kind !== "payCost") throw Error("Life cost");
    expect(step.candidates.map((c) => c.ref.id)).not.toContain(middle);
    const rejected = e.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: p.id,
      selectedIds: [middle],
    });
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(rejected.state)));
    e.resolveDecision("effectCostTurnLifeFaceUp", { selectedIds: [bottom] }, "south");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.asSouth().endTurn();
    e.asNorth().attack(e.findCardInZone("north", "character", "ST21-006"), e.leader("south"));
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(kid);
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("north").players.south.life[2]?.cardId).toBeNull();
  }));

test("generated Rayleigh gains Character-only Rush under Slash Leader", () =>
  parsed("ST32-004", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-002", hand: ["ST32-004"], activeDon: 4 },
      { character: [{ cardId: "ST02-002", rested: true }], hand: ["ST02-002"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().play("ST32-004");
    const actor = e.findCardInZone("south", "character", "ST32-004"),
      target = e.findCardInZone("north", "character", "ST02-002");
    expect(
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: actor,
        targetId: e.leader("north"),
      }).accepted,
    ).toBe(false);
    e.asSouth().attack(actor, target);
    expect(e.getView("south").battle?.targetId).toBe(target);
  }));

test("generated Zoro Slash Leader On Play rests only cost two or less", () =>
  parsed("ST32-005", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-002", hand: ["ST32-005"], activeDon: 1 },
      { character: ["ST02-012", "ST02-002"] },
    );
    const target = e.findCardInZone("north", "character", "ST02-012");
    e.asSouth().play("ST32-005");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("rest");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
  }));
