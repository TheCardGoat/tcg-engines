import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { maxxNitro } from "../heroes/maxx-nitro.ts";
import { banksy } from "../weapons/banksy.ts";
import { hyperDriver } from "../tokens/hyper-driver.ts";
import { constructBankBreakerYellow } from "./construct-bank-breaker.ts";
import { loadFleshAndBloodStructuredCards } from "../../runtime-registry.ts";

const runtimeConstructBankBreakerYellow = (
  await loadFleshAndBloodStructuredCards([constructBankBreakerYellow.canonicalId])
).get(constructBankBreakerYellow.canonicalId)!;

describe("Construct Bank Breaker (AMX022) AAA", () => {
  it("happy: transforms an equipped wrench and 3 Hyper Drivers into Bank Breaker", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        weapon1: [banksy],
        arena: [
          { card: hyperDriver, state: { steamCounters: 1 } },
          { card: hyperDriver, state: { steamCounters: 1 } },
          { card: hyperDriver, state: { steamCounters: 1 } },
        ],
        hand: [runtimeConstructBankBreakerYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    Maxx.play(runtimeConstructBankBreakerYellow);
    game.passBoth();

    expect(Maxx.zone("arena")).toContain(constructBankBreakerYellow.canonicalId);
    expect(Maxx.zone("weapon1")).not.toContain(banksy.canonicalId);
    expect(Maxx.zone("arena")).not.toContain(hyperDriver.canonicalId);
    expectFabPlayer(Maxx).toHaveAP(1);
  });

  it("boundary: without a wrench the construct still plays and the transform fails", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        arena: [
          { card: hyperDriver, state: { steamCounters: 1 } },
          { card: hyperDriver, state: { steamCounters: 1 } },
          { card: hyperDriver, state: { steamCounters: 1 } },
        ],
        hand: [runtimeConstructBankBreakerYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    Maxx.play(runtimeConstructBankBreakerYellow);
    game.passBoth();

    expect(Maxx.zone("hand")).not.toContain(constructBankBreakerYellow.canonicalId);
    expect(Maxx.zone("arena")).toContain(hyperDriver.canonicalId);
    expect(Maxx.zone("weapon1")).not.toContain(constructBankBreakerYellow.canonicalId);
  });

  it("timing: go again refunds the Action AP when the transform is incomplete", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        hand: [runtimeConstructBankBreakerYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    Maxx.play(runtimeConstructBankBreakerYellow);
    game.passBoth();

    expectFabPlayer(Maxx).toHaveAP(1);
  });
});
