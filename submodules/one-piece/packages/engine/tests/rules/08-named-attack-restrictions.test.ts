import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { getLegalCommands, OnePieceTestEngine } from "../../src/index.ts";

function setup() {
  return OnePieceTestEngine.create(
    {
      leaderCardId: "OP17-039",
      character: [
        { cardId: "OP17-044", rested: true },
        { cardId: "OP01-051", rested: true, attachedDon: 1 },
      ],
      hand: [],
    },
    { leaderCardId: "OP09-081", character: [{ cardId: "OP09-093", playedOnTurn: 3 }] },
    { activeSeat: "north", turnNumber: 3 },
  );
}
test("negating one named-restriction source leaves only the other permitted target", () => {
  const e = setup(),
    john = e.findCardInZone("south", "character", "OP17-044"),
    kid = e.findCardInZone("south", "character", "OP01-051");
  e.asNorth().activateMain("OP09-093");
  e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");
  e.resolveDecision("effectTargetSelection", { selectedIds: [john] }, "north");
  expect(
    getLegalCommands(e.getState(), "north").find(
      (c) => c.type === "declareAttack" && c.sourceId === e.leader("north"),
    )?.targetIds,
  ).toEqual([kid]);
  expect(() => e.asNorth().attack(e.leader("north"), john)).toThrow();
  expect(() => e.asNorth().attack(e.leader("north"), e.leader("south"))).toThrow();
  e.asNorth().attack(e.leader("north"), kid);
  expect(e.getView("north").players.north.leader?.rested).toBe(true);
});

test.each(["cannotAttack", "mustAttack"] as const)(
  "independent %s still limits the union of named targets",
  (restriction) => {
    // Synthetic additional prohibition isolates rule composition; printed John/Kid provide the union.
    const card = getCard("OP17-044"),
      original = card.effects;
    card.effects = {
      ...original,
      permanentEffects: [
        ...(original?.permanentEffects ?? []),
        {
          actions: [
            {
              action: "attackRestriction",
              restriction,
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                filters: [{ filter: "name", value: "Captain John" }],
              },
              duration: "permanent",
            },
          ],
        },
      ],
    };
    try {
      const e = setup(),
        john = e.findCardInZone("south", "character", "OP17-044"),
        kid = e.findCardInZone("south", "character", "OP01-051");
      const forbidden = restriction === "cannotAttack" ? john : kid,
        allowed = restriction === "cannotAttack" ? kid : john;
      expect(() => e.asNorth().attack(e.leader("north"), forbidden)).toThrow();
      e.asNorth().attack(e.leader("north"), allowed);
      expect(e.getView("north").players.north.leader?.rested).toBe(true);
    } finally {
      card.effects = original;
    }
  },
);

test("advertised named targets include both rested alternatives but exclude an active named copy", () => {
  const e = OnePieceTestEngine.create(
    {
      leaderCardId: "OP17-039",
      character: [
        { cardId: "OP17-044", rested: false },
        { cardId: "OP17-044", rested: true },
        { cardId: "OP01-051", rested: true, attachedDon: 1 },
      ],
    },
    {},
    { activeSeat: "north" },
  );
  const [active, rested, kid] = e
    .getView("south")
    .players.south.characters.flatMap((c) => (c ? [c.instanceId] : []));
  const attack = getLegalCommands(e.getState(), "north").find(
    (c) => c.type === "declareAttack" && c.sourceId === e.leader("north"),
  );
  expect(attack?.targetIds).toEqual([rested, kid]);
  expect(() => e.asNorth().attack(e.leader("north"), active!)).toThrow();
  e.asNorth().attack(e.leader("north"), rested!);
  expect(e.getView("north").players.north.leader?.rested).toBe(true);
});
