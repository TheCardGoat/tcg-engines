import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { goodDeedsDonTGoUnnoticedYellow } from "./good-deeds-don-t-go-unnoticed.ts";

const giftModeId = (modeId: string): string =>
  `${goodDeedsDonTGoUnnoticedYellow.canonicalId}:atStartEachOtherHeroSTurnChoose1:${modeId}`;

describe("Good Deeds Don't Go Unnoticed (LSS006) AAA", () => {
  it("happy: plays as an aura into the arena", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [goodDeedsDonTGoUnnoticedYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(goodDeedsDonTGoUnnoticedYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, goodDeedsDonTGoUnnoticedYellow).toBeIn("arena");
    expectFabPlayer(Dash).toHaveAP(0);
  });

  it("boundary: it cannot be played without an action point", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [goodDeedsDonTGoUnnoticedYellow], actionPoints: 0, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(goodDeedsDonTGoUnnoticedYellow)).toThrow();
    expectFabCard(game.as(dash), goodDeedsDonTGoUnnoticedYellow).toBeIn("hand");
  });

  it("timing: playing it does not open combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [goodDeedsDonTGoUnnoticedYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).play(goodDeedsDonTGoUnnoticedYellow);
    game.helpers.resolveUntilIdle();
    expectCombat(game).toBeClosed();
  });

  // ── Gift + mirror AAA (abilities authored in W0-A) ────────────────────────────

  it("happy: draw gift for the opponent mirrors into a controller draw at the next turn start", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [goodDeedsDonTGoUnnoticedYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(goodDeedsDonTGoUnnoticedYellow);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();

    // Opponent's turn starts: the aura controller (Dash) chooses the gift.
    const gift = game.pendingDecision();
    expect(gift?.kind).toBe("option");
    if (gift?.kind === "option") {
      const draw = gift.options.find((option) => option.id === giftModeId("theyDraw"));
      Dash.chooseOptions(draw!.id);
    }
    game.helpers.resolveUntilIdle();

    // Intellect refill (4) happens before the gifted draw lands.
    expectFabPlayer(Bravo).toHaveHandCount(5);

    Bravo.endTurn();
    // Dash's turn start: self-destroy and the delayed mirror are simultaneous
    // triggers, so the harness demands an explicit ordering answer.
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Dash, goodDeedsDonTGoUnnoticedYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(5);
  });

  it("happy: life gift for the opponent mirrors into a controller life gain", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [goodDeedsDonTGoUnnoticedYellow], actionPoints: 1, deck: 6, life: 20 },
      { hero: bravo, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(goodDeedsDonTGoUnnoticedYellow);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();

    const gift = game.pendingDecision();
    expect(gift?.kind).toBe("option");
    if (gift?.kind === "option") {
      const life = gift.options.find((option) => option.id === giftModeId("theyGain1"));
      Dash.chooseOptions(life!.id);
    }
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveLife(21);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Dash, goodDeedsDonTGoUnnoticedYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(21);
  });

  it("boundary: resource gift grants the opponent 1{r} and mirrors 1{r} without any draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [goodDeedsDonTGoUnnoticedYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(goodDeedsDonTGoUnnoticedYellow);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();

    const gift = game.pendingDecision();
    expect(gift?.kind).toBe("option");
    if (gift?.kind === "option") {
      const resources = gift.options.find((option) => option.id === giftModeId("theyGain"));
      Dash.chooseOptions(resources!.id);
    }
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveResourceCount(1);
    // The {r} gift does not draw: hand is exactly the intellect refill.
    expectFabPlayer(Bravo).toHaveHandCount(4);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Dash, goodDeedsDonTGoUnnoticedYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(1);
    // Intellect refill only — the {r} mirror must not draw a card.
    expectFabPlayer(Dash).toHaveHandCount(4);
  });

  it("timing: next-attack gift buffs the opponent's first attack that turn and mirrors onto the controller's next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [goodDeedsDonTGoUnnoticedYellow, brutalAssaultBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(goodDeedsDonTGoUnnoticedYellow);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();

    const gift = game.pendingDecision();
    expect(gift?.kind).toBe("option");
    if (gift?.kind === "option") {
      const power = gift.options.find(
        (option) => option.id === giftModeId("theirNextAttackTurnGains1"),
      );
      Dash.chooseOptions(power!.id);
    }
    game.helpers.resolveUntilIdle();

    Bravo.playAttack(brutalAssaultBlue, { pitch: [nimblismBlue] });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline" });

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Dash, goodDeedsDonTGoUnnoticedYellow).toBeIn("graveyard");

    Dash.playAttack(brutalAssaultBlue, { pitch: [nimblismBlue] });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline" });
  });
});
