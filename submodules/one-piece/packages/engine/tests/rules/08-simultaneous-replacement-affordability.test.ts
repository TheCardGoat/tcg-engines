import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// OP11 FAQ, Koby's third ruling: neither simultaneously removed Character
// can enter the trash first to pay the replacement for the other Character.
test("Koby cannot fund a simultaneous replacement with the first Kaido victim", () => {
  const e = OnePieceTestEngine.create(
    { leaderCardId: "ST04-001", hand: ["OP01-094"], activeDon: 10 },
    {
      leaderCardId: "OP11-001",
      character: ["OP11-010", "OP11-010"],
      trash: ["ST02-002", "ST02-006"],
    },
  );
  const victims = e
    .getView("north")
    .players.north.characters.flatMap((card) => (card ? [card.instanceId] : []));
  e.asSouth().play("OP01-094");
  e.asSouth().acceptOptional();
  expect(e.getView("north").prompts).toHaveLength(0);
  expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(0);
  expect(e.getView("north").players.north.trash.map((card) => card.instanceId)).toEqual(
    expect.arrayContaining(victims),
  );
});

test.each(["yes", "no"])(
  "Koby can replace the entire simultaneous group once; choice %s",
  (optionId) => {
    let e = OnePieceTestEngine.create(
      { leaderCardId: "ST04-001", hand: ["OP01-094"], activeDon: 10 },
      {
        leaderCardId: "OP11-001",
        character: ["OP11-010", "OP11-010"],
        trash: ["ST02-002", "ST02-006", "ST02-012"],
      },
    );
    const payment = e.getView("north").players.north.trash.map((c) => c.instanceId!);
    e.asSouth().play("OP01-094");
    e.asSouth().acceptOptional();
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectKoReplacement", { optionId }, "north");
    if (optionId === "yes") {
      e.asNorth().orderCards("effectReturnToDeckOwnerOrder", [...payment].reverse());
      expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(2);
      expect(e.getView("north").players.north.trash).toHaveLength(0);
    } else {
      expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(0);
      expect(e.getView("north").players.north.trash).toHaveLength(5);
    }
    expect(e.getView("north").prompts).toHaveLength(0);
  },
);

test("a separate later removal instruction may use the prior instruction's completed trash", () => {
  const source = getCard("ST02-002"),
    saved = source.effects;
  try {
    // Explicit rules fixture: two sequential K.O. instructions are not simultaneous.
    source.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1 },
                filters: [{ filter: "name", value: "Hibari" }],
              },
            },
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1 },
                filters: [{ filter: "name", value: "X.Drake" }],
              },
            },
          ],
        },
      ],
    };
    const e = OnePieceTestEngine.create(
      { character: ["ST02-002"] },
      {
        leaderCardId: "OP11-001",
        character: ["OP11-010", "OP11-017"],
        trash: ["ST02-006", "ST02-012"],
      },
    );
    const drake = e.findCardInZone("north", "character", "OP11-017");
    e.asSouth().activateMain("ST02-002");
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    e.asNorth().orderCards(
      "effectReturnToDeckOwnerOrder",
      e
        .getView("north")
        .players.north.trash.map((c) => c.instanceId!)
        .reverse(),
    );
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === drake)).toBe(
      true,
    );
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  } finally {
    source.effects = saved;
  }
});

test("an eligible Koby replacement cannot pay with an earlier simultaneous ineligible victim", () => {
  let e = OnePieceTestEngine.create(
    { leaderCardId: "ST04-001", hand: ["OP01-094"], activeDon: 10 },
    {
      leaderCardId: "OP11-001",
      character: ["OP02-004", "OP11-010"],
      trash: ["ST02-002", "ST02-006", "ST02-012"],
    },
  );
  const payment = e.getView("north").players.north.trash.map((c) => c.instanceId!);
  const newgate = e.findCardInZone("north", "character", "OP02-004");
  e.asSouth().play("OP01-094");
  e.asSouth().acceptOptional();
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
  const decision = e.pendingDecision("effectTargetSelection", "north");
  const rejected = e.expectFailure({
    type: "resolvePrompt",
    seat: "north",
    promptId: decision.id,
    selectedIds: [newgate, payment[0]!, payment[1]!],
  });
  e = OnePieceTestEngine.fromState(rejected.state);
  e.asNorth().chooseTargets(...payment);
  e.asNorth().orderCards("effectReturnToDeckOwnerOrder", payment.toReversed());
  expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toEqual([newgate]);
});
