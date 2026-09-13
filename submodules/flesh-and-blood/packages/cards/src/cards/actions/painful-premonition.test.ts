import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { painfulPremonitionRed } from "./painful-premonition.ts";

describe("Painful Premonition (PEN114) AAA", () => {
  it("happy: deals 3 arcane and creates a Sigil of Fate when it deals damage", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [painfulPremonitionRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(painfulPremonitionRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Blaze.zone("arena")).toContain("token:sigil-of-fate");
    expectFabCard(Blaze, painfulPremonitionRed).toBeIn("graveyard");
  });

  it("boundary: if the packet is prevented, no Sigil of Fate is created", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [painfulPremonitionRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], head: [nullruneHood], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(painfulPremonitionRed, { target: Dash.id });
    game.passBoth();
    const option = Dash.expectDecision("option");
    Dash.chooseOptions(option.options[0]!.id);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(18);
    expect(Blaze.zone("arena")).toContain("token:sigil-of-fate");
  });

  it("timing: a later arcane packet does not create a second Sigil", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [painfulPremonitionRed, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(painfulPremonitionRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expect(Blaze.zone("arena").filter((id) => id === "token:sigil-of-fate")).toHaveLength(1);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expect(Blaze.zone("arena").filter((id) => id === "token:sigil-of-fate")).toHaveLength(1);
    expectFabPlayer(Dash).toHaveLife(12);
  });
});
