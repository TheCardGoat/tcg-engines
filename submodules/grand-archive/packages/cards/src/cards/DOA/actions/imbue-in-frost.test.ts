import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "../../../testing/decisions.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { curvedDagger } from "../weapons/curved-dagger.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { imbueInFrost } from "./imbue-in-frost.ts";

/** @covers QQaOgurnjX-a2 */
describe("Imbue in Frost — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: imbueInFrost });
});

/** @covers QQaOgurnjX-a1 */
it("adds two power only to the controlled Sword for this turn", () => {
  const champion = createClassBonusTestChampion(imbueInFrost, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [imbueInFrost, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        field: [trainingSword, curvedDagger],
        "main-deck": [woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { field: [trainingSword], "main-deck": [woodlandSquirrels] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    sword = p.card(trainingSword);
  const payment = p
    .cards(woodlandSquirrels, { zone: "hand" })
    .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  for (const target of [p.card(curvedDagger), q.card(trainingSword), p.card(champion)]) {
    const before = game.state;
    expect(() =>
      p.activate(imbueInFrost, {
        reservePayment: payment,
        targets: { "target-1": [target.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  }
  p.activate(imbueInFrost, { reservePayment: payment, targets: { "target-1": [sword.objectId] } });
  passEffectsStack(game);
  p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [sword.objectId] });
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
  advanceToMain(game, q.id);
  advanceToMain(game, p.id);
  p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [sword.objectId] });
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(4);
});
