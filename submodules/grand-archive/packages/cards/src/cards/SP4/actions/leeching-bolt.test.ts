import { describe } from "vitest";
import { leechingBolt } from "./leeching-bolt.ts";
import { proveLeveledDamageRecovery } from "../../../testing/leveled-damage-recovery.ts";
/**
 * @covers hs1mzjzexc-a1
 * @covers hs1mzjzexc-a2
 */
describe("Leeching Bolt — LV damage, fixed recovery, and Class Bonus empowered preservation", () => {
  proveLeveledDamageRecovery(leechingBolt, 2, "fixed-two", true);
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { heightenSpellcraft } from "../../P24/actions/heighten-spellcraft.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
/** @covers hs1mzjzexc-a2 */
it("returns the revealed preserved card instead of the next materialization", () => {
  const champion = enableAllTestElements(
    createClassBonusTestChampion(leechingBolt, true, "activation-discount"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [
          leechingBolt,
          heightenSpellcraft,
          woodlandSquirrels,
          woodlandSquirrels,
          woodlandSquirrels,
        ],
        "material-deck": [trainingSword],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const source = p.card(leechingBolt, { zone: "hand" });
  const pay = (n: number) =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  p.activate(heightenSpellcraft, { reservePayment: pay(1) });
  passEffectsStack(game);
  p.activate(source, {
    reservePayment: pay(2),
    targets: { "target-1": [q.card(champion).objectId] },
  });
  passEffectsStack(game);
  expect(game.state.objects[source.objectId]).toMatchObject({
    zone: "material-deck",
    facing: "face-up",
  });
  const opponentView = q.view().players.find((player) => player.id === p.id)!.zones[
    "material-deck"
  ];
  if (opponentView.visibility !== "hidden")
    throw new Error("Material deck must remain a private zone");
  expect(opponentView.revealedObjects.map((card) => card.id)).toEqual([source.objectId]);
  const before = game.state;
  expect(() => p.execute({ move: "return-preserved-card", cardId: source.objectId })).toThrow();
  expect(game.state).toEqual(before);
  const initialTurn = game.state.turn.number;
  for (let step = 0; step < 128; step++) {
    const wait = game.waitState();
    if (
      wait.kind === "materialization-choice" &&
      wait.playerId === p.id &&
      game.state.turn.number > initialTurn
    )
      break;
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected wait ${wait.kind}`);
  }
  const atChoice = game.state;
  expect(() => q.execute({ move: "return-preserved-card", cardId: source.objectId })).toThrow();
  expect(game.state).toEqual(atChoice);
  p.execute({ move: "return-preserved-card", cardId: source.objectId });
  expect(game.state.objects[source.objectId]).toMatchObject({ zone: "hand", facing: "face-down" });
  expect(game.state.objects[source.objectId]?.states.has("preserved")).toBe(false);
  const returned = game.state;
  expect(() => p.materialize(trainingSword)).toThrow();
  expect(game.state).toEqual(returned);
});
