import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { sovereignSanctuary } from "../phantasias/sovereign-sanctuary.ts";
import { unforgottenWill } from "../../RDO/actions/unforgotten-will.ts";
import { brusqueNeige } from "./brusque-neige.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

function fixture(name = "Other", level = 0, opposingTurn = false) {
  return GrandArchiveTestEngine.startFixture({
    firstPlayer: opposingTurn ? "playerTwo" : "playerOne",
    playerOne: {
      champion: enableAllTestElements(lineageTestChampion(name, 0)),
      lineage: Array.from({ length: level }, (_, i) =>
        enableAllTestElements(lineageTestChampion(name, i + 1)),
      ),
      zones: {
        hand: [brusqueNeige, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
        field: [woodlandSquirrels, woodlandSquirrels, trainingSword],
        graveyard: [woodlandSquirrels],
        "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: enableAllTestElements(lineageTestChampion("Ciel", 0)),
      zones: {
        hand: [woodlandSquirrels, woodlandSquirrels],
        field: [woodlandSquirrels],
        "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
      },
    },
  });
}
function pay(game: GrandArchiveTestEngine) {
  const p = game.player("player-one");
  return p
    .cards(woodlandSquirrels, { zone: "hand" })
    .slice(0, 2)
    .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
}

/** @covers irt72g89zc-a1 */
describe("Brusque Neige — optional sacrifice cost", () => {
  for (const alternative of [false, true])
    it(`sacrifice=${alternative} pays upfront`, () => {
      const game = fixture(),
        p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(brusqueNeige),
        allies = p.cards(woodlandSquirrels, { zone: "field" });
      const initial = game.state;
      if (alternative) {
        const invalid = [
          [],
          [q.card(woodlandSquirrels, { zone: "field" }).objectId],
          [p.card(trainingSword).objectId],
          [p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId],
          [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
          allies.map((c) => c.objectId),
          [allies[0]!.objectId, allies[0]!.objectId],
        ];
        for (const selection of invalid) {
          expect(() =>
            p.activate(source, { costOptionIndex: 1, costSelections: [selection] }),
          ).toThrow();
          expect(game.state).toEqual(initial);
        }
        p.activate(source, { costOptionIndex: 1, costSelections: [[allies[0]!.objectId]] });
      } else {
        expect(() => p.activate(source, { reservePayment: pay(game).slice(0, 1) })).toThrow();
        expect(game.state).toEqual(initial);
        p.activate(source, { reservePayment: pay(game) });
      }
      expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
      expect(game.state.objects[allies[0]!.objectId]!.zone).toBe(
        alternative ? "graveyard" : "field",
      );
      expect(p.zone("memory")).toHaveLength(alternative ? 0 : 2);
      expect(p.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(alternative ? 6 : 4);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
    });
});

/** @covers irt72g89zc-a3 */
describe("Brusque Neige — Ciel level restriction and omen", () => {
  for (const name of ["Other", "Ciel"])
    for (const level of [0, 1, 2, 3])
      it(`${name}, level=${level}`, () => {
        const game = fixture(name, level),
          p = game.player("player-one"),
          source = p.card(brusqueNeige);
        p.activate(source, { reservePayment: pay(game) });
        expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
        expect(game.state.objects[source.objectId]!.counters.omen ?? 0).toBe(0);
        passEffectsStack(game);
        const qualifies = name === "Ciel" && level >= 2;
        expect(game.state.objects[source.objectId]!.zone).toBe(
          qualifies ? "banishment" : "graveyard",
        );
        expect(game.state.objects[source.objectId]!.counters.omen ?? 0).toBe(qualifies ? 1 : 0);
        expect(p.zone("memory")).toHaveLength(2);
      });
});

/** @covers irt72g89zc-a2 */
describe("Brusque Neige — allies enter rested until end of turn", () => {
  for (const name of ["Other", "Ciel"])
    it(`effect persists after source goes to ${name === "Ciel" ? "banishment" : "graveyard"}`, () => {
      const game = fixture(name, 2),
        p = game.player("player-one"),
        q = game.player("player-two");
      const existing = [
        ...p.cards(woodlandSquirrels, { zone: "field" }),
        q.card(woodlandSquirrels, { zone: "field" }),
      ];
      const beforeEntry = p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
      p.activate(beforeEntry);
      passEffectsStack(game);
      expect(game.state.objects[beforeEntry.objectId]!.states.has("rested")).toBe(false);
      p.activate(brusqueNeige, { reservePayment: pay(game) });
      passEffectsStack(game);
      for (const card of [...existing, beforeEntry])
        expect(game.state.objects[card.objectId]!.states.has("rested")).toBe(false);
      const during = p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
      p.activate(during);
      passEffectsStack(game);
      expect(game.state.objects[during.objectId]!.states.has("rested")).toBe(true);
      advanceToMain(game, q.id);
      const after = q.cards(woodlandSquirrels, { zone: "hand" })[0]!;
      q.activate(after);
      passEffectsStack(game);
      expect(game.state.objects[after.objectId]!.states.has("rested")).toBe(false);
      expect(game.state.objects[during.objectId]!.states.has("rested")).toBe(true);
      advanceToMain(game, p.id);
      expect(game.state.objects[during.objectId]!.states.has("rested")).toBe(false);
    });
});

/** @covers irt72g89zc-a2 */
it("rests an opposing ally already on the stack when the fast action resolves", () => {
  const game = fixture("Other", 0, true),
    p = game.player("player-one"),
    q = game.player("player-two");
  const ally = q.cards(woodlandSquirrels, { zone: "hand" })[0]!;
  q.activate(ally);
  q.pass();
  p.activate(brusqueNeige, { reservePayment: pay(game) });
  expect(game.state.objects[ally.objectId]!.zone).toBe("effects-stack");
  passEffectsStack(game);
  expect(game.state.objects[ally.objectId]!.zone).toBe("field");
  expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
  advanceToMain(game, p.id);
  const next = p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
  p.activate(next);
  passEffectsStack(game);
  expect(game.state.objects[next.objectId]!.states.has("rested")).toBe(false);
});

/** @covers irt72g89zc-a2 */
it("does not rest a non-ally permanent entering during the effect", () => {
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: enableAllTestElements(lineageTestChampion("Other", 0)),
      zones: {
        hand: [
          brusqueNeige,
          sovereignSanctuary,
          ...Array.from({ length: 5 }, () => woodlandSquirrels),
        ],
      },
    },
    playerTwo: { champion: lineageTestChampion("Opponent", 0) },
  });
  const p = game.player("player-one");
  p.activate(brusqueNeige, { reservePayment: pay(game) });
  passEffectsStack(game);
  const sanctuary = p.card(sovereignSanctuary);
  p.activate(sanctuary, {
    reservePayment: p
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
  });
  passEffectsStack(game);
  expect(game.state.objects[sanctuary.objectId]!.zone).toBe("field");
  expect(game.state.objects[sanctuary.objectId]!.states.has("rested")).toBe(false);
});

it("preserves the same source-bound omen instruction inside an if-you-do sequence", () => {
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: lineageTestChampion("Owner", 0),
      zones: {
        hand: [unforgottenWill, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion: lineageTestChampion("Opponent", 0) },
  });
  const p = game.player("player-one"),
    source = p.card(unforgottenWill);
  p.activate(source, {
    reservePayment: p
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
  });
  expect(p.zone("memory")).toHaveLength(3);
  expect(p.zone("main-deck")).toHaveLength(2);
  passEffectsStack(game);
  expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
  expect(game.state.objects[source.objectId]!.counters.omen).toBe(1);
  expect(p.zone("memory")).toHaveLength(4);
  expect(p.zone("main-deck")).toHaveLength(1);
});
