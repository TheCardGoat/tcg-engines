import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { nimblismBlue } from "../actions/nimblism.ts";
import { dash } from "./dash.ts";
import { taylor } from "./taylor.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { ironrotLegs } from "../equipment/ironrot-legs.ts";
import { ironhideHelm } from "../equipment/ironhide-helm.ts";
import { nullruneBoots } from "../equipment/nullrune-boots.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";

/**
 * Taylor (LSS003) — Shapeshifter Hero — Young — 18hp.
 *
 * Printed: "You may have equipment of any class or talent in your inventory.
 * Each equipment in your starting inventory must have a different name.
 * At the start of your turn, you may banish an equipment you control. If you
 * do, equip a card of the same subtype from your inventory."
 *
 * The inventory rules are deckbuilding/table policy (out of engine scope).
 * Runtime cases below exercise the start-phase banish and dependent equip.
 * Full acceptance remains tracked in the campaign ledger.
 */

const opponentHero = dash;

describe("taylor (LSS003) AAA", () => {
  it("core mechanic: the start-phase banish offer is optional — declining keeps the equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: taylor,
        head: [ironrotHelm],
        inventory: [nullruneHood],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        hand: [],
      },
      {
        hero: opponentHero,
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Taylor = game.as(taylor);

    // Reach Taylor's next start phase, where the offer is presented.
    Taylor.endTurn();
    game.as(opponentHero).endTurn();

    game.advanceToDecision(Taylor, "boolean");
    Taylor.decline();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Nothing was banished: the helm is still equipped.
    expectFabCard(Taylor, ironrotHelm).toBeIn("head");
    expectFabPlayer(Taylor).toHaveLife(18);
  });

  it("boundary: the opponent's turn does not present Taylor's start-phase offer", () => {
    const game = FabTestEngine.start(
      {
        hero: taylor,
        head: [ironrotHelm],
        inventory: [nullruneHood],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        hand: [],
      },
      {
        hero: opponentHero,
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Taylor = game.as(taylor);

    Taylor.endTurn();

    // On the opponent's turn the opponent holds priority to act; the only
    // pending prompt belongs to the active player, not to Taylor's offer.
    expectWait(game).notToHaveDecision().toBeIdle();
    expectFabCard(Taylor, ironrotHelm).toBeIn("head");
    expectFabCard(Taylor, Taylor.cardIn("inventory", nullruneHood)).toBeIn("inventory");
  });
});

it("Taylor accepts the start-turn offer and swaps the banished Head for inventory Head", () => {
  const game = FabTestEngine.start(
    {
      hero: taylor,
      head: [ironrotHelm],
      inventory: [nullruneHood],
      hand: [],
      deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    },
    { hero: dash, hand: [], deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue] },
    FAB_MANUAL_HARNESS,
  );
  const Taylor = game.as(taylor);
  const hood = Taylor.cardIn("inventory", nullruneHood);
  Taylor.endTurn();
  game.as(dash).endTurn();
  game.advanceToDecision(Taylor, "boolean");
  Taylor.accept();
  game.untilIdle({ entityTargets: "pause" });
  if (game.pendingDecision()?.kind === "entity-target") {
    Taylor.target(ironrotHelm);
    game.untilIdle({ entityTargets: "pause" });
  }
  if (game.pendingDecision()?.kind === "entity-target") {
    Taylor.target(nullruneHood);
    game.untilIdle();
  }
  expectFabCard(Taylor, ironrotHelm).toBeIn("banished");
  expectFabCard(Taylor, hood).toBeIn("head");
  expectFabPlayer(Taylor).toHaveLife(18);
  expectWait(game).toBeIdle();
});

it("Taylor chooses one controlled equipment and only a matching own inventory Head", () => {
  const game = FabTestEngine.start(
    {
      hero: taylor,
      head: [ironrotHelm],
      legs: [ironrotLegs],
      inventory: [nullruneHood, ironhideHelm, nullruneBoots],
      hand: [],
      deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    },
    {
      hero: dash,
      head: [ironhideHelm],
      inventory: [nullruneHood],
      hand: [],
      deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    },
    FAB_MANUAL_HARNESS,
  );
  const Taylor = game.as(taylor);
  const Dash = game.as(dash);
  const helm = Taylor.cardIn("head", ironrotHelm);
  const legs = Taylor.cardIn("legs", ironrotLegs);
  const hood = Taylor.cardIn("inventory", nullruneHood);
  const ironhide = Taylor.cardIn("inventory", ironhideHelm);
  const boots = Taylor.cardIn("inventory", nullruneBoots);
  const opposingHood = Dash.cardIn("inventory", nullruneHood);
  Taylor.endTurn();
  Dash.endTurn();
  game.advanceToDecision(Taylor, "boolean");
  Taylor.accept();
  const banish = Taylor.expectDecision("entity-target");
  expect(banish.candidates.map((candidate) => candidate.instanceId).sort()).toEqual(
    [helm.instanceId, legs.instanceId].sort(),
  );
  expect(banish.min).toBe(1);
  expect(banish.max).toBe(1);
  Taylor.targetRequired(helm);
  const equip = Taylor.expectDecision("entity-target");
  expect(equip.candidates.map((candidate) => candidate.instanceId).sort()).toEqual(
    [hood.instanceId, ironhide.instanceId].sort(),
  );
  expect(equip.min).toBe(1);
  expect(equip.max).toBe(1);
  Taylor.targetRequired(ironhide);
  game.untilIdle({ optionals: "throw" });
  expectFabCard(Taylor, helm).toBeBanished();
  expectFabCard(Taylor, legs).toBeIn("legs");
  expectFabCard(Taylor, ironhide).toBeIn("head");
  expectFabCard(Taylor, hood).toBeIn("inventory");
  expectFabCard(Taylor, boots).toBeIn("inventory");
  expectFabCard(Dash, ironhideHelm).toBeIn("head");
  expectFabCard(Dash, opposingHood).toBeIn("inventory");
  expectWait(game).toBeIdle();
});

it("Taylor selecting Legs equips Legs and preserves the Head", () => {
  const game = FabTestEngine.start(
    {
      hero: taylor,
      head: [ironrotHelm],
      legs: [ironrotLegs],
      inventory: [nullruneHood, nullruneBoots],
      hand: [],
      deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    },
    { hero: dash, hand: [], deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue] },
    FAB_MANUAL_HARNESS,
  );
  const Taylor = game.as(taylor);
  const boots = Taylor.cardIn("inventory", nullruneBoots);
  const hood = Taylor.cardIn("inventory", nullruneHood);
  Taylor.endTurn();
  game.as(dash).endTurn();
  game.advanceToDecision(Taylor, "boolean");
  Taylor.accept();
  Taylor.targetRequired(ironrotLegs);
  game.untilIdle({ optionals: "throw", entityTargets: "pause" });
  expectFabCard(Taylor, ironrotLegs).toBeBanished();
  expectFabCard(Taylor, boots).toBeIn("legs");
  expectFabCard(Taylor, ironrotHelm).toBeIn("head");
  expectFabCard(Taylor, hood).toBeIn("inventory");
  expectWait(game).toBeIdle();
});

it("Taylor banishes the equipment even when no inventory card shares its subtype", () => {
  const game = FabTestEngine.start(
    {
      hero: taylor,
      head: [ironrotHelm],
      inventory: [nullruneBoots],
      hand: [],
      deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    },
    { hero: dash, hand: [], deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue] },
    FAB_MANUAL_HARNESS,
  );
  const Taylor = game.as(taylor);
  const boots = Taylor.cardIn("inventory", nullruneBoots);
  Taylor.endTurn();
  game.as(dash).endTurn();
  game.advanceToDecision(Taylor, "boolean");
  Taylor.accept();
  game.untilIdle({ optionals: "throw", entityTargets: "pause" });
  expectFabCard(Taylor, ironrotHelm).toBeBanished();
  expectFabCard(Taylor, boots).toBeIn("inventory");
  expectWait(game).toBeIdle();
  Taylor.play(Taylor.cardsIn("hand", nimblismBlue)[0]!);
  game.untilIdle({ optionals: "throw" });
  expectFabPlayer(Taylor).toHaveAP(1).toHaveLife(18);
  expectWait(game).toBeIdle();
});

it("Taylor cannot use opposing equipment to equip an inventory card", () => {
  const game = FabTestEngine.start(
    {
      hero: taylor,
      inventory: [nullruneHood],
      hand: [],
      deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    },
    {
      hero: dash,
      head: [ironrotHelm],
      hand: [],
      deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    },
    FAB_MANUAL_HARNESS,
  );
  const Taylor = game.as(taylor);
  const hood = Taylor.cardIn("inventory", nullruneHood);
  Taylor.endTurn();
  game.as(dash).endTurn();
  game.untilIdle({ optionals: "throw", entityTargets: "pause" });
  expectFabCard(Taylor, hood).toBeIn("inventory");
  expectFabCard(game.as(dash), ironrotHelm).toBeIn("head");
  expectFabPlayer(Taylor).toHaveAP(1).toHaveLife(18);
  expectWait(game).toBeIdle();
});
