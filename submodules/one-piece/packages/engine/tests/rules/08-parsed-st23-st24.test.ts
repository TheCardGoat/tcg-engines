import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

function parsed(id: string, run: () => void) {
  const card = getCard(id);
  const original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    run();
  } finally {
    card.effects = original;
  }
}

test.each(["OP09-001", "ST05-001", "ST01-001"])(
  "parsed Shanks Leader gate and discount for %s",
  (leaderCardId) =>
    parsed("ST23-002", () => {
      const e = OnePieceTestEngine.create(
        { leaderCardId, hand: ["ST23-002"], activeDon: 6 },
        { character: ["ST15-002"] },
      );
      e.playCard("ST23-002");
      const power = leaderCardId === "ST01-001" ? 5000 : 7000;
      expect(e.getView("south").players.south.leader.power).toBe(power);
      expect(e.getView("south").players.south.activeDon).toBe(0);
      expect(e.getView("south").players.south.characters[0]?.cost).toBe(9);
      e.asSouth().endTurn();
      expect(e.getView("south").players.south.leader.power).toBe(power);
      e.asNorth().endTurn();
      expect(e.getView("south").players.south.leader.power).toBe(5000);
    }),
);

test("parsed Shanks discount uses base power despite opponent power loss", () =>
  parsed("ST23-002", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST23-002", "ST21-017"], activeDon: 10 },
      { character: ["ST15-002"] },
    );
    e.playCard("ST21-017");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST15-002"));
    expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
    e.playCard("ST23-002");
    expect(e.getView("south").players.south.activeDon).toBe(0);
  }));

test("parsed Shanks ignores a qualifying Character controlled by its owner", () =>
  parsed("ST23-002", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST23-002"],
      activeDon: 6,
      character: ["ST15-002"],
    });
    expect(
      e.expectFailure({
        type: "playCard",
        seat: "south",
        instanceId: e.findCardInZone("south", "hand", "ST23-002"),
      }).reason,
    ).toBeTruthy();
    expect(e.getView("south").players.south.activeDon).toBe(6);
  }));

test.each([false, true])(
  "parsed Law & Bepo binds freeze to the selected Character, already rested=%s",
  (rested) =>
    parsed("ST24-004", () => {
      const e = OnePieceTestEngine.create(
        { hand: ["ST24-004"], activeDon: 10 },
        {
          character: [
            { cardId: "ST21-005", rested },
            { cardId: "ST21-006", rested: true },
          ],
        },
      );
      const selected = e.findCardInZone("north", "character", "ST21-005");
      e.playCard("ST24-004");
      e.asSouth().chooseTargets(selected);
      expect(e.getView("south").prompts).toHaveLength(0);
      expect(e.getView("south").players.south.leader.power).toBe(7000);
      e.asSouth().endTurn();
      expect(e.getView("north").players.north.characters[0]).toMatchObject({
        instanceId: selected,
        rested: true,
      });
      expect(e.getView("north").players.north.characters[1]?.rested).toBe(false);
      expect(e.getView("south").players.south.leader.power).toBe(7000);
      e.asNorth().endTurn();
      expect(e.getView("south").players.south.leader.power).toBe(5000);
    }),
);

test.each([1, 2])(
  "parsed Law & Bepo zero choice still checks %s already rested opponents",
  (count) =>
    parsed("ST24-004", () => {
      const e = OnePieceTestEngine.create(
        { hand: ["ST24-004"], activeDon: 10 },
        {
          character:
            count === 1
              ? [{ cardId: "ST21-005", rested: true }]
              : [
                  { cardId: "ST21-005", rested: true },
                  { cardId: "ST21-006", rested: true },
                ],
        },
      );
      e.playCard("ST24-004");
      e.asSouth().chooseNoTargets();
      expect(e.getView("south").players.south.leader.power).toBe(count === 2 ? 7000 : 5000);
      e.asSouth().endTurn();
      expect(e.getView("north").players.north.characters.every((c) => !c || !c.rested)).toBe(true);
    }),
);
