import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { arcaneSeedsLifeRed } from "./arcane-seeds-life.ts";

describe("Arcane Seeds // Life (FLR013) AAA", () => {
  it("happy: Life face gains 1{h} as an instant and spends no action point", () => {
    const game = FabTestEngine.start(
      { hero: briar, life: 20, hand: [arcaneSeedsLifeRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(arcaneSeedsLifeRed, { playMethod: { kind: "face", face: "right" } });
    game.passBoth();

    expectFabPlayer(Briar).toHaveLife(21);
    expectFabPlayer(Briar).toHaveAP(1);
    expect(Briar.zone("arena")).not.toContain("token:runechant");
    expectFabCard(Briar, arcaneSeedsLifeRed).toBeIn("graveyard");
  });

  it("boundary: Seeds face creates two Runechant tokens, spends AP, and refunds it with go again", () => {
    const game = FabTestEngine.start(
      { hero: briar, life: 20, hand: [arcaneSeedsLifeRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(arcaneSeedsLifeRed, { playMethod: { kind: "face", face: "left" } });
    game.passBoth();

    expect(Briar.zone("arena").filter((id) => id === "token:runechant")).toHaveLength(2);
    expectFabPlayer(Briar).toHaveLife(20);
    expectFabPlayer(Briar).toHaveAP(1);
  });
});
