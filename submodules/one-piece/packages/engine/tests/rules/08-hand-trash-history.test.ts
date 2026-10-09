import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// ST33-004: history belongs to the player, not copies already in hand.
test("Borsalino drawn after a hand-discard effect has reduced cost across a snapshot", () => {
  let e = OnePieceTestEngine.create(
    {
      character: ["OP03-060"],
      hand: ["ST06-015", "ST02-002"],
      deck: ["ST02-006", "ST02-012", "ST33-004", "ST02-002"],
      activeDon: 5,
    },
    {},
    { firstPlayer: "north", activeSeat: "south" },
  );
  e.asSouth().attack(e.findCardInZone("south", "character", "OP03-060"), e.leader("north"));
  e.asSouth().acceptOptional();
  e.resolveDecision(
    "effectTrashFromHandSelection",
    { selectedIds: [e.findCardInZone("south", "hand", "ST02-002")] },
    "south",
  );
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  e.asSouth().play("ST06-015");
  expect(e.getView("south").players.south.hand.find((c) => c.cardId === "ST33-004")?.cost).toBe(3);
  e.asSouth().play("ST33-004");
  expect(e.getView("south").players.south.activeDon).toBe(0);
});

test("Event disposal alone does not create hand-discard history", () => {
  const e = OnePieceTestEngine.create({
    hand: ["ST06-015", "ST33-004"],
    deck: ["ST02-002", "ST02-006"],
    activeDon: 7,
  });
  e.asSouth().play("ST06-015");
  expect(e.getView("south").players.south.hand.find((c) => c.cardId === "ST33-004")?.cost).toBe(6);
});

test("Counter-card trash does not count as an effect discard", () => {
  const e = OnePieceTestEngine.create(
    { hand: ["ST33-004", "ST02-002"] },
    {},
    { activeSeat: "north", firstPlayer: "south" },
  );
  e.asNorth().attack(e.leader("north"), e.leader("south"));
  e.asSouth().chooseCounter("ST02-002");
  expect(e.getView("south").players.south.hand.find((c) => c.cardId === "ST33-004")?.cost).toBe(6);
});

test("hand trash paid as an activation cost counts as an effect discard", () => {
  const e = OnePieceTestEngine.create({ hand: ["OP02-098", "ST33-004", "ST02-002"], activeDon: 3 });
  e.asSouth().play("OP02-098");
  e.asSouth().acceptOptional();
  e.resolveDecision(
    "effectCostTrashFromHand",
    { selectedIds: [e.findCardInZone("south", "hand", "ST02-002")] },
    "south",
  );
  expect(e.getView("south").players.south.hand.find((c) => c.cardId === "ST33-004")?.cost).toBe(3);
});

// Official OP12-056 FAQ: Kuzan draws only after Garp's whole effect resolves.
test("Garp hand-cost triggers Kuzan after the original play choice, not before", () => {
  const e = OnePieceTestEngine.create({
    leaderCardId: "OP12-040",
    hand: ["OP12-056", "ST02-002", "ST33-004"],
    deck: ["OP02-068", "ST02-006"],
    activeDon: 8,
  });
  const drawn = e.findCardInZone("south", "deck", "OP02-068"),
    borsa = e.findCardInZone("south", "hand", "ST33-004");
  e.asSouth().play("OP12-056");
  e.asSouth().acceptOptional();
  e.resolveDecision(
    "effectCostTrashFromHand",
    { selectedIds: [e.findCardInZone("south", "hand", "ST02-002")] },
    "south",
  );
  const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
  if (p?.kind !== "selectEntity") throw Error("Garp play");
  expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([borsa]);
  expect(e.getView("south").players.south.hand.find((c) => c.instanceId === borsa)?.cost).toBe(3);
  expect(e.getView("south").players.south.deckCount).toBe(2);
  e.asSouth().chooseNoPlay();
  expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(drawn);
});

test("replacement hand discard counts for Borsalino and Kuzan", () => {
  const e = OnePieceTestEngine.create(
    {
      leaderCardId: "OP12-040",
      character: ["OP12-053"],
      hand: ["ST33-004", "ST02-002"],
      deck: ["ST02-006", "ST02-012"],
    },
    { hand: ["OP02-067"], activeDon: 2 },
    { firstPlayer: "south", activeSeat: "north" },
  );
  const protectedCard = e.findCardInZone("south", "character", "OP12-053");
  e.asNorth().play("OP02-067");
  e.asNorth().chooseTargets(protectedCard);
  e.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
  e.resolveDecision(
    "effectTrashFromHandSelection",
    { selectedIds: [e.findCardInZone("south", "hand", "ST02-002")] },
    "south",
  );
  expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(protectedCard);
  expect(e.getView("south").players.south.hand.find((c) => c.cardId === "ST33-004")?.cost).toBe(3);
  expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("ST02-006");
});
