import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { vexingQuillhand } from "./vexing-quillhand.ts";

describe("Vexing Quillhand (EVR103) AAA", () => {
  it("happy: destroy this to create 2 Runechants and keep an action point", () => {
    const game = FabTestEngine.start(
      { hero: viserai, arms: [vexingQuillhand], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.activate(vexingQuillhand);
    game.helpers.resolveUntilIdle();

    expectFabCard(Viserai, vexingQuillhand).toBeIn("graveyard");
    expect(Viserai.zone("arena").filter((id) => id === "token:runechant")).toHaveLength(2);
    expectFabPlayer(Viserai).toHaveAP(1);
  });

  it("boundary: Arcane Barrier still prevents 1 of Voltic Bolt", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: viserai, life: 20, resourcePoints: 1, arms: [vexingQuillhand], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    game.as(blazeFiremind).play(volticBoltRed, { target: Viserai.id });
    game.passBoth();
    const choice = Viserai.expectDecision("option");
    Viserai.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Viserai).toHaveLife(16);
    expectFabCard(Viserai, vexingQuillhand).toBeIn("arms");
  });
});
