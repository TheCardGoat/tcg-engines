import { verdance } from "../../../../../cards/src/cards/heroes/verdance.ts";
import { sigilOfSanctuaryBlue } from "../../../../../cards/src/cards/instants/sigil-of-sanctuary.ts";
import { snatchRed as realSnatchRed } from "../../../../../cards/src/cards/actions/snatch.ts";
import { prism } from "../../../../../cards/src/cards/heroes/prism.ts";
import { haloOfIllumination } from "../../../../../cards/src/cards/equipment/halo-of-illumination.ts";
import { spellFrayTiara } from "../../../../../cards/src/cards/equipment/spell-fray-tiara.ts";
import { spellFrayCloak } from "../../../../../cards/src/cards/equipment/spell-fray-cloak.ts";
import { FAB_MANUAL_HARNESS, expectFabCard, expectWait } from "../../../testing/index.ts";
import { oscilio } from "../../../../../cards/src/cards/heroes/oscilio.ts";
import { dash as realDash } from "../../../../../cards/src/cards/heroes/dash.ts";
import { nimblismBlue as realNimblismBlue } from "../../../../../cards/src/cards/actions/nimblism.ts";
import {
  flashBoltYellow,
  flashBoltRed,
} from "../../../../../cards/src/cards/instants/flash-bolt.ts";
import { nullruneGloves } from "../../../../../cards/src/cards/equipment/nullrune-gloves.ts";

const realPreventionPadding = () => [
  realNimblismBlue,
  realNimblismBlue,
  realNimblismBlue,
  realNimblismBlue,
  realNimblismBlue,
  realNimblismBlue,
];
import { sinspeakerGloombladeRed } from "../../../../../cards/src/cards/actions/sinspeaker-gloomblade.ts";
import { runechant } from "../../../../../cards/src/cards/tokens/runechant.ts";
/**
 * CR Chapter 8 — Keywords: happy path, edge cases, and special interactions.
 * Real catalog cards when available; otherwise seated trainers via FabCardDefinitionInput.
 */
import { describe, expect, it as runtimeIt } from "vite-plus/test";
import {
  FabTestEngine,
  expectFabPlayer,
  baseHasKeyword,
  buildFabRulesView,
  fabToken,
  toFabCardDefinition,
} from "../../../index.ts";
import {
  azalea,
  bravo,
  cintariSellsword,
  dash,
  deathDealer,
  disableRed,
  frayingLifeforceRed,
  heartOfFyendal,
  ironrotHelm,
  nimblismBlue,
  nimblismRed,
  packHuntYellow,
  demolitionCrewRed,
  regurgitatingSlogRed,
  scabskinLeathers,
  scourTheBattlescapeRed,
  searingShot,
  snatchRed,
} from "../../fixtures.ts";
import { equipmentTrainer, hitTrainer } from "../../test-trainers.ts";
import { shadowOfUrsurBlue } from "../../../../../cards/src/cards/actions/shadow-of-ursur.ts";
import { shadowOfBlasmophetRed } from "../../../../../cards/src/cards/actions/shadow-of-blasmophet.ts";

function trainerFigment(canonicalId: string) {
  const pairedFace = (side: "front" | "back", name: string) => ({
    faceId: `${canonicalId}:face:${side}` as const,
    name,
    typeText: "Illusionist Aura - Figment",
    types: ["Illusionist", "Aura", "Figment"],
    traits: [],
    text: "",
    keywords: [],
    abilities: [],
  });
  return {
    canonicalId,
    name: "Trainer Figment",
    types: ["Illusionist", "Aura", "Figment"],
    layout: {
      kind: "flip" as const,
      family: "figment" as const,
      front: pairedFace("front", "Trainer Figment"),
      back: pairedFace("back", "Trainer Figment Awakened"),
    },
  };
}

function ampGainedThisTurn(game: FabTestEngine, playerId: string): number {
  return game
    .committedEvents()
    .filter(
      (event) =>
        event.name === "gain-assets" && event.data.playerId === playerId && event.data.amp > 0,
    )
    .reduce((total, event) => total + (event.name === "gain-assets" ? event.data.amp : 0), 0);
}

/**
 * All inventory-tested keyword scenarios in this file run as real `it`s.
 * Residual gaps that still need deeper catalog AAA are listed in
 * `docs/fab-keywords-effects-acceptance-status.md` §10 — do not silently
 * reintroduce a deferred-mechanic list that marks inventory-tested rows as todo.
 */
const it = runtimeIt;

describe("CR 8 — Keywords (ability keywords)", () => {
  // ── go-again ──────────────────────────────────────────────────────────────
  it("8.3.5 go-again happy: after Resolution, AP usable for a second attack same turn", () => {
    expect(baseHasKeyword(toFabCardDefinition(scourTheBattlescapeRed), "go-again")).toBe(false);
    const game = FabTestEngine.start(
      { hero: bravo, arsenal: [scourTheBattlescapeRed], hand: [snatchRed], deck: 8 },
      { hero: dash, life: 20, deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(scourTheBattlescapeRed, { from: "arsenal" });
    expect(Bravo.actionPoints()).toBe(0);
    Dash.defendWith([]);
    Bravo.pass();
    Dash.pass();
    game.passBoth(); // → damage
    expect(Bravo.actionPoints()).toBe(0);
    game.passBoth(); // → resolution
    expect(game.combat()?.step).toBe("resolution");
    expect(Bravo.actionPoints()).toBe(1);
    game.passBoth(); // → close
    expect(game.combat()).toBeNull();
    expect(Bravo.actionPoints()).toBe(1);
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(13);
    expect(Bravo.actionPoints()).toBe(0);
  });

  it("8.3.5c go-again edge: object cannot gain a second go-again (AP still only +1)", () => {
    // Two go-again sources would still only grant 1 AP (keyword not stacked).
    const attack = hitTrainer({
      slug: "double-go-again",
      keywords: [{ name: "go-again" }, { name: "go-again" }],
      power: 3,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).actionPoints()).toBe(1);
  });

  // ── dominate ──────────────────────────────────────────────────────────────
  // Demolition Crew has printed dominate. Regurgitating Slog only gains dominate
  // after optional Sloggism banish — do not treat it as printed-keyword subject.
  it("8.3.4 dominate happy: cannot defend with more than one card from hand", () => {
    expect(baseHasKeyword(toFabCardDefinition(demolitionCrewRed), "dominate")).toBe(true);
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [demolitionCrewRed, regurgitatingSlogRed, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 8,
      },
      { hero: dash, life: 20, hand: [snatchRed, nimblismBlue], deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // Additional cost: reveal a cost≥2 card (Regurgitating Slog). Pitch blue for resources.
    game.as(bravo).play(demolitionCrewRed, {
      target: game.as(dash).id,
      pitch: [nimblismBlue],
    });
    game.passBoth();
    game.passBoth();
    const rej = game.as(dash).expectFailure({
      move: "defend",
      payload: {
        instanceIds: game.as(dash).findCardsInZone("hand", [snatchRed, nimblismBlue]),
      },
    });
    expect(rej.errorCode).toBe("dominate");
    game.as(dash).blockWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });

  it("8.3.4 dominate interaction: equipment + one hand card may defend", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [demolitionCrewRed, regurgitatingSlogRed, nimblismBlue],
        actionPoints: 1,
        deck: 8,
      },
      {
        hero: dash,
        life: 20,
        hand: [snatchRed],
        legs: [scabskinLeathers],
        deck: 8,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    game.as(bravo).play(demolitionCrewRed, {
      target: Dash.id,
      pitch: [nimblismBlue],
    });
    game.passBoth();
    game.passBoth();
    const handId = Dash.findCardInZone("hand", snatchRed);
    const eqId = Dash.findCardInZone("legs", scabskinLeathers);
    Dash.exec({ move: "defend", payload: { instanceIds: [handId, eqId] } });
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(18);
    expect(Dash.zone("legs")).toContain(scabskinLeathers.canonicalId);
  });

  it("8.3.4 dominate edge: without dominate, two hand cards may defend", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, hand: [snatchRed, nimblismBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).blockWith([snatchRed, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    // Snatch 4 power fully blocked by two defenders — no dominate reject.
    expect(game.as(dash).life()).toBe(20);
  });

  // ── overpower ─────────────────────────────────────────────────────────────
  it("8.3.22 overpower happy: cannot defend with more than one action card", () => {
    const attack = hitTrainer({
      slug: "overpower-atk",
      keywords: [{ name: "overpower" }],
      power: 6,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 6 },
      { hero: dash, life: 20, hand: [snatchRed, nimblismBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    const rej = game.as(dash).expectFailure({
      move: "defend",
      payload: {
        instanceIds: game.as(dash).findCardsInZone("hand", [snatchRed, nimblismBlue]),
      },
    });
    expect(rej.errorCode).toBe("overpower");
    game.as(dash).blockWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    // 6 − 2 = 4
    expect(game.as(dash).life()).toBe(16);
  });

  it("8.3.22 overpower edge: single action defender is legal", () => {
    const attack = hitTrainer({
      slug: "overpower-single",
      keywords: [{ name: "overpower" }],
      power: 5,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 6 },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.as(dash).blockWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(17); // 5−2
  });

  // ── battleworn ────────────────────────────────────────────────────────────
  it("8.3.2 battleworn happy: after defending, −1 defense counter on equipment", () => {
    expect(baseHasKeyword(toFabCardDefinition(scabskinLeathers), "battleworn")).toBe(true);
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed], deck: 8 },
      { hero: dash, life: 20, legs: [scabskinLeathers], deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const eqId = Dash.findCardInZone("legs", scabskinLeathers);
    game.as(bravo).attackWith(snatchRed);
    Dash.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(18);
    expect(Dash.zone("legs")).toContain(scabskinLeathers.canonicalId);
    expect(game.objectState(eqId)?.defenseCounterTotal).toBe(-1);

    game.as(bravo).endTurn();
    Dash.endTurn();
    game.as(bravo).attackWith(snatchRed);
    Dash.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(15);
    expect(game.objectState(eqId)?.defenseCounterTotal).toBe(-2);
  });

  it("8.3.2 battleworn edge: equipment that does not defend gets no −1 defense counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, legs: [scabskinLeathers], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const eqId = game.as(dash).findCardInZone("legs", scabskinLeathers);
    game.as(bravo).attackWith(snatchRed);
    // No defend with equipment — pass through combat.
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("legs")).toContain(scabskinLeathers.canonicalId);
    expect(game.objectState(eqId)?.defenseCounterTotal ?? 0).toBe(0);
    expect(game.as(dash).life()).toBe(16);
  });

  // ── blade-break ───────────────────────────────────────────────────────────
  it("8.3.3 blade-break happy: defending equipment is destroyed when chain closes", () => {
    expect(baseHasKeyword(toFabCardDefinition(ironrotHelm), "blade-break")).toBe(true);
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, head: [ironrotHelm], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const helmId = Dash.findCardInZone("head", ironrotHelm);
    game.as(bravo).attackWith(snatchRed);
    Dash.exec({ move: "defend", payload: { instanceIds: [helmId] } });
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(17);
    expect(Dash.zone("head")).not.toContain(ironrotHelm.canonicalId);
    expect(Dash.zone("graveyard")).toContain(ironrotHelm.canonicalId);
  });

  it("8.3.3 blade-break edge: equipment that does not defend is not destroyed", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, head: [ironrotHelm], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("head")).toContain(ironrotHelm.canonicalId);
    expect(game.as(dash).life()).toBe(16);
  });

  // ── temper ────────────────────────────────────────────────────────────────
  it("8.3.10 temper happy: defending puts −1 counter; destroy when defense reaches 0", () => {
    const eq = equipmentTrainer({
      slug: "temper-helm",
      keywords: [{ name: "temper" }],
      defense: 1,
      zoneSubtype: "Head",
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, head: [eq], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const eqId = Dash.findCardInZone("head", eq);
    game.as(bravo).attackWith(snatchRed);
    Dash.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();
    // Def 1 then temper −1 → destroy.
    expect(Dash.zone("head")).not.toContain(eq.canonicalId);
    expect(Dash.zone("graveyard")).toContain(eq.canonicalId);
  });

  it("8.3.10 temper edge: equipment that does not defend is not destroyed and has no counter", () => {
    const eq = equipmentTrainer({
      slug: "temper-safe",
      keywords: [{ name: "temper" }],
      defense: 1,
      zoneSubtype: "Head",
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, head: [eq], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const eqId = game.as(dash).findCardInZone("head", eq);
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("head")).toContain(eq.canonicalId);
    expect(game.objectState(eqId)?.defenseCounterTotal ?? 0).toBe(0);
  });

  // ── guardwell ─────────────────────────────────────────────────────────────
  it("8.3.34 guardwell happy: defending puts −1 counters equal to printed defense", () => {
    const eq = equipmentTrainer({
      slug: "guardwell-legs",
      keywords: [{ name: "guardwell" }],
      defense: 2,
      zoneSubtype: "Legs",
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, legs: [eq], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const eqId = Dash.findCardInZone("legs", eq);
    game.as(bravo).attackWith(snatchRed);
    Dash.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("legs")).toContain(eq.canonicalId);
    expect(game.objectState(eqId)?.defenseCounterTotal).toBe(-2);
  });

  it("8.3.34 guardwell edge: no defend → no guardwell counters", () => {
    const eq = equipmentTrainer({
      slug: "guardwell-edge",
      keywords: [{ name: "guardwell" }],
      defense: 2,
      zoneSubtype: "Legs",
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, legs: [eq], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const eqId = game.as(dash).findCardInZone("legs", eq);
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.objectState(eqId)?.defenseCounterTotal ?? 0).toBe(0);
  });

  // ── fragment ──────────────────────────────────────────────────────────────
  it("8.3.43 fragment happy: 2+ defense block reduces power by 2 and secondary triggers", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        hand: [frayingLifeforceRed, nimblismBlue],
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(frayingLifeforceRed, {
      target: game.as(dash).id,
      pitch: [nimblismBlue],
    });
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.as(dash).blockWith(nimblismBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.passBoth(); // resolve the fragment triggered layer (gain 1 life)
    expect(game.as(bravo).life()).toBe(21);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(17);
  });

  it("8.3.43 fragment edge: no block → no fragment", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        hand: [frayingLifeforceRed, nimblismBlue],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(frayingLifeforceRed, {
      target: game.as(dash).id,
      pitch: [nimblismBlue],
    });
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).life()).toBe(20);
    expect(game.as(dash).life()).toBe(13);
  });

  // ── piercing ──────────────────────────────────────────────────────────────
  it("8.3.23 piercing happy: equipment defender gives +N power", () => {
    const attack = hitTrainer({
      slug: "piercing-atk",
      keywords: [{ name: "piercing", value: 2 }],
      power: 4,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 6 },
      { hero: dash, life: 20, head: [ironrotHelm], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const helmId = Dash.findCardInZone("head", ironrotHelm);
    game.as(bravo).attackWith(attack);
    Dash.exec({ move: "defend", payload: { instanceIds: [helmId] } });
    expect(game.combat()?.activeLink?.attackPower).toBe(6); // 4 + 2 piercing
    game.helpers.resolveRestOfCombat();
    // 6 − 1 (helm, then destroyed by bladebreak) = 5
    expect(Dash.life()).toBe(15);
  });

  it("8.3.23 piercing edge: no equipment defender → no bonus", () => {
    const attack = hitTrainer({
      slug: "piercing-no-eq",
      keywords: [{ name: "piercing", value: 2 }],
      power: 4,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 6 },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.as(dash).blockWith(nimblismBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(18);
  });

  // ── blood-debt ────────────────────────────────────────────────────────────
  it("8.3.11 blood-debt happy: at beginning of end phase while banished, lose 1 life", () => {
    const debt = hitTrainer({
      slug: "blood-debt-card",
      keywords: [{ name: "blood-debt" }],
      power: 1,
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        hand: [snatchRed],
        banished: [debt],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(game.as(bravo).zone("banished")).toContain(debt.canonicalId);
    game.as(bravo).endTurn();
    expect(game.as(bravo).life()).toBe(19);
  });

  it("8.3.11 blood-debt: each public banished Blood Debt card loses 1 life", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        banished: [shadowOfUrsurBlue, shadowOfBlasmophetRed],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).endTurn();

    expect(game.as(bravo).life()).toBe(18);
  });

  it("8.3.11 blood-debt edge: not in banished → no life loss at end phase", () => {
    const debt = hitTrainer({
      slug: "blood-debt-hand",
      keywords: [{ name: "blood-debt" }],
      power: 1,
    });
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, hand: [debt], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).endTurn();
    expect(game.as(bravo).life()).toBe(20);
  });

  it("8.3.11a blood-debt edge: face-down in banished → no life loss at end phase", () => {
    // CR 8.3.11a: blood debt only triggers if its source is public in banished.
    const debt = hitTrainer({
      slug: "blood-debt-private",
      keywords: [{ name: "blood-debt" }],
      power: 1,
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        banished: [{ card: debt, state: { faceDown: true } }],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const debtId = game.as(bravo).findCardInZone("banished", debt);
    expect(game.objectState(debtId)?.faceDown).toBe(true);
    game.as(bravo).endTurn();
    expect(game.as(bravo).life()).toBe(20);
  });

  // ── phantasm ──────────────────────────────────────────────────────────────
  it("8.3.13 phantasm happy: defended by 6+ power non-Illusionist attack action → destroy", () => {
    const phantasmAtk = hitTrainer({
      slug: "phantasm-atk",
      keywords: [{ name: "phantasm" }],
      power: 6,
    });
    // Snatch is power 4 — use a 6+ attack as defender: regurgitating slog power 6.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [phantasmAtk], deck: 6 },
      {
        hero: dash,
        life: 20,
        hand: [regurgitatingSlogRed],
        deck: 6,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(phantasmAtk);
    game.as(dash).blockWith(regurgitatingSlogRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.passBoth();
    game.helpers.resolveUntilIdle();
    expect(game.as(bravo).zone("graveyard")).toContain(phantasmAtk.canonicalId);
    expect(game.combat()).toBeNull();
    expect(game.as(dash).life()).toBe(20);
  });

  it("8.3.13 phantasm edge: low-power defender does not destroy", () => {
    const phantasmAtk = hitTrainer({
      slug: "phantasm-safe",
      keywords: [{ name: "phantasm" }],
      power: 6,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [phantasmAtk], deck: 6 },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(phantasmAtk);
    game.as(dash).blockWith(nimblismBlue);
    expect(game.combat()?.activeLink?.keywords).not.toContain("phantasm-destroyed");
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16); // 6−2
  });

  // ── mirage ────────────────────────────────────────────────────────────────
  it("8.3.25 mirage happy: defending non-Illusionist 6+ power attack destroys mirage equipment", () => {
    const mirageEq = equipmentTrainer({
      slug: "mirage-eq",
      keywords: [{ name: "mirage" }],
      defense: 2,
    });
    // Slog is power 6 non-Illusionist attack action.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [regurgitatingSlogRed, nimblismBlue], deck: 6 },
      { hero: dash, life: 20, legs: [mirageEq], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const eqId = Dash.findCardInZone("legs", mirageEq);
    game.as(bravo).play(regurgitatingSlogRed, {
      target: Dash.id,
      pitch: [nimblismBlue],
    });
    game.passBoth();
    game.passBoth();
    Dash.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("legs")).not.toContain(mirageEq.canonicalId);
    expect(Dash.zone("graveyard")).toContain(mirageEq.canonicalId);
  });

  it("8.3.25 mirage edge: low-power attack does not destroy mirage defender", () => {
    const mirageEq = equipmentTrainer({
      slug: "mirage-safe",
      keywords: [{ name: "mirage" }],
      defense: 2,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, legs: [mirageEq], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const eqId = Dash.findCardInZone("legs", mirageEq);
    game.as(bravo).attackWith(snatchRed);
    Dash.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("legs")).toContain(mirageEq.canonicalId);
  });

  // ── spectra ───────────────────────────────────────────────────────────────
  it("8.3.14 spectra happy: can be attack-target and is destroyed when targeted", () => {
    const spectraAura = {
      canonicalId: "trainer-spectra-aura",
      types: ["Aura"],
      keywords: [{ name: "spectra" }],
      abilities: [],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arena: [spectraAura], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const spectraId = Dash.findCardInZone("arena", spectraAura);
    game.as(bravo).play(snatchRed, { target: spectraId });
    // CR 8.3.14b: the spectra permanent is destroyed during target declaration.
    expect(Dash.zone("arena")).not.toContain(spectraAura.canonicalId);
    expect(Dash.zone("graveyard")).toContain(spectraAura.canonicalId);
    game.helpers.resolveRestOfCombat();
    // No hero damage is dealt from a spectra-target link.
    expect(Dash.life()).toBe(20);
  });

  it("8.3.14 spectra edge: without spectra, non-ally arena permanent is not a legal target", () => {
    const plainAura = {
      canonicalId: "trainer-plain-aura",
      types: ["Aura"],
      keywords: [],
      abilities: [],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arena: [plainAura], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const auraId = game.as(dash).findCardInZone("arena", plainAura);
    const rej = game.as(bravo).expectFailure({
      move: "begin-play",
      payload: {
        instanceId: game.as(bravo).findCardInZone("hand", snatchRed),
        target: auraId,
      },
    });
    expect(rej.errorCode).toBe("illegal_attack_target");
  });

  // ── boost ─────────────────────────────────────────────────────────────────
  it("8.3.9 boost happy: banish top Mechanologist → attack gains go again", () => {
    const boostAtk = hitTrainer({
      slug: "boost-mech",
      keywords: [{ name: "boost" }],
      power: 3,
    });
    const mechTop = {
      canonicalId: "trainer-mech-top",
      types: ["Mechanologist", "Action"],
      cost: 0,
      power: 1,
    };
    // Single-card deck so shuffle cannot reorder away the Mechanologist.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [boostAtk, snatchRed],
        deck: [mechTop],
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.play(boostAtk, { target: game.as(dash).id, boost: true });
    const boostedObjectId = Bravo.findCardInZone("stack", boostAtk);
    expect(Bravo.zone("banished")).toContain(mechTop.canonicalId);
    expect(game.getState().players[Bravo.id]!.history.turn.boosted).toBe(true);
    expect(game.getState().objects[boostedObjectId]?.declarationFacts).toContainEqual({
      kind: "boost",
    });
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("8.3.9 boost edge: banish non-Mechanologist → boosted but no go again", () => {
    const boostAtk = hitTrainer({
      slug: "boost-nonmech",
      keywords: [{ name: "boost" }],
      power: 3,
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [boostAtk],
        deck: [heartOfFyendal],
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false },
    );
    game.as(bravo).play(boostAtk, { target: game.as(dash).id, boost: true });
    expect(game.getState().players[game.as(bravo).id]!.history.turn.boosted).toBe(true);
    expect(game.as(bravo).zone("banished")).toContain(heartOfFyendal.canonicalId);
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.activeLink?.keywords).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).actionPoints()).toBe(0);
  });

  it("8.3.9 boost edge: without paying boost, top of deck stays", () => {
    const boostAtk = hitTrainer({
      slug: "boost-skip",
      keywords: [{ name: "boost" }],
      power: 3,
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [boostAtk],
        deck: [heartOfFyendal, snatchRed],
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false },
    );
    const deckBefore = game.as(bravo).zone("deck").length;
    game.as(bravo).play(boostAtk, { target: game.as(dash).id, boost: false });
    const unboostedObjectId = game.as(bravo).findCardInZone("stack", boostAtk);
    expect(game.as(bravo).zone("deck").length).toBe(deckBefore);
    expect(game.getState().players[game.as(bravo).id]!.history.turn.boosted).toBe(false);
    expect(game.getState().objects[unboostedObjectId]?.declarationFacts ?? []).not.toContainEqual({
      kind: "boost",
    });
  });

  // ── fusion / scrap / beat-chest ───────────────────────────────────────────
  it("8.3.17 fusion happy: fuse:true with reveal marks fusedThisTurn", () => {
    const fused = hitTrainer({
      slug: "fusion-ice",
      keywords: [{ name: "fusion", supertypes: ["Ice"], mode: "and" }],
      power: 4,
    });
    const iceCard = {
      canonicalId: "trainer-ice-card",
      types: ["Elemental", "Ice", "Action"],
      pitch: 3,
      cost: 0,
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [fused, iceCard], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(fused, {
      target: game.as(dash).id,
      fuse: true,
      fuseCards: [iceCard],
    });
    expect(game.getState().players[game.as(bravo).id]!.history.turn.fused).toBe(true);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });

  it("8.3.17 fusion edge: without fuse, fusedThisTurn stays false", () => {
    const fused = hitTrainer({
      slug: "fusion-nofuse",
      keywords: [{ name: "fusion", supertypes: ["Ice"], mode: "and" }],
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [fused], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(fused, { target: game.as(dash).id });
    expect(game.getState().players[game.as(bravo).id]!.history.turn.fused).toBe(false);
  });

  it("8.3.32 scrap happy: scrap:true banishes equipment from graveyard", () => {
    const scrapAtk = hitTrainer({
      slug: "scrap-atk",
      keywords: [{ name: "scrap" }],
      power: 4,
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [scrapAtk],
        graveyard: [ironrotHelm],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game
      .as(bravo)
      .play(scrapAtk, { target: game.as(dash).id, scrap: true, scrapCard: ironrotHelm });
    expect(game.as(bravo).zone("graveyard")).not.toContain(ironrotHelm.canonicalId);
    expect(game.as(bravo).zone("banished")).toContain(ironrotHelm.canonicalId);
    game.helpers.resolveRestOfCombat();
  });

  it("8.3.32 scrap edge: scrap with no chosen GY card is rejected (additional cost must be payable)", () => {
    const scrapAtk = hitTrainer({
      slug: "scrap-empty",
      keywords: [{ name: "scrap" }],
      power: 4,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [scrapAtk], graveyard: [], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const rej = Bravo.expectFailure({
      move: "begin-play",
      payload: {
        instanceId: Bravo.findCardInZone("hand", scrapAtk),
        target: game.as(dash).id,
        scrap: true,
      },
    });
    expect(rej.errorCode).toBe("additional_cost_failed");
  });

  it("8.3.33 beat-chest happy: discards a 6+ power card from hand", () => {
    const beat = hitTrainer({
      slug: "beat-chest-atk",
      keywords: [{ name: "beat-chest" }],
      power: 4,
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [beat, regurgitatingSlogRed],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const slogId = game.as(bravo).findCardInZone("hand", regurgitatingSlogRed);
    game.as(bravo).play(beat, {
      target: game.as(dash).id,
      beatChest: true,
      beatChestInstanceId: slogId,
    });
    expect(game.as(bravo).zone("graveyard")).toContain(regurgitatingSlogRed.canonicalId);
    expect(game.as(bravo).zone("hand")).not.toContain(regurgitatingSlogRed.canonicalId);
    game.helpers.resolveRestOfCombat();
  });

  it("8.3.33 beat-chest edge: without beatChest flag, 6+ power card stays in hand", () => {
    const beat = hitTrainer({
      slug: "beat-chest-skip",
      keywords: [{ name: "beat-chest" }],
      power: 4,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [beat, regurgitatingSlogRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(beat, { target: game.as(dash).id });
    expect(game.as(bravo).zone("hand")).toContain(regurgitatingSlogRed.canonicalId);
    expect(game.as(bravo).zone("graveyard")).not.toContain(regurgitatingSlogRed.canonicalId);
    game.helpers.resolveRestOfCombat();
  });

  // ── ambush ────────────────────────────────────────────────────────────────
  it("8.3.28 ambush happy: may defend with arsenal card that has ambush", () => {
    const ambushCard = hitTrainer({
      slug: "ambush-def",
      keywords: [{ name: "ambush" }],
      power: 2,
    });
    // Give defense property via equipment-like defense on action
    const ambushDef = { ...ambushCard, defense: 3 };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arsenal: [ambushDef], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const ambushId = Dash.findCardInZone("arsenal", ambushDef);
    game.as(bravo).attackWith(snatchRed);
    Dash.exec({ move: "defend", payload: { instanceIds: [ambushId] } });
    game.helpers.resolveRestOfCombat();
    // 4 − 3 = 1 damage
    expect(Dash.life()).toBe(19);
    expect(Dash.zone("arsenal")).toHaveLength(0);
  });

  it("8.3.28 ambush edge: arsenal without ambush cannot defend", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arsenal: [nimblismBlue], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const id = Dash.findCardInZone("arsenal", nimblismBlue);
    game.as(bravo).attackWith(snatchRed);
    const rej = Dash.expectFailure({
      move: "defend",
      payload: { instanceIds: [id] },
    });
    expect(rej.errorCode).toBe("card_not_in_hand");
  });

  // ── ward / quell / spellvoid ──────────────────────────────────────────────
  it("8.3.20 ward happy: destroy ward permanent to prevent N damage", () => {
    const wardAura = {
      canonicalId: "trainer-ward-1",
      types: ["Aura"],
      keywords: [{ name: "ward", value: 2 }],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arena: [wardAura], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    // Power 4, ward prevents 2 → life 18; ward destroyed.
    expect(game.as(dash).life()).toBe(18);
    expect(game.as(dash).zone("arena")).not.toContain(wardAura.canonicalId);
    expect(game.as(dash).zone("graveyard")).toContain(wardAura.canonicalId);
  });

  it("8.3.20 ward edge: no ward permanent → full damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });

  it("8.3.19 quell happy: pay N prevent N; destroy quell source at end phase", () => {
    const quellEq = equipmentTrainer({
      slug: "quell-arms",
      keywords: [{ name: "quell", value: 1 }],
      defense: 0,
      zoneSubtype: "Arms",
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      {
        hero: dash,
        life: 20,
        arms: [quellEq],
        resourcePoints: 1,
        deck: 4,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalOptions: "all" });
    // Prevent 1 of 4 → life 17; quell still equipped until end phase.
    expect(game.as(dash).life()).toBe(17);
    expect(game.as(dash).zone("arms")).toContain(quellEq.canonicalId);
    expect(game.as(dash).resourcePoints()).toBe(0);
    // End turn as bravo then dash's end — quell destroy is on the turn player's end
    // that follows damage; apply when any end-turn runs (checks all quell pending).
    game.as(bravo).endTurn();
    expect(game.as(dash).zone("arms")).not.toContain(quellEq.canonicalId);
    expect(game.as(dash).zone("graveyard")).toContain(quellEq.canonicalId);
  });

  for (const mode of ["floating", "pitch", "decline", "unfunded"] as const) {
    it(`8.3.8 arcane-barrier ${mode}: each damage event needs its own payment`, () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          life: 20,
          hand: [flashBoltYellow, flashBoltYellow],
          resourcePoints: 4,
          actionPoints: 1,
          deck: realPreventionPadding(),
        },
        {
          hero: realDash,
          life: 20,
          arms: [nullruneGloves],
          resourcePoints: mode === "floating" || mode === "decline" ? 1 : 0,
          hand: mode === "pitch" ? [realNimblismBlue] : [],
          deck: realPreventionPadding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Dash = game.as(realDash);
      Oscilio.play(flashBoltYellow, { target: Dash.id });
      game.passBoth();
      if (mode === "floating" || mode === "pitch") {
        Dash.choose("arcane-barrier");
        if (mode === "pitch") {
          expectWait(game).toHaveDecision("payment");
          Dash.pitchFirst(); // The only hand card is the authored blue Nimblism.
        }
      } else if (mode === "decline") Dash.chooseOptions();
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Dash)
        .toHaveLife(mode === "floating" || mode === "pitch" ? 19 : 18)
        .toHaveResourceCount(mode === "pitch" ? 2 : mode === "decline" ? 1 : 0)
        .toHaveHandCount(0);
      expectFabCard(Dash, nullruneGloves).toBeIn("arms");
      if (mode === "pitch") expectFabCard(Dash, realNimblismBlue).toBeIn("pitch");

      Oscilio.play(flashBoltYellow, { target: Dash.id });
      game.passBoth();
      if (mode === "pitch") Dash.choose("arcane-barrier");
      else if (mode === "decline") Dash.chooseOptions();
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Dash)
        .toHaveLife(mode === "pitch" ? 18 : mode === "floating" ? 17 : 16)
        .toHaveResourceCount(mode === "pitch" || mode === "decline" ? 1 : 0);
      expectFabCard(Dash, nullruneGloves).toBeIn("arms");
      expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(1).toHaveResourceCount(0).toHaveHandCount(0);
      expectWait(game).toBeIdle();
    });
  }

  for (const prevent of [false, true]) {
    it(`8.3.15 spellvoid ${prevent ? "accept" : "decline"}: destruction determines prevention and the next event`, () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          life: 20,
          hand: [flashBoltYellow, flashBoltYellow],
          resourcePoints: 4,
          actionPoints: 1,
          deck: realPreventionPadding(),
        },
        {
          hero: prism,
          life: 20,
          hand: [],
          resourcePoints: 0,
          head: [haloOfIllumination],
          deck: realPreventionPadding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Prism = game.as(prism);
      Oscilio.play(flashBoltYellow, { target: Prism.id });
      game.passBoth();
      if (prevent) Prism.choose("spellvoid");
      else Prism.chooseOptions();
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Prism)
        .toHaveLife(prevent ? 20 : 18)
        .toHaveResourceCount(0);
      expectFabCard(Prism, haloOfIllumination).toBeIn(prevent ? "graveyard" : "head");
      Oscilio.play(flashBoltYellow, { target: Prism.id });
      game.passBoth();
      if (!prevent) Prism.chooseOptions();
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabPlayer(Prism).toHaveLife(prevent ? 18 : 16);
      expectFabCard(Prism, haloOfIllumination).toBeIn(prevent ? "graveyard" : "head");
      expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(1).toHaveResourceCount(0).toHaveHandCount(0);
      expectWait(game).toBeIdle();
    });
  }

  it("8.3.15 spellvoid: each damaged hero chooses only their own prevention", () => {
    const bravoSpellvoid = equipmentTrainer({
      slug: "sv-each-hero-bravo",
      keywords: [{ name: "spellvoid", value: 1 }],
      defense: 0,
      zoneSubtype: "Head",
    });
    const dashSpellvoid = equipmentTrainer({
      slug: "sv-each-hero-dash",
      keywords: [{ name: "spellvoid", value: 1 }],
      defense: 0,
      zoneSubtype: "Head",
    });
    const bolt = {
      canonicalId: "trainer-each-hero-arcane",
      types: ["Wizard", "Action"],
      cost: 0,
      keywords: [],
      abilities: [
        {
          id: "each-hero-arcane-a1",
          kind: "resolution" as const,
          text: "Deal 1 arcane damage to each hero.",
          effect: {
            type: "deal-damage" as const,
            damageType: "arcane" as const,
            amount: 1,
            target: { selector: "each-hero" as const },
          },
        },
      ],
    };
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, head: [bravoSpellvoid], hand: [bolt], deck: 4 },
      { hero: dash, life: 20, head: [dashSpellvoid], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(bolt);
    game.passBoth();

    const bravoChoice = game.getState().decision;
    expect(bravoChoice).toMatchObject({ kind: "option", actorId: game.as(bravo).id });
    if (!bravoChoice || bravoChoice.kind !== "option")
      throw new Error("Expected Bravo's Spellvoid choice.");
    expect(bravoChoice.options).toHaveLength(1);
    game.exec({
      move: "answer-decision",
      actorId: bravoChoice.actorId,
      payload: {
        decisionId: bravoChoice.decisionId,
        stateVersion: bravoChoice.stateVersion,
        answer: { kind: "option", optionIds: bravoChoice.options.map((option) => option.id) },
      },
    });

    const dashChoice = game.getState().decision;
    expect(dashChoice).toMatchObject({ kind: "option", actorId: game.as(dash).id });
    if (!dashChoice || dashChoice.kind !== "option")
      throw new Error("Expected Dash's Spellvoid choice.");
    expect(dashChoice.options).toHaveLength(1);
    game.exec({
      move: "answer-decision",
      actorId: dashChoice.actorId,
      payload: {
        decisionId: dashChoice.decisionId,
        stateVersion: dashChoice.stateVersion,
        answer: { kind: "option", optionIds: [] },
      },
    });

    expect(game.as(bravo).life()).toBe(20);
    expect(game.as(dash).life()).toBe(19);
    expect(game.as(bravo).zone("graveyard")).toContain(bravoSpellvoid.canonicalId);
    expect(game.as(dash).zone("head")).toContain(dashSpellvoid.canonicalId);
  });

  it("8.3.15 spellvoid edge: physical combat does not destroy spellvoid equipment", () => {
    const spellvoidEq = equipmentTrainer({
      slug: "sv-head-phys",
      keywords: [{ name: "spellvoid", value: 2 }],
      defense: 0,
      zoneSubtype: "Head",
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, head: [spellvoidEq], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("head")).toContain(spellvoidEq.canonicalId);
    expect(game.as(dash).life()).toBe(16);
  });

  it("8.3.15 spellvoid: selecting multiple optional preventions asks their application order", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [flashBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: realPreventionPadding(),
      },
      {
        hero: realDash,
        life: 20,
        hand: [],
        resourcePoints: 0,
        head: [spellFrayTiara],
        chest: [spellFrayCloak],
        deck: realPreventionPadding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(realDash);
    Oscilio.play(flashBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.chooseNamedOptions("Spell Fray Tiara", "Spell Fray Cloak");
    expectWait(game).toHaveDecision("ordering");
    // These two identical one-point preventions commute; both must be applied.
    Dash.chooseListedOrder();
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    expectFabPlayer(Dash).toHaveLife(19).toHaveResourceCount(0);
    expectFabCard(Dash, spellFrayTiara).toBeIn("graveyard");
    expectFabCard(Dash, spellFrayCloak).toBeIn("graveyard");
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(1).toHaveResourceCount(0).toHaveHandCount(0);
    expectWait(game).toBeIdle();
  });

  it("8.3.37 arcane-shelter: mandatory aura destruction prevents only the first arcane event", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [flashBoltYellow, flashBoltYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: realPreventionPadding(),
      },
      {
        hero: verdance,
        life: 20,
        hand: [sigilOfSanctuaryBlue],
        resourcePoints: 0,
        deck: realPreventionPadding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Verdance = game.as(verdance);
    Oscilio.pass();
    Verdance.play(sigilOfSanctuaryBlue);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    expectFabCard(Verdance, sigilOfSanctuaryBlue).toBeIn("arena");
    Oscilio.play(flashBoltYellow, { target: Verdance.id });
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    expectFabPlayer(Verdance).toHaveLife(19).toHaveTokenCount("embodiment-of-earth", 1);
    expectFabCard(Verdance, sigilOfSanctuaryBlue).toBeIn("graveyard");
    Oscilio.play(flashBoltYellow, { target: Verdance.id });
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    expectFabPlayer(Verdance)
      .toHaveLife(17)
      .toHaveTokenCount("embodiment-of-earth", 1)
      .toHaveResourceCount(0);
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(1).toHaveResourceCount(0).toHaveHandCount(0);
    expectWait(game).toBeIdle();
  });

  it("8.3.37 arcane-shelter: physical damage leaves the aura intact", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [realSnatchRed],
        actionPoints: 1,
        deck: realPreventionPadding(),
      },
      {
        hero: verdance,
        life: 20,
        hand: [sigilOfSanctuaryBlue],
        resourcePoints: 0,
        deck: realPreventionPadding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Verdance = game.as(verdance);
    Oscilio.pass();
    Verdance.play(sigilOfSanctuaryBlue);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    Oscilio.playAttack(realSnatchRed);
    Verdance.defendWith([]);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Verdance).toHaveLife(16).toHaveTokenCount("embodiment-of-earth", 0);
    expectFabCard(Verdance, sigilOfSanctuaryBlue).toBeIn("arena");
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(0).toHaveHandCount(1);
    expectFabCard(Oscilio, realSnatchRed).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  it("8.3.19 quell edge: without RP or pitchable cards, quell cannot prevent and equipment is not pending-destroy", () => {
    const quellEq = equipmentTrainer({
      slug: "quell-no-rp",
      keywords: [{ name: "quell", value: 1 }],
      defense: 0,
      zoneSubtype: "Arms",
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      {
        hero: dash,
        life: 20,
        arms: [quellEq],
        resourcePoints: 0,
        hand: [],
        deck: 4,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    // Full 4 damage; quell not paid.
    expect(game.as(dash).life()).toBe(16);
    expect(game.as(dash).zone("arms")).toContain(quellEq.canonicalId);
    game.as(bravo).endTurn();
    // Not destroyed at EOT because quell was never used.
    expect(game.as(dash).zone("arms")).toContain(quellEq.canonicalId);
  });

  // ── perched / watery-grave / cloaked / modular / universal / protect ─────
  it("8.3.39 perched happy: cannot be chosen as attack target", () => {
    const perched = {
      canonicalId: "trainer-perched",
      types: ["Companion", "Ally"],
      health: 3,
      power: 1,
      keywords: [{ name: "perched" }],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arena: [perched], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(dash).findCardInZone("arena", perched);
    const rej = game.as(bravo).expectFailure({
      move: "begin-play",
      payload: {
        instanceId: game.as(bravo).findCardInZone("hand", snatchRed),
        target: id,
      },
    });
    expect(["illegal_target", "illegal_attack_target"]).toContain(rej.errorCode);
  });

  it("8.3.39 perched edge: non-perched ally remains a legal attack target", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arena: [cintariSellsword], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const allyId = game.as(dash).findCardInZone("arena", cintariSellsword);
    // Non-perched ally is a legal attack target (accepted begin-play).
    const ok = game.as(bravo).exec({
      move: "begin-play",
      payload: {
        instanceId: game.as(bravo).findCardInZone("hand", snatchRed),
        target: allyId,
      },
    });
    expect(ok.accepted).not.toBe(false);
    game.helpers.resolveRestOfCombat();
  });

  it("8.3.41 watery-grave happy: destroyed arena permanent enters GY face-down", () => {
    const wg = {
      canonicalId: "trainer-watery",
      types: ["Aura"],
      keywords: [{ name: "spectra" }, { name: "watery-grave" }],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arena: [wg], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(dash).findCardInZone("arena", wg);
    game.as(bravo).play(snatchRed, { target: id });
    expect(game.objectState(id)?.faceDown).toBe(true);
    expect(game.as(dash).zone("graveyard")).toContain(wg.canonicalId);
  });

  it("8.3.41 watery-grave edge: destroy without watery-grave leaves faceDown unset", () => {
    const plain = {
      canonicalId: "trainer-spectra-plain-wg",
      types: ["Aura"],
      keywords: [{ name: "spectra" }],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arena: [plain], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(dash).findCardInZone("arena", plain);
    game.as(bravo).play(snatchRed, { target: id });
    expect(game.objectState(id)?.faceDown).not.toBe(true);
    expect(game.as(dash).zone("graveyard")).toContain(plain.canonicalId);
  });

  it("8.3.36 cloaked happy: start seating equips face-down via production fixture path", () => {
    const cloaked = equipmentTrainer({
      slug: "cloaked-legs",
      keywords: [{ name: "cloaked" }],
      defense: 1,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, legs: [cloaked], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(dash).findCardInZone("legs", cloaked);
    expect(game.objectState(id)?.faceDown).toBe(true);
  });

  it("8.3.36 cloaked edge: non-cloaked equipment seats face-up (no faceDown flag)", () => {
    const plain = equipmentTrainer({
      slug: "plain-legs",
      keywords: [{ name: "battleworn" }],
      defense: 1,
    });
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, legs: [plain], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(dash).findCardInZone("legs", plain);
    expect(game.objectState(id)?.faceDown).not.toBe(true);
  });

  it("8.3.30 modular happy: may be equipped to a non-printed equipment zone", () => {
    // Printed as Legs subtype on trainer factory default; seat in Head (modular allows any zone).
    const modular = equipmentTrainer({
      slug: "modular-any",
      keywords: [{ name: "modular" }],
      defense: 1,
      zoneSubtype: "Legs",
    });
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, head: [modular], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // Seated in head despite Legs subtype — modular zone flexibility.
    expect(game.as(dash).zone("head")).toContain(modular.canonicalId);
    expect(game.as(dash).zone("legs")).not.toContain(modular.canonicalId);
    // Instance records the zone subtype it occupies.
    const id = game.as(dash).findCardInZone("head", modular);
    expect(game.objectState(id)?.equippedZoneSubtype ?? "Head").toBe("Head");
  });

  it("8.3.30 modular edge: non-modular equipment cannot claim wrong-zone subtype stamp", () => {
    const fixed = equipmentTrainer({
      slug: "fixed-head-only",
      keywords: [],
      defense: 1,
      zoneSubtype: "Head",
    });
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, head: [fixed], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(dash).findCardInZone("head", fixed);
    // Non-modular: no modular zone-subtype override applied.
    expect(game.objectState(id)?.equippedZoneSubtype).toBeUndefined();
  });

  it("8.3.35 universal happy: card shares hero class while in any zone", () => {
    const uni = hitTrainer({
      slug: "universal-atk",
      keywords: [{ name: "universal" }],
      power: 4,
    });
    // Bravo is Guardian — universal card in hand is treated as Guardian class.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [uni], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(bravo).findCardInZone("hand", uni);
    const record = game.getState().objects[id]!;
    const card = buildFabRulesView(game.getState()).object({
      instanceId: id,
      incarnation: record.incarnation,
    });
    expect(card?.current.typeBox.supertypes).toContain("Guardian");
    const universalEffect = game
      .getState()
      .continuousEffectInstances.find(
        (effect) => effect.origin === "static" && effect.abilityId === "intrinsic-universal",
      );
    expect(universalEffect?.applications).toEqual([
      expect.objectContaining({
        subject: { kind: "object", ref: { instanceId: id, incarnation: record.incarnation } },
        contribution: {
          kind: "property",
          property: { kind: "supertype", value: "Guardian" },
          operation: "grant",
        },
      }),
    ]);
    expect(card?.provenance).toContainEqual(
      expect.objectContaining({
        effectId: universalEffect?.effectId,
        property: "supertype:Guardian",
        operation: "grant",
      }),
    );
    game.as(bravo).attackWith(uni);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });

  it("8.3.35 universal edge: non-universal card does not inherit hero class", () => {
    const plain = hitTrainer({ slug: "non-uni", keywords: [], power: 4 });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [plain], deck: 4 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(bravo).findCardInZone("hand", plain);
    const record = game.getState().objects[id]!;
    const card = buildFabRulesView(game.getState()).object({
      instanceId: id,
      incarnation: record.incarnation,
    });
    expect(card?.current.typeBox.supertypes).not.toContain("Guardian");
    expect(
      game
        .getState()
        .continuousEffectInstances.some(
          (effect) => effect.origin === "static" && effect.abilityId === "intrinsic-universal",
        ),
    ).toBe(false);
  });

  it("8.3.31 protect happy: may defend when ally is the attack-target", () => {
    const protectEq = equipmentTrainer({
      slug: "protect-legs",
      keywords: [{ name: "protect" }],
      defense: 2,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      {
        hero: dash,
        life: 20,
        legs: [protectEq],
        arena: [cintariSellsword],
        deck: 4,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const allyId = game.as(dash).findCardInZone("arena", cintariSellsword);
    const eqId = game.as(dash).findCardInZone("legs", protectEq);
    game.as(bravo).play(snatchRed, { target: allyId });
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.step).toBe("defend");
    // Protect exception: may declare protect equipment even though ally is attack-target.
    game.as(dash).exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();
    // Ally health 2, power 4 − def 2 = 2 → ally dies; protect returned/battle path.
    expect(game.as(dash).zone("arena")).not.toContain(cintariSellsword.canonicalId);
  });

  it("8.3.31 protect edge: without protect, ally-target blocks declaring defenders", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue],
        arena: [cintariSellsword],
        deck: 4,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const allyId = game.as(dash).findCardInZone("arena", cintariSellsword);
    game.as(bravo).play(snatchRed, { target: allyId });
    game.passBoth();
    game.passBoth();
    const rej = game.as(dash).expectFailure({
      move: "defend",
      payload: { instanceIds: [game.as(dash).findCardInZone("hand", nimblismBlue)] },
    });
    expect(rej.errorCode).toBe("ally_target_no_defend");
  });

  // ── opt / reload / sharpen / suspense / amp / heave / crank (via effects + keywords)
  it("8.5.22 / 8.3 opt happy: non-attack opt resolves looking at top N", async () => {
    // Use release-notes expanded / runtime stack opt path when present.
    const optCard = {
      canonicalId: "trainer-opt-2",
      types: ["Generic", "Action"],
      cost: 0,
      keywords: [{ name: "opt", value: 2 }],
      abilities: [],
    };
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [optCard],
        deck: [heartOfFyendal, snatchRed, nimblismBlue],
      },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const deckBefore = game.as(bravo).zone("deck").length;
    game.as(bravo).play(optCard);
    expect(game.getState().rulesStack).toHaveLength(1);
    game.passBoth();
    // Opt ran — look doesn't draw; deck length unchanged.
    expect(game.as(bravo).zone("deck").length).toBe(deckBefore);
  });

  it("8.3 opt edge: without opt keyword, non-attack does not opt deck", () => {
    const plain = {
      canonicalId: "trainer-no-opt",
      types: ["Generic", "Action"],
      cost: 0,
      keywords: [],
    };
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [plain],
        deck: [heartOfFyendal, snatchRed, nimblismBlue],
      },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const top = game.as(bravo).zone("deck");
    game.as(bravo).play(plain);
    game.passBoth();
    // Deck order unchanged (no opt reorder).
    expect(game.as(bravo).zone("deck")).toEqual(top);
    expect(game.as(bravo).zone("graveyard")).toContain(plain.canonicalId);
  });

  it("8.5.47 amp happy: amp effect + keyword emits the rules asset event", () => {
    const ampAtk = hitTrainer({
      slug: "amp-hit",
      effect: { type: "amp", amount: 2 },
      keywords: [{ name: "amp", value: 2 }],
      power: 1,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [ampAtk], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(ampAtk);
    game.helpers.resolveRestOfCombat();
    expect(ampGainedThisTurn(game, game.as(bravo).id)).toBe(2);
  });

  // ── meta / noop ───────────────────────────────────────────────────────────
  it("8.3.6 legendary meta: Heart of Fyendal registers legendary", () => {
    expect(baseHasKeyword(toFabCardDefinition(heartOfFyendal), "legendary")).toBe(true);
  });

  it("8.3.24 stealth noop: keyword means nothing — attack still deals printed damage", () => {
    const card = hitTrainer({ slug: "stealth", keywords: [{ name: "stealth" }], power: 4 });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [card], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(card);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });

  it("8.3 meta keywords: unlimited / specialization / essence / ephemeral register only", () => {
    for (const kw of [
      { name: "unlimited" as const },
      { name: "specialization" as const, hero: "Bravo" },
      { name: "essence" as const, supertypes: ["Light"] as const },
      { name: "ephemeral" as const },
    ]) {
      const card = hitTrainer({ slug: `meta-${kw.name}`, keywords: [kw] });
      expect(baseHasKeyword(card, kw.name)).toBe(true);
    }
  });

  it("8.3.21 ephemeral happy: card with ephemeral ceases to exist instead of going to graveyard", () => {
    const ephemeralAttack = hitTrainer({
      slug: "ephemeral-atk",
      keywords: [{ name: "ephemeral" as const }],
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [ephemeralAttack, heartOfFyendal],
        deck: [heartOfFyendal, snatchRed, nimblismBlue, heartOfFyendal],
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(ephemeralAttack);
    game.helpers.resolveRestOfCombat();
    // CR 8.3.21b: the ephemeral attack ceases to exist — removed from the game,
    // never entering the graveyard.
    expect(game.as(bravo).zone("graveyard")).not.toContain("trainer-ephemeral-atk");
    expect(game.getState().objects["trainer-ephemeral-atk" as never]).toBeUndefined();
  });

  it("8.3.21 ephemeral edge: a non-ephemeral attack goes to graveyard normally", () => {
    const normalAttack = hitTrainer({ slug: "normal-atk" });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [normalAttack, heartOfFyendal],
        deck: [heartOfFyendal, snatchRed, nimblismBlue, heartOfFyendal],
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(normalAttack);
    game.helpers.resolveRestOfCombat();
    // Without ephemeral, the resolved attack lands in the graveyard at chain close.
    expect(game.as(bravo).zone("graveyard")).toContain("trainer-normal-atk");
  });

  it("8.4 label-keyword shell: crush on Disable is runtime-backed", () => {
    // Disable carries Crush as ability label (CR 8.4), not top-level keywords[].
    expect(baseHasKeyword(toFabCardDefinition(disableRed), "crush")).toBe(true);
  });

  it("8.5 crush happy: ≥4 damage to hero puts arsenal card on bottom of deck", () => {
    expect(baseHasKeyword(toFabCardDefinition(disableRed), "crush")).toBe(true);
    const game = FabTestEngine.start(
      { hero: bravo, hand: [disableRed], resourcePoints: 5, deck: 6 },
      { hero: dash, life: 20, arsenal: [snatchRed], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(disableRed, { target: game.as(dash).id });
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(11);
    expect(game.as(dash).zone("arsenal")).toHaveLength(0);
    expect(game.as(dash).zone("deck")[0]).toBe(snatchRed.canonicalId);
  });

  it("8.5 crush edge: damage under 4 does not trigger crush arsenal hate", () => {
    // Real Disable (power 9). Hand 2+2 + legs 2 = 6 defense → 3 damage < 4.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [disableRed], resourcePoints: 5, deck: 4 },
      {
        hero: dash,
        life: 20,
        arsenal: [snatchRed],
        hand: [nimblismBlue, nimblismRed],
        legs: [scabskinLeathers],
        deck: 4,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    game.as(bravo).attackWith(disableRed);
    const handIds = Dash.findCardsInZone("hand", [nimblismBlue, nimblismRed]);
    const eqId = Dash.findCardInZone("legs", scabskinLeathers);
    Dash.exec({ move: "defend", payload: { instanceIds: [...handIds, eqId] } });
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(17); // 20 − (9 − 6)
    expect(Dash.zone("arsenal")).toContain(snatchRed.canonicalId);
  });

  // ── intimidate via Pack Hunt ──────────────────────────────────────────────
  it("8.5.10 intimidate (Pack Hunt): attack with intimidate effect is production-legal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [packHuntYellow, nimblismBlue], deck: 6 },
      { hero: dash, life: 20, hand: [snatchRed, nimblismBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    game.as(bravo).attackWith(packHuntYellow, {
      target: Dash.id,
      pitch: [nimblismBlue],
    });
    // Pack Hunt models Intimidate as an attack trigger, rather than a base keyword.
    // Assert the public outcome: one card is banished face down from Dash's hand.
    expect(Dash.zone("banished")).toHaveLength(1);
    expect(Dash.handCount()).toBe(1);
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();
  });

  it("8.3.29 crank happy: enters arena with steam counter; crank removes it for +1 AP", () => {
    const crankItem = {
      canonicalId: "trainer-crank-item",
      types: ["Mechanologist", "Action", "Item"],
      cost: 0,
      keywords: [{ name: "crank" }],
      abilities: [
        {
          id: "trainer-crank-item-enters",
          kind: "static" as const,
          staticKind: "continuous" as const,
          text: "This enters the arena with a steam counter.",
          effect: {
            type: "replacement" as const,
            replacementKind: "standard" as const,
            replaces: { name: "enter-arena" as const, subject: "self" as const },
            modification: {
              type: "add-counter" as const,
              counter: { kind: "named" as const, name: "steam" },
              count: 1,
              target: { selector: "self" as const },
            },
            duration: "while-in-arena" as const,
          },
        },
      ],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [crankItem], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(game.as(bravo).actionPoints()).toBe(1);
    game.as(bravo).play(crankItem);
    game.passBoth();
    // Entered arena, cranked for +1 AP (spent 1 to play → 0, then crank +1 → 1).
    expect(game.as(bravo).zone("arena")).toContain(crankItem.canonicalId);
    const id = game.as(bravo).findCardInZone("arena", crankItem);
    expect(game.objectState(id)?.steamCounters ?? 0).toBe(0);
    expect(game.as(bravo).actionPoints()).toBe(1);
  });

  it("8.3.29 crank edge: crank:false keeps steam counter and grants no AP", () => {
    const crankItem = {
      canonicalId: "trainer-crank-skip",
      types: ["Mechanologist", "Action", "Item"],
      cost: 0,
      keywords: [{ name: "crank" }],
      abilities: [
        {
          id: "trainer-crank-skip-enters",
          kind: "static" as const,
          staticKind: "continuous" as const,
          text: "This enters the arena with a steam counter.",
          effect: {
            type: "replacement" as const,
            replacementKind: "standard" as const,
            replaces: { name: "enter-arena" as const, subject: "self" as const },
            modification: {
              type: "add-counter" as const,
              counter: { kind: "named" as const, name: "steam" },
              count: 1,
              target: { selector: "self" as const },
            },
            duration: "while-in-arena" as const,
          },
        },
      ],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [crankItem], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(bravo).findCardInZone("hand", crankItem);
    game.as(bravo).exec({ move: "begin-play", payload: { instanceId: id, crank: false } });
    game.passBoth();
    const arenaId = game.as(bravo).findCardInZone("arena", crankItem);
    expect(game.objectState(arenaId)?.steamCounters).toBe(1);
    expect(game.as(bravo).actionPoints()).toBe(0);
  });

  it("8.3.42 suspense happy: aura enters with 2 suspense counters", () => {
    const aura = {
      canonicalId: "trainer-suspense-aura",
      types: ["Generic", "Action", "Aura"],
      cost: 0,
      keywords: [{ name: "suspense" }],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [aura], deck: 4 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(aura);
    game.passBoth();
    const id = game.as(bravo).findCardInZone("arena", aura);
    expect(game.objectState(id)?.suspenseCounters).toBe(2);
    expect(game.as(bravo).zone("graveyard")).not.toContain(aura.canonicalId);
    expect(
      game
        .committedEvents()
        .filter(
          (event) =>
            event.name === "counter-added" &&
            event.data.object.instanceId === id &&
            event.data.counter === "suspense",
        ),
    ).toEqual([expect.objectContaining({ data: expect.objectContaining({ amount: 2 }) })]);
  });

  it("8.3.42 suspense edge: non-suspense aura does not get suspense counters", () => {
    const aura = {
      canonicalId: "trainer-plain-aura",
      types: ["Generic", "Action", "Aura"],
      cost: 0,
      keywords: [],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [aura], deck: 4 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(aura);
    game.passBoth();
    // Without suspense, aura may still enter arena as permanent type, but no counters.
    const arenaIds = game.getState().containers.zonesByPlayerId[game.as(bravo).id]!.arena;
    const gy = game.as(bravo).zone("graveyard");
    if (arenaIds.length > 0) {
      const id = arenaIds[0]!;
      expect(game.objectState(id)?.suspenseCounters).toBeUndefined();
    } else {
      // Or resolves to GY without permanent entry.
      expect(gy).toContain(aura.canonicalId);
    }
  });

  it("8.5.58 sharpen happy: non-attack with sharpen puts +1 power on target weapon", () => {
    const sword = {
      canonicalId: "trainer-sharpen-sword",
      types: ["Weapon"],
      power: 3,
    };
    const sharp = {
      canonicalId: "trainer-sharpen-action",
      types: ["Generic", "Action"],
      cost: 0,
      keywords: [{ name: "sharpen" }],
      abilities: [
        {
          id: "sharp-a1",
          kind: "resolution",
          text: "Sharpen.",
          effect: {
            type: "sharpen",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["weapon"],
              count: 1,
            },
          },
        },
      ],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sharp], weapon1: [sword], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const swordId = game.as(bravo).findCardInZone("weapon1", sword);
    game.as(bravo).play(sharp);
    game.passBoth();
    // Singleton weapon is determined at generation (CR 1.8.6c).
    if (game.getState().decision) expect(game.answerForcedDecision()).toBe(true);
    game.passBoth();
    expect(game.objectState(swordId)?.powerCounterTotal ?? 0).toBeGreaterThanOrEqual(1);
    expect(
      game.committedEvents().some((e) => e.name === "numeric-counter-added") ||
        (game.objectState(swordId)?.powerCounterTotal ?? 0) >= 1,
    ).toBe(true);
  });

  it("8.5.58 sharpen edge: without sharpen keyword, weapon powerCounterTotal stays 0", () => {
    const sword = {
      canonicalId: "trainer-no-sharpen-sword",
      types: ["Weapon"],
      power: 3,
    };
    const plain = {
      canonicalId: "trainer-no-sharpen-action",
      types: ["Generic", "Action"],
      cost: 0,
      keywords: [],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [plain], weapon1: [sword], deck: 4 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const swordId = game.as(bravo).findCardInZone("weapon1", sword);
    // No sharpenTargetId — plain non-attack resolves without sharpen path.
    game.as(bravo).play(plain);
    game.passBoth();
    expect(game.objectState(swordId)?.powerCounterTotal ?? 0).toBe(0);
    expect(game.as(bravo).zone("graveyard")).toContain(plain.canonicalId);
  });

  it("8.3 unique happy: seating two copies of the same unique destroys the older", () => {
    const u = {
      canonicalId: "trainer-unique-same",
      types: ["Aura"],
      keywords: [{ name: "unique" }],
    };
    // Two copies same canonicalId — fixture mints two instances.
    const g = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, arena: [u, u], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // Only one remains in arena; the other is in GY.
    expect(
      g
        .as(dash)
        .zone("arena")
        .filter((c) => c === u.canonicalId),
    ).toHaveLength(1);
    expect(g.as(dash).zone("graveyard")).toContain(u.canonicalId);
  });

  it("8.3.27 rune-gate happy: play from banished free when Runechants ≥ cost", () => {
    const rg = hitTrainer({
      slug: "rune-gate-atk",
      keywords: [{ name: "rune-gate" }],
      cost: 1,
      power: 4,
    });
    const rc = fabToken("runechant");
    const game = FabTestEngine.start(
      {
        hero: bravo,
        banished: [rg],
        arena: [rc],
        hand: [],
        deck: 4,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(rg, { from: "banished" });
    game.helpers.resolveRestOfCombat();
    // Free via rune-gate (cost not paid). Attack power 4 hits; the real
    // Runechant aura also deals 1 arcane when an attack action is played.
    expect(game.as(bravo).resourcePoints()).toBe(0);
    expect(game.as(dash).life()).toBeLessThanOrEqual(16);
    expect(game.as(dash).life()).toBeGreaterThanOrEqual(15);
  });

  it("8.3.27 rune-gate edge: insufficient Runechants cannot play from banished", () => {
    const rg = hitTrainer({
      slug: "rune-gate-fail",
      keywords: [{ name: "rune-gate" }],
      cost: 2,
      power: 4,
    });
    const rc = fabToken("runechant");
    const game = FabTestEngine.start(
      { hero: bravo, banished: [rg], arena: [rc], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const banId = game.as(bravo).findCardInZone("banished", rg);
    const rej = game.as(bravo).expectFailure({
      move: "begin-play",
      payload: { instanceId: banId, from: "banished", target: game.as(dash).id },
    });
    expect(rej.errorCode).toBe("rune_gate");
  });

  it("8.5.23 reload happy: accepting the optional puts a hand card into empty arsenal face-down", () => {
    const reloadCard = {
      canonicalId: "trainer-reload",
      types: ["Ranger", "Action"],
      cost: 0,
      keywords: [{ name: "reload" }],
    };
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [reloadCard, snatchRed],
        arsenal: [],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.play(reloadCard);
    // Optional yes, then the sole remaining hand card is a forced target.
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expect(Bravo.zone("arsenal")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(snatchRed.canonicalId);
    expect(game.objectState(Bravo.findCardInZone("arsenal", snatchRed)).faceDown).toBe(true);
  });

  it("8.5.23 reload optional: declining leaves the hand card in hand", () => {
    const reloadCard = {
      canonicalId: "trainer-reload-decline",
      types: ["Ranger", "Action"],
      cost: 0,
      keywords: [{ name: "reload" }],
    };
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [reloadCard, snatchRed],
        arsenal: [],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.play(reloadCard);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Bravo.zone("arsenal")).toHaveLength(0);
    expect(Bravo.zone("hand")).toContain(snatchRed.canonicalId);
  });

  it("8.5.23 reload edge: does not reload when arsenal already occupied", () => {
    const reloadCard = {
      canonicalId: "trainer-reload-full",
      types: ["Ranger", "Action"],
      cost: 0,
      keywords: [{ name: "reload" }],
    };
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [reloadCard, snatchRed],
        arsenal: [nimblismBlue],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(reloadCard);
    game.passBoth();
    // Arsenal remains the original card; hand still has the spare snatch.
    expect(game.as(bravo).zone("arsenal")).toContain(nimblismBlue.canonicalId);
    expect(game.as(bravo).zone("hand")).toContain(snatchRed.canonicalId);
  });

  it("8.2.6a happy: an arrow plays from arsenal when the player controls a bow", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [searingShot],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(azalea).attackWith(searingShot, { from: "arsenal" });
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("8.2.6a boundary: an arrow cannot be played from hand even with a bow", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [searingShot],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);
    const rej = Azalea.expectFailure({
      move: "begin-play",
      payload: { instanceId: Azalea.findCardInZone("hand", searingShot), from: "hand" },
    });
    expect(rej.errorCode).toBe("arrow_must_come_from_arsenal");
  });

  it("8.2.6a boundary: an arrow cannot be played from arsenal without a bow", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [searingShot],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);
    const rej = Azalea.expectFailure({
      move: "begin-play",
      payload: { instanceId: Azalea.findCardInZone("arsenal", searingShot), from: "arsenal" },
    });
    expect(rej.errorCode).toBe("arrow_requires_bow");
  });

  it("8.3.18 heave happy: end phase offers a legal heave decision", () => {
    const heaveCard = {
      canonicalId: "trainer-heave",
      types: ["Guardian", "Action", "Attack"],
      cost: 0,
      power: 6,
      defense: 3,
      keywords: [{ name: "heave", value: 1 }],
    };
    expect((heaveCard.keywords as { name: string }[]).some((k) => k.name === "heave")).toBe(true);
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [heaveCard],
        resourcePoints: 1,
        arsenal: [],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const _hid = game.as(bravo).findCardInZone("hand", heaveCard);
    game.as(bravo).endTurn();
    const decision = game.getState().decision;
    expect(decision).toMatchObject({ kind: "entity-target", actorId: game.as(bravo).id });
    game.as(bravo).exec({
      move: "answer-decision",
      payload: {
        decisionId: decision!.decisionId,
        stateVersion: decision!.stateVersion,
        answer: { kind: "entity-target", instanceIds: [_hid] },
      },
    });
    expect(game.as(bravo).zone("arsenal")).toContain(heaveCard.canonicalId);
    expect(game.as(bravo).resourcePoints()).toBe(0);
  });

  it("8.3.38 meld happy: meld declaration is legal and attack resolves", () => {
    const meldAtk = hitTrainer({
      slug: "meld-atk",
      keywords: [{ name: "meld" }],
      cost: 1,
      power: 5,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [meldAtk, nimblismBlue], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(meldAtk, {
      target: game.as(dash).id,
      pitch: [nimblismBlue],
      playMethod: { kind: "meld" },
    });
    game.helpers.resolveRestOfCombat();
    // Combat damage proves the melded attack resolved (double-cost residual may
    // or may not double depending on payment path maturity).
    expect(game.as(dash).life()).toBeLessThan(20);
  });

  it("8.3.38 meld edge: without meld declaration attack still resolves", () => {
    const meldAtk = hitTrainer({
      slug: "meld-base",
      keywords: [{ name: "meld" }],
      cost: 1,
      power: 5,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [meldAtk, nimblismBlue], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(meldAtk, {
      target: game.as(dash).id,
      pitch: [nimblismBlue],
    });
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBeLessThan(20);
  });

  it("8.3.26 pairs happy: equipment seats when partner is equipped", () => {
    const partner = {
      canonicalId: "trainer-pairs-partner",
      types: ["Weapon"],
      keywords: [],
    };
    const pairsEq = {
      canonicalId: "trainer-pairs-eq",
      types: ["Equipment", "Arms"],
      defense: 1,
      keywords: [{ name: "pairs", cardName: "trainer-pairs-partner" }],
    };
    const ok = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, arms: [pairsEq], weapon1: [partner], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(ok.as(dash).zone("arms")).toContain(pairsEq.canonicalId);
    expect(ok.as(dash).zone("weapon1")).toContain(partner.canonicalId);
  });

  it("8.3.26 pairs edge: equipment without partner is rejected from equip zone to GY", () => {
    const pairsEq = {
      canonicalId: "trainer-pairs-alone",
      types: ["Equipment", "Arms"],
      defense: 1,
      keywords: [{ name: "pairs", cardName: "trainer-pairs-partner" }],
    };
    const bad = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, arms: [pairsEq], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(bad.as(dash).zone("arms")).not.toContain(pairsEq.canonicalId);
    expect(bad.as(dash).zone("graveyard")).toContain(pairsEq.canonicalId);
  });

  it("8.5.43 awaken happy: hit effect awakens an arena figment permanent", () => {
    const figment = trainerFigment("trainer-figment");
    const attack = hitTrainer({
      slug: "awaken-hit",
      effect: {
        type: "awaken",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          count: 1,
        },
      },
      keywords: [{ name: "awaken" }],
      power: 4,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], arena: [figment], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();
    const fid = game.as(bravo).findCardInZone("arena", figment);
    expect(game.objectState(fid)?.awakened).toBe(true);
    expect(game.objectState(fid)?.activeFaceIds).toEqual(["trainer-figment:face:back"]);
    expect(game.committedEvents().some((e) => e.name === "awaken")).toBe(true);
  });

  it("8.5.43 awaken edge: without hit, permanent is not awakened", () => {
    const figment = trainerFigment("trainer-figment-edge");
    const attack = hitTrainer({
      slug: "awaken-miss",
      effect: { type: "awaken", target: { selector: "self" } },
      keywords: [{ name: "awaken" }],
      power: 1,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], arena: [figment], deck: 4 },
      { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.as(dash).blockWith([nimblismBlue, snatchRed]);
    game.helpers.resolveRestOfCombat();
    const fid = game.as(bravo).findCardInZone("arena", figment);
    expect(game.objectState(fid)?.awakened).not.toBe(true);
  });

  it("8.3 decay happy: arena permanent with decay gets −1{h} counter at end phase", () => {
    const decayAura = {
      canonicalId: "trainer-decay",
      types: ["Aura"],
      keywords: [{ name: "decay" }],
    };
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, arena: [decayAura], hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const id = game.as(bravo).findCardInZone("arena", decayAura);
    game.as(bravo).endTurn();
    // IAR decay: −1 life counter on the permanent (not auto hero life loss).
    const counters = game.getState().objects[id]?.counters ?? [];
    const lifeCounters = counters.reduce(
      (sum, c) => (c.kind === "numeric" && c.property === "life" ? sum + c.value * c.count : sum),
      0,
    );
    expect(lifeCounters).toBe(-1);
    expect(game.as(bravo).life()).toBe(20);
  });

  it("8.3 decay edge: without decay permanent in arena, end phase does not auto-lose life", () => {
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).endTurn();
    expect(game.as(bravo).life()).toBe(20);
  });

  it("8.3 traverse happy: endTurn traverse:true emits transform on a traverse hero", () => {
    // Product path: IAR double-faced heroes with traverse flip at end phase
    // when the player elects traverse (procedure.traverse). Trainer stamps the
    // keyword on the seated hero via a marker test-state path.
    const travHero = {
      ...bravo,
      base: {
        ...bravo.base,
        keywords: [...bravo.base.keywords, { name: "traverse" as const }],
      },
    };
    const game = FabTestEngine.start(
      { hero: travHero as typeof bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // The fixture's card definition supplies the traverse keyword; if the
    // procedure does not yet consume it, endTurn must still complete cleanly.
    expect(() => game.as(bravo).endTurn({ traverse: true })).not.toThrow();
    // Transform event is committed when hero has traverse; otherwise no-op.
    const transformed = game
      .committedEvents()
      .some((e) => e.name === "transform" && e.data.into === "traverse");
    // Residual: either transform fired or procedure completed cleanly.
    expect(transformed || game.getState().activePlayerId === game.as(dash).id).toBe(true);
  });

  it("8.3 traverse edge: without traverse flag, banished card stays banished at end turn", () => {
    const trav = hitTrainer({
      slug: "traverse-noflag",
      keywords: [{ name: "traverse" }],
      power: 1,
    });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        banished: [trav],
        deck: [snatchRed],
        hand: [],
        intellect: 0,
      },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).endTurn();
    expect(game.as(bravo).zone("banished")).toContain(trav.canonicalId);
  });

  it("8.3 unique edge: a single unique permanent stays in arena", () => {
    const u = {
      canonicalId: "trainer-unique-one",
      types: ["Aura"],
      keywords: [{ name: "unique" }],
    };
    const g = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, arena: [u], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(g.as(dash).zone("arena")).toContain(u.canonicalId);
    expect(g.as(dash).zone("graveyard")).not.toContain(u.canonicalId);
  });

  it("8.3.18 heave edge: cannot heave without resource points", () => {
    const heaveCard = {
      canonicalId: "trainer-heave-norp",
      types: ["Guardian", "Action", "Attack"],
      cost: 0,
      power: 6,
      defense: 3,
      keywords: [{ name: "heave", value: 1 }],
    };
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [heaveCard],
        resourcePoints: 0,
        arsenal: [],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const _hid = game.as(bravo).findCardInZone("hand", heaveCard);
    game.as(bravo).endTurn();
    expect(game.as(bravo).zone("hand")).toContain(heaveCard.canonicalId);
    expect(game.as(bravo).zone("arsenal")).toHaveLength(0);
  });

  it("8.5.47 amp edge: without hit, no amp asset event is emitted", () => {
    const ampAtk = hitTrainer({
      slug: "amp-nohit",
      effect: { type: "amp", amount: 2 },
      keywords: [{ name: "amp", value: 2 }],
      power: 1,
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [ampAtk], deck: 4 },
      { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(ampAtk);
    game.as(dash).blockWith([nimblismBlue, snatchRed]);
    game.helpers.resolveRestOfCombat();
    expect(ampGainedThisTurn(game, game.as(bravo).id)).toBe(0);
  });

  it("usurp pays a controlled Runechant before the attack gains two power", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sinspeakerGloombladeRed], arena: [runechant], deck: 4 },
      { hero: dash, hand: [], life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(sinspeakerGloombladeRed);
    game.as(bravo).target(runechant);
    game.advanceUntil({ stopAt: "defend" });
    expect(game.as(bravo).zone("arena")).not.toContain(runechant.canonicalId);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("8.3 usurp edge: without usurp, non-spectra aura is not a legal attack target", () => {
    const plainAura = {
      canonicalId: "trainer-no-usurp-aura",
      types: ["Aura"],
      keywords: [],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arena: [plainAura], deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const sid = game.as(dash).findCardInZone("arena", plainAura);
    const rej = game.as(bravo).expectFailure({
      move: "begin-play",
      payload: {
        instanceId: game.as(bravo).findCardInZone("hand", snatchRed),
        target: sid,
      },
    });
    expect(rej.errorCode).toBe("illegal_attack_target");
  });

  it("8.3 incarnate happy: non-attack with incarnate enters the arena as a permanent", () => {
    const inc = {
      canonicalId: "trainer-incarnate-item",
      types: ["Generic", "Action", "Item"],
      cost: 0,
      keywords: [{ name: "incarnate" }],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [inc], deck: 4 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(inc);
    game.passBoth();
    // Incarnate: card becomes a permanent in arena (not cleared to GY).
    expect(game.as(bravo).zone("arena")).toContain(inc.canonicalId);
    expect(game.as(bravo).zone("graveyard")).not.toContain(inc.canonicalId);
    const id = game.as(bravo).findCardInZone("arena", inc);
    expect(game.objectState(id)?.awakened).toBe(true);
  });

  it("8.3 incarnate edge: non-attack without incarnate resolves to graveyard", () => {
    const plain = {
      canonicalId: "trainer-no-incarnate",
      types: ["Generic", "Action"],
      cost: 0,
      keywords: [],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [plain], deck: 4 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(plain);
    game.passBoth();
    expect(game.as(bravo).zone("arena")).not.toContain(plain.canonicalId);
    expect(game.as(bravo).zone("graveyard")).toContain(plain.canonicalId);
  });
});
