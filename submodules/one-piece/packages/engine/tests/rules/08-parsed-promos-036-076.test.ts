import { beforeEach, afterEach, describe, expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";
const ids = ["P-046", "P-051", "P-059"];
const originals = ids.map((id) => getCard(id).effects);
beforeEach(() => {
  for (const id of ids) {
    const card = getCard(id);
    card.effects = buildCardEffects(card.effect ?? "");
  }
});
afterEach(() => {
  ids.forEach((id, index) => {
    getCard(id).effects = originals[index];
  });
});
describe("p-046-yamato", () => {
  test("orders the entire remaining hand at bottom then draws exactly that many", () => {
    let e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["P-046", "ST02-002", "ST02-006"],
      activeDon: 1,
      deck: ["ST02-012", "ST01-011", "ST01-006"],
    });
    const oldDeck = e.getState().players.south.deck.slice(),
      a = e.findCardInZone("south", "hand", "ST02-002"),
      b = e.findCardInZone("south", "hand", "ST02-006");
    e.asSouth().play("P-046");
    e.asSouth().acceptOptional();
    const step = e.pendingDecision("effectReturnToDeckOwnerOrder", "south").steps[0];
    if (step?.kind !== "orderItems") throw Error("order");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([a, b]);
    expect(
      e.getView("north").decisions.some((d) => d.steps.some((s) => s.kind === "orderItems")),
    ).toBe(false);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.asSouth().orderCards("effectReturnToDeckOwnerOrder", [b, a]);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual(
      oldDeck.slice(0, 2),
    );
    expect(e.getState().players.south.deck).toEqual([oldDeck[2], b, a]);
  });
  test("decline leaves every hand and deck identity unchanged", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-046", "ST02-002"], activeDon: 1 });
    const deck = e.getState().players.south.deck.slice(),
      id = e.findCardInZone("south", "hand", "ST02-002");
    e.asSouth().play("P-046");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([id]);
    expect(e.getState().players.south.deck).toEqual(deck);
  });
  test("empty remaining hand draws zero", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-046"], activeDon: 1 });
    e.asSouth().play("P-046");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.deckCount).toBe(10);
  });
  test("single-card hand return precedes draw with one old deck card", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-046", "ST02-002"],
      activeDon: 1,
      deck: ["ST02-006"],
    });
    const returned = e.findCardInZone("south", "hand", "ST02-002"),
      drawn = e.findCardInZone("south", "deck", "ST02-006");
    e.asSouth().play("P-046");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([drawn]);
    expect(e.getState().players.south.deck).toEqual([returned]);
    expect(e.getView("south").status).toBe("active");
  });
});
describe("p-051-shanks", () => {
  test.each([0, 1, 2])("actual trash count %s sets battle-only power", (count) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["P-051"], hand: ["ST02-002", "ST02-006"] },
      { leaderCardId: "ST01-001", hand: ["ST02-002"] },
    );
    const id = e.findCardInZone("south", "character", "P-051"),
      hand = e
        .getView("south")
        .players.south.hand.flatMap((c) => (c.instanceId ? [c.instanceId] : []));
    e.asSouth().attack(id, e.leader("north"));
    const step = e.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(step).toMatchObject({ min: 0, max: 2 });
    e.asSouth().trashFromHand(...hand.slice(0, count));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(9000 + count * 1000);
    expect(e.getView("south").players.south.handCount).toBe(2 - count);
    e.asNorth().chooseCounter();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(9000);
  });
  test("empty hand cannot create power", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["P-051"] },
      { leaderCardId: "ST01-001", hand: ["ST02-002"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "P-051"), e.leader("north"));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(9000);
    e.asNorth().chooseCounter();
    expect(e.getView("north").players.north.lifeCount).toBe(4);
  });
});
describe("p-059-the-world-s-continuation", () => {
  test.each([0, 1, 2])("Counter uses %s returned Characters for its chosen recipient", (count) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", activeDon: 3 },
      {
        leaderCardId: "ST11-001",
        hand: ["P-059", "ST02-012"],
        activeDon: 2,
        character: [{ cardId: "ST02-002", attachedDon: 1 }, "ST02-006"],
      },
    );
    const ids = e
      .getView("north")
      .players.north.characters.flatMap((c) => (c?.instanceId ? [c.instanceId] : []));
    e.asSouth().attachDon(e.leader("south"), 3);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseCounter("P-059");
    e.asNorth().chooseTargets(...ids.slice(0, count));
    e.asNorth().chooseTargets(e.leader("north"));
    e.asNorth().chooseCounter();
    expect(e.getView("north").players.north.leader.power).toBe(5000);
    expect(e.getView("north").players.north.handCount).toBe(1 + count + (count < 2 ? 1 : 0));
    expect(e.getView("north").players.north.restedDon).toBe(2 + (count > 0 ? 1 : 0));
    expect(e.getView("north").players.north.leader.power).toBe(5000);
    expect(e.getView("north").players.north.lifeCount).toBe(count === 2 ? 5 : 4);
  });
  test("wrong Leader pays Event cost but cannot return Characters or add power", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", activeDon: 3 },
      {
        leaderCardId: "ST01-001",
        hand: ["P-059", "ST02-012"],
        activeDon: 2,
        character: ["ST02-002"],
      },
    );
    e.asSouth().attachDon(e.leader("south"), 3);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseCounter("P-059");
    e.asNorth().chooseCounter();
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("north").players.north.leader.power).toBe(5000);
    expect(e.getView("north").players.north.restedDon).toBe(2);
    expect(e.getView("north").players.north.lifeCount).toBe(4);
  });
  test.each([true, false])("remaining Character power recipient selected=%s", (boost) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", activeDon: 1 },
      {
        leaderCardId: "ST11-001",
        hand: ["P-059"],
        activeDon: 2,
        character: [{ cardId: "ST02-002", rested: true }, "ST02-006", "ST02-012"],
      },
    );
    const target = e.findCardInZone("north", "character", "ST02-002"),
      a = e.findCardInZone("north", "character", "ST02-006"),
      b = e.findCardInZone("north", "character", "ST02-012");
    e.asSouth().attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), target);
    e.asNorth().chooseCounter("P-059");
    e.asNorth().chooseTargets(a, b);
    const p = e.pendingDecision("effectTargetSelection", "north").steps[0];
    if (p?.kind !== "selectEntity") throw Error("recipient");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([e.leader("north"), target]);
    e.asNorth().chooseTargets(...(boost ? [target] : []));
    e.asNorth().chooseCounter();
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === target)).toBe(
      boost,
    );
    expect(e.getView("north").players.north.trash.some((c) => c.instanceId === target)).toBe(
      !boost,
    );
  });
});
