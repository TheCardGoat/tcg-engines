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

test.each(["ST01-001", "ST02-001"])("parsed named Unblockable Main restricts %s", (leader) =>
  parsed("ST29-016", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: leader, hand: ["ST29-016"], activeDon: 1 },
      { character: ["ST01-006"] },
    );
    e.asSouth().play("ST29-016");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    if (leader === "ST02-001")
      e.asNorth().chooseBlocker(e.findCardInZone("north", "character", "ST01-006"));
    expect(e.getView("north").players.north.lifeCount).toBe(leader === "ST01-001" ? 3 : 4);
  }),
);

test("parsed Leader separates high-base self penalty and exact-name opponent-turn bonus", () =>
  parsed("ST30-001", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST30-001",
      character: ["ST30-007", "ST30-012", "ST30-005"],
      hand: ["ST28-004"],
      activeDon: 6,
    });
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    e.playCard("ST28-004");
    expect(e.getView("south").players.south.leader.power).toBe(4000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(4000);
    expect(
      e
        .getView("south")
        .players.south.characters.slice(0, 3)
        .map((c) => c?.power),
    ).toEqual([9000, 9000, 6000]);
  }));

test("parsed Ivankov reveals only matching Characters and can discard those same cards after drawing", () =>
  parsed("ST30-004", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST30-004", "ST30-005", "ST30-013", "ST02-006", "ST02-002", "ST30-015"],
      activeDon: 3,
      deck: ["ST02-002", "ST02-006", "ST02-012", "ST02-002"],
    });
    e.playCard("ST30-004");
    e.asSouth().acceptOptional();
    const a = e.findCardInZone("south", "hand", "ST30-005"),
      b = e.findCardInZone("south", "hand", "ST30-013");
    const p = e.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    if (p?.kind !== "payCost") throw Error("reveal");
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "hand", "ST30-015"),
    );
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "hand", "ST02-002"),
    );
    e.resolveDecision("effectCostRevealFromHand", { selectedIds: [a, b] }, "south");
    expect(e.getView("south").players.south.handCount).toBe(8);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [a, b] }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(a);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  }));

test("parsed Oars replaces opponent removal by self-trash then draw with attachments returned", () =>
  parsed("ST30-009", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-056"], activeDon: 6 },
      {
        character: [{ cardId: "ST30-009", attachedDon: 2 }, "ST02-006"],
        deck: ["ST02-002", "ST02-012"],
      },
    );
    const victim = e.findCardInZone("north", "character", "ST02-006");
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(victim);
    e.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "north");
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === victim)).toBe(
      true,
    );
    expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
    expect(e.getView("north").players.north.restedDon).toBe(2);
    expect(e.getView("north").players.north.trash.some((c) => c.cardId === "ST30-009")).toBe(true);
  }));

test("parsed Oars does not replace own removal or grant a draw", () =>
  parsed("ST30-009", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST30-009", "ST02-006"],
      hand: ["OP04-056"],
      activeDon: 6,
    });
    const target = e.findCardInZone("south", "character", "ST02-006");
    e.playCard("OP04-056");
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getState().players.south.deck.at(-1)).toBe(target);
  }));

test("parsed Galdino rests self and gives one DON each to two exact-base recipients", () =>
  parsed("ST30-014", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST30-014", "ST02-006", "ST01-012", "ST02-002"],
      restedDon: 2,
    });
    const a = e.findCardInZone("south", "character", "ST02-006"),
      b = e.findCardInZone("south", "character", "ST01-012");
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST30-014"));
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("recipients");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([a, b]);
    e.asSouth().chooseTargets(a, b);
    e.resolveDecision("effectGiveDonEachCount", { optionId: "1" }, "south");
    e.resolveDecision("effectGiveDonEachCount", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(
      e
        .getView("south")
        .players.south.characters.slice(1, 3)
        .map((c) => c?.attachedDon),
    ).toEqual([1, 1]);
  }));

test.each([true, false])("parsed Counter needs two base6000 Characters, valid=%s", (valid) =>
  parsed("ST30-015", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST30-015"],
        activeDon: 1,
        character: ["ST02-006", valid ? "ST01-012" : "ST02-002"],
      },
      { character: ["ST02-013"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-013"), e.leader("south"));
    e.asSouth().chooseCounter("ST30-015");
    if (valid) e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.lifeCount).toBe(valid ? 4 : 3);
  }),
);

test.each([true, false])(
  "parsed trailing Counter draw requires both exact names, valid=%s",
  (valid) =>
    parsed("ST30-016", () => {
      const e = OnePieceTestEngine.create(
        {
          hand: ["ST30-016"],
          activeDon: 1,
          character: ["ST30-007", valid ? "ST30-012" : "ST30-007"],
          deck: ["ST02-002", "ST02-012"],
        },
        { character: ["ST02-013"] },
        { activeSeat: "north", firstPlayer: "south" },
      );
      e.asNorth().attack(e.findCardInZone("north", "character", "ST02-013"), e.leader("south"));
      e.asSouth().chooseCounter("ST30-016");
      e.asSouth().chooseTargets(e.leader("south"));
      expect(e.getView("south").players.south.handCount).toBe(valid ? 1 : 0);
      expect(e.getView("south").players.south.lifeCount).toBe(4);
    }),
);
