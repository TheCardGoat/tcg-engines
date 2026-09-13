/**
 * AAA test for trigger:transform.
 * Representative card: Evo Steel Soul Memory Blue (EVO026).
 * "When this transforms from or into an Evo with a different name, your hero
 * gets +1{i} until end of turn."
 *
 * CR 8.5.36a + Release Notes — Bright Lights & Round the Table (Evo Steel
 * Soul Memory): the trigger is source-bound ("this") and only fires when the
 * transform PARTNER is an Evo with a different name. It does NOT trigger when
 * transforming from an equipment with just the Base subtype and no Evo
 * subtype (e.g. Teklo Base Head).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { evoSteelSoulMemoryBlue } from "../../../../../../cards/src/cards/actions/evo-steel-soul-memory.ts";
import { evoSentryBaseHeadRed } from "../../../../../../cards/src/cards/actions/evo-sentry-base-head.ts";
import { tekloBaseHead } from "../../../../../../cards/src/cards/equipment/teklo-base-head.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const startWithBaseHead = (baseHead: typeof tekloBaseHead) =>
  FabTestEngine.start(
    {
      hero: bravo,
      head: [baseHead],
      hand: [evoSteelSoulMemoryBlue],
      resourcePoints: 4,
      deck: 6,
    },
    { hero: dash, deck: 4 },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );

const heroIntellect = (game: ReturnType<typeof FabTestEngine.start>, heroId: string): number =>
  buildFabRulesView(game.getState()).object({
    instanceId: heroId,
    incarnation: game.getState().objects[heroId]!.incarnation,
  })?.current.numeric.intellect ?? game.as(bravo).intellect();

describe("trigger: transform", () => {
  it("AAA: transforming FROM an Evo with a different name grants +1 intellect until end of turn (EVO026)", () => {
    const game = startWithBaseHead(evoSentryBaseHeadRed);
    const Bravo = game.as(bravo);
    const heroId = game.getState().players[Bravo.id]!.heroCardId!;
    const intellectBefore = heroIntellect(game, heroId);

    const played = Bravo.play(evoSteelSoulMemoryBlue);
    expect(played.accepted).toBe(true);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // Evo equipped on head after transform/equip resolution.
    expect(Bravo.zone("head")).toContain(evoSteelSoulMemoryBlue.canonicalId);
    // Continuous intellect buff is visible on the rules view of the hero.
    expect(heroIntellect(game, heroId)).toBe(intellectBefore + 1);
  });

  it("AAA boundary: transforming from a Base-only (non-Evo) head does NOT trigger (Release Notes — Bright Lights)", () => {
    const game = startWithBaseHead(tekloBaseHead);
    const Bravo = game.as(bravo);
    const heroId = game.getState().players[Bravo.id]!.heroCardId!;
    const intellectBefore = heroIntellect(game, heroId);

    const played = Bravo.play(evoSteelSoulMemoryBlue);
    expect(played.accepted).toBe(true);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // The transform/equip still happens; only the a2 trigger is suppressed.
    expect(Bravo.zone("head")).toContain(evoSteelSoulMemoryBlue.canonicalId);
    expect(heroIntellect(game, heroId)).toBe(intellectBefore);
  });

  it("AAA boundary: without the Evo, intellect stays at the hero's printed value", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const intellect = Bravo.intellect();
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.intellect()).toBe(intellect);
  });
});
