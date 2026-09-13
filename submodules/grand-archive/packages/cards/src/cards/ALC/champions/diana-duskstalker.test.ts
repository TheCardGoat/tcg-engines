import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fiveOfDiamonds } from "../../RDO/allies/five-of-diamonds.ts";
import { creepingTorment } from "../phantasias/creeping-torment.ts";
import { sealedBladeDoa } from "../../DOA/weapons/sealed-blade-doa.ts";
import { dianaDuskstalker } from "./diana-duskstalker.ts";

/** @covers iq4d5vettc-a1 */
describe("diana-duskstalker — Lineage", () => {
  proveChampionLineage({ card: dianaDuskstalker, lineageName: "Diana", level: 3, memoryCost: 3 });
});

function fixture(withAlly: boolean) {
  const starter = lineageTestChampion("Diana", 0);
  const opponentChampion = lineageTestChampion("Opponent", 0);
  const game = GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    playerOne: {
      champion: starter,
      lineage: [lineageTestChampion("Diana", 1), lineageTestChampion("Diana", 2)],
      zones: {
        "material-deck": [dianaDuskstalker],
        memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        field: [sealedBladeDoa],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: opponentChampion,
      zones: {
        field: withAlly ? [fiveOfDiamonds] : undefined,
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    definitions: [creepingTorment],
  });
  return { game, starter, opponentChampion };
}

function materializeAndReachMain(game: GrandArchiveTestEngine): void {
  const player = game.player("player-one");
  player.materialize(dianaDuskstalker);
  player.pass();
  game.player("player-two").pass();
  passEffectsStack(game);
  for (let step = 0; step < 64; step++) {
    if (game.state.turn.phase === "main") return;
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  throw new Error("Did not reach main phase");
}

/** @covers iq4d5vettc-a2 */
describe("Diana, Duskstalker — On Enter distant", () => {
  it("becomes distant only when the separate entry trigger resolves", () => {
    const { game, starter } = fixture(false);
    const player = game.player("player-one");
    const champion = player.card(starter, { zone: "field" });
    player.materialize(dianaDuskstalker);
    player.pass();
    game.player("player-two").pass();
    expect(game.state.objects[champion.objectId]!.states.has("distant")).toBe(false);
    expect(game.state.stack.some((item) => item.kind === "triggered-ability")).toBe(true);
    passEffectsStack(game);
    expect(game.state.objects[champion.objectId]!.states.has("distant")).toBe(true);
  });
});

/** @covers iq4d5vettc-a3 */
describe("Diana, Duskstalker — champion-hit Creeping Torment", () => {
  it("generates the card on the bottom of the hit champion's lineage", () => {
    const { game, starter, opponentChampion } = fixture(false);
    materializeAndReachMain(game);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const attacker = player.card(starter, { zone: "field" });
    const target = opponent.card(opponentChampion, { zone: "field" });
    player.declareAttack(attacker, target, {
      weaponIds: [player.card(sealedBladeDoa, { zone: "field" }).objectId],
    });
    advanceCombatToTrigger(game, "iq4d5vettc-a3");
    expect(player.cards(creepingTorment, { zone: "inner-lineage" })).toHaveLength(0);
    expect(game.state.stack.some((item) => item.kind === "triggered-ability")).toBe(true);
    passEffectsStack(game);
    const generated = player.card(creepingTorment, { zone: "inner-lineage" });
    expect(game.state.objects[generated.objectId]!.hostId).toBe(target.objectId);
    expect(player.zone("inner-lineage").at(-1)).toEqual(generated);
  });

  it("does not trigger when Diana hits an ally", () => {
    const { game, starter } = fixture(true);
    materializeAndReachMain(game);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.declareAttack(
      player.card(starter, { zone: "field" }),
      opponent.card(fiveOfDiamonds, { zone: "field" }),
      { weaponIds: [player.card(sealedBladeDoa, { zone: "field" }).objectId] },
    );
    advanceCombatToTrigger(game, "iq4d5vettc-a3");
    expect(game.state.stack).toHaveLength(0);
    expect(opponent.cards(creepingTorment, { zone: "inner-lineage" })).toHaveLength(0);
  });
});
