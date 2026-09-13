/**
 * AJV006 Gauntlets of the Boreal Domain — Earth Ice Guardian Arms d2 Temper.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: If an Earth card is pitched this way, your
 *   attacks named Mangle get +2{p} this turn. If an Ice card is pitched this
 *   way, your attacks named Mangle get dominate this turn. Go again
 *   Temper
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Prior model scanned combat-chain at resolution for name Mangle with
 *    subtypes:["Attack"] (Attack is a type, not a subtype) and star count.
 *    Normal play is arm-then-Mangle: zero chain targets → buff never latched.
 * 2. Remodel: floating this-attack appliesTo.next name "Mangle" with count:32
 *    multi-fire (Savage Sash family) for both +2{p} and dominate grants.
 * 3. pitched-this-way-earth/ice-card is stamped on activate from pitched card
 *    talents (payment path already wires Earth/Ice/Lightning).
 * 4. Must pitch for the activate cost (RP:0) so talent flags stamp; prepaid
 *    RP alone never stamps pitched-this-way.
 * 5. Earth → Mangle deals 10 (base 8 + 2). Ice → dominate rejects 2 hand cards.
 * 6. Generic pitch (no talent) → no continuous grant; Mangle deals 8.
 * 7. OPT + go again AP refund; Temper d2 on defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { gauntletsOfTheBorealDomain } from "../../../../../../cards/src/cards/equipment/gauntlets-of-the-boreal-domain.ts";
import { mangleRed } from "../../../../../../cards/src/cards/actions/mangle.ts";
import { weaveEarthBlue } from "../../../../../../cards/src/cards/actions/weave-earth.ts";
import { winterSGraspBlue } from "../../../../../../cards/src/cards/actions/winter-s-grasp.ts";

const LIFE = 40;
const MANGLE = 8;
const ARMS_D = 2;
const SNATCH = 4;
const ABILITY = "HTF6WHdnfmgHD7pBFhMQL:oncePerTurnActionIfEarthIsPitchedWay";

describe("gauntlets-of-the-boreal-domain (AJV006)", () => {
  it("core mechanic: Earth pitch → Mangle +2{p}; Ice pitch → dominate", () => {
    // Earth: pitch Weave Earth blue for activate → Mangle deals 10.
    const earth = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletsOfTheBorealDomain],
        hand: [mangleRed, weaveEarthBlue, nimblismBlue],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const EarthBravo = earth.as(bravo);
    const apBefore = EarthBravo.actionPoints();
    EarthBravo.activate(gauntletsOfTheBorealDomain);
    earth.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargets: "minimum",
      paymentCanonicalId: weaveEarthBlue.canonicalId,
    });
    // Go again refunds Action AP.
    expect(EarthBravo.actionPoints()).toBe(apBefore);
    expect(earth.getState().continuousEffectInstances.length).toBeGreaterThanOrEqual(1);
    const powerGrant = earth
      .getState()
      .continuousEffectInstances.find((inst) =>
        inst.atoms.some((atom) => atom.kind === "numeric" && atom.property === "power"),
      );
    expect(powerGrant?.futureApplicability?.remaining).toBeGreaterThan(1);
    expect(powerGrant?.futureApplicability?.filter).toMatchObject({ name: "Mangle" });

    EarthBravo.play(mangleRed, { pitch: [nimblismBlue] });
    earth.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    earth.helpers.resolveRestOfCombat();
    expect(earth.as(dash).life()).toBe(LIFE - (MANGLE + 2));

    // Ice: pitch Winter's Grasp blue → dominate rejects two hand cards.
    const ice = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletsOfTheBorealDomain],
        hand: [mangleRed, winterSGraspBlue, nimblismBlue],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [snatchRed, snatchRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const IceBravo = ice.as(bravo);
    IceBravo.activate(gauntletsOfTheBorealDomain);
    ice.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargets: "minimum",
      paymentCanonicalId: winterSGraspBlue.canonicalId,
    });
    IceBravo.play(mangleRed, { pitch: [nimblismBlue] });
    ice.passBoth();
    ice.passBoth();
    expect(ice.combat()?.step).toBe("defend");
    const rej = ice.as(dash).expectFailure({
      move: "defend",
      payload: {
        instanceIds: ice.as(dash).findCardsInZone("hand", [snatchRed, snatchRed]),
      },
    });
    expect(rej.errorCode).toBe("dominate");
    // One hand card still legal under dominate.
    ice.as(dash).blockWith(snatchRed);
    ice.helpers.resolveRestOfCombat();
  });

  it("boundaries: non-talent pitch no buff; OPT; Temper d2; floating model", () => {
    // Prepaid RP: no pitch → no talent flags → Mangle base 8 only.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletsOfTheBorealDomain],
        hand: [mangleRed, nimblismBlue, nimblismBlue],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const BareBravo = bare.as(bravo);
    BareBravo.activate(gauntletsOfTheBorealDomain);
    bare.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    // No Earth/Ice continuous power/dominate grants.
    const mangleBuffs = bare
      .getState()
      .continuousEffectInstances.filter((inst) =>
        inst.atoms.some(
          (atom) =>
            (atom.kind === "numeric" && atom.property === "power") ||
            (atom.kind === "ability" &&
              "property" in atom &&
              atom.property &&
              typeof atom.property === "object" &&
              "kind" in atom.property &&
              atom.property.kind === "keyword"),
        ),
      );
    expect(mangleBuffs).toHaveLength(0);
    BareBravo.play(mangleRed, { pitch: [nimblismBlue, nimblismBlue] });
    bare.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    bare.helpers.resolveRestOfCombat();
    expect(bare.as(dash).life()).toBe(LIFE - MANGLE);

    // OPT: second activate same turn illegal.
    const opt = FabTestEngine.start(
      {
        hero: bravo,
        arms: [gauntletsOfTheBorealDomain],
        hand: [weaveEarthBlue, weaveEarthBlue],
        actionPoints: 3,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    opt.as(bravo).activate(gauntletsOfTheBorealDomain);
    opt.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargets: "minimum",
      paymentCanonicalId: weaveEarthBlue.canonicalId,
    });
    const second = opt.as(bravo).expectFailure({
      move: "activate",
      payload: {
        instanceId: opt.as(bravo).findCardInZone("arms", gauntletsOfTheBorealDomain),
        abilityId: ABILITY,
      },
    });
    expect(second.accepted).toBe(false);

    // Temper d2: first defend → −1 counter, seat remains.
    const temper = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        arms: [gauntletsOfTheBorealDomain],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = temper.as(dash);
    const armsId = temper
      .getState()
      .containers.zonesByPlayerId[Defender.id]!.arms.find(
        (id) =>
          temper.getState().objects[id]?.canonicalId === gauntletsOfTheBorealDomain.canonicalId,
      )!;
    temper.as(bravo).attackWith(snatchRed);
    Defender.defend(gauntletsOfTheBorealDomain);
    temper.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    temper.helpers.resolveRestOfCombat();
    expect(temper.objectState(armsId)?.defenseCounterTotal).toBe(-1);
    expect(Defender.zone("arms")).toContain(gauntletsOfTheBorealDomain.canonicalId);
    expect(Defender.life()).toBe(20 - (SNATCH - ARMS_D));

    // Model: floating appliesTo name Mangle, not combat-chain star scan.
    const ability = gauntletsOfTheBorealDomain.base.abilities?.[0];
    expect(ability?.kind).toBe("activated");
    if (ability?.kind === "activated" && ability.effect?.type === "sequence") {
      const earthThen = ability.effect.steps[0];
      expect(earthThen?.type).toBe("conditional");
      if (earthThen?.type === "conditional" && earthThen.then?.type === "modify-numeric") {
        expect(earthThen.then.appliesTo).toMatchObject({
          next: { name: "Mangle" },
          count: 32,
        });
      }
    }
    expect(gauntletsOfTheBorealDomain.base.keywords?.some((k) => k.name === "temper")).toBe(true);
  });
});
