import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { cardiacVessel } from "../../PRD/phantasias/cardiac-vessel.ts";
import { tristanShadowdancer } from "./tristan-shadowdancer.ts";

/** @covers he6kd7hocc-a1 */
describe("Tristan, Shadowdancer — Lineage restriction", () => {
  proveChampionLineage({
    card: tristanShadowdancer,
    lineageName: "Tristan",
    level: 3,
    memoryCost: 3,
  });
});
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { ominousShadow } from "../../EVP/tokens/ominous-shadow.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { setTheTraps } from "../../DOA/actions/set-the-traps.ts";

/** @covers he6kd7hocc-a2 */
it("Tristan summons two Ominous Shadows and gains preparation when leveled up", () => {
  const starter = enableAllTestElements(lineageTestChampion("Tristan", 0));
  const game = GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    definitions: [ominousShadow],
    playerOne: {
      champion: starter,
      lineage: [
        lineageTestChampion("Tristan", 1),
        enableAllTestElements(lineageTestChampion("Tristan", 2)),
      ],
      zones: {
        "material-deck": [tristanShadowdancer],
        memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion: starter },
  });
  const p = game.player("player-one"),
    hero = p.card(starter);
  p.materialize(tristanShadowdancer);
  passEffectsStack(game);
  expect(game.state.objects[hero.objectId]?.activeDefinitionId).toBe(
    tristanShadowdancer.canonicalId,
  );
  expect(game.state.objects[hero.objectId]?.counters.preparation).toBe(1);
  const shadows = p.cards(ominousShadow, { zone: "field" });
  expect(shadows).toHaveLength(2);
  for (const shadow of shadows) {
    expect(game.state.objects[shadow.objectId]?.isToken).toBe(true);
    expect(game.state.objects[shadow.objectId]?.controllerId).toBe(p.id);
    expect(game.state.objects[shadow.objectId]?.states.has("rested")).toBe(false);
  }
  expect(game.state.stack).toHaveLength(0);
  expect(game.state.decision).toBeNull();
});

/** @covers he6kd7hocc-a3 */
describe("Tristan — paid redirection to a controlled phantasia ally", () => {
  for (const preparation of [0, 1, 2, 3])
    for (const attacked of ["hero", "ally", "none"] as const)
      for (const hasShadow of [false, true])
        it(`preparation=${preparation}, attacked=${attacked}, own shadow=${hasShadow}`, () => {
          const starter = enableAllTestElements(lineageTestChampion("Tristan", 0));
          const game = GrandArchiveTestEngine.startFixture({
            definitions: [ominousShadow],
            playerOne: {
              champion: starter,
              lineage: [enableAllTestElements(tristanShadowdancer)],
              zones: {
                hand: [
                  ...Array.from({ length: preparation }, () => setTheTraps),
                  ...Array.from({ length: 8 }, () => woodlandSquirrels),
                ],
                field: [giantTortoise, cardiacVessel, ...(hasShadow ? [ominousShadow] : [])],
                "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion: starter,
              zones: {
                field: [giantTortoise, ominousShadow],
                "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(starter);
          for (const action of p.cards(setTheTraps, { zone: "hand" })) {
            p.activate(action, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 2)
                .map((c) => ({ kind: "card", cardId: c.objectId })),
              targets: { "target-player": [q.id] },
            });
            passEffectsStack(game);
          }
          expect(game.state.objects[hero.objectId]?.counters.preparation ?? 0).toBe(preparation);
          advanceToMain(game, q.id);
          const original = attacked === "hero" ? hero : p.card(giantTortoise);
          if (attacked !== "none") q.declareAttack(q.card(giantTortoise), original);
          q.pass();
          const before = game.state;
          if (preparation < 2) {
            expect(() => p.activateAbility(hero, "he6kd7hocc-a3")).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          p.activateAbility(hero, "he6kd7hocc-a3");
          expect(game.state.objects[hero.objectId]?.counters.preparation ?? 0).toBe(
            preparation - 2,
          );
          if (attacked !== "none")
            expect(game.state.combat?.targetIds).toEqual([original.objectId]);
          passEffectsStack(game);
          if (attacked === "hero" && hasShadow) {
            const ready = game.state;
            for (const invalid of [
              [],
              [hero.objectId],
              [p.card(giantTortoise).objectId],
              [p.card(cardiacVessel).objectId],
              [q.card(ominousShadow).objectId],
            ]) {
              expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
              expect(game.state).toEqual(ready);
            }
            const shadow = p.card(ominousShadow);
            answerDecision(game, "resolve-effect-choice", [shadow.objectId]);
            passEffectsStack(game);
            expect(game.state.combat?.targetIds).toEqual([shadow.objectId]);
          } else if (attacked !== "none")
            expect(game.state.combat?.targetIds).toEqual([original.objectId]);
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
          if (attacked !== "none") game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[hero.objectId]?.damage).toBe(
            attacked === "hero" && !hasShadow ? 1 : 0,
          );
        });
});
