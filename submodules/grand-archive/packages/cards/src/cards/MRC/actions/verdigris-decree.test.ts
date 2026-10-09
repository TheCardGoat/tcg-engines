import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { verdigrisDecree } from "./verdigris-decree.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 7cx66hjlgx-a1 */
describe("Verdigris Decree — Imbue", () => {
  proveImbueKeyword({
    card: verdigrisDecree,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
  });
});

describe("Verdigris Decree — independent mode targets", () => {
  it("suppresses one ally and increases another ally's power", () => {
    const champion = createClassBonusTestChampion(verdigrisDecree, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { hand: Array.from({ length: 4 }, () => verdigrisDecree), field: [giantTortoise] },
      },
      playerTwo: { champion, zones: { field: [giantTortoise] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const [source, ...payments] = p.cards(verdigrisDecree, { zone: "hand" });
    const own = p.card(giantTortoise),
      foe = q.card(giantTortoise);
    const power = () =>
      deriveGrandArchiveNumericProperty(game.state.objects[own.objectId]!, "power", {
        program: game.program,
        state: game.state,
        controllerId: p.id,
        bindings: {},
      });
    const before = power();
    if (before === undefined) throw new Error("The target ally must have a power stat");
    p.activate(source!, {
      modeIds: ["mode-1", "mode-2"],
      revealForImbue: true,
      reservePayment: payments.map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-1": [foe.objectId], "mode-2:target-1": [own.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[foe.objectId]!.zone).toBe("banishment");
    expect(game.state.objects[own.objectId]!.zone).toBe("field");
    expect(power()).toBe(before + 2);
  });
});
