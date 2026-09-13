import { describe, expect, it } from "vite-plus/test";
import { defineFleshAndBloodCard } from "@tcg/flesh-and-blood-types";

import {
  createFabMatchContext,
  expectFabCard,
  expectFabUnplayable,
  FabTestEngine,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../index.ts";
import { invokeYenduraiRed } from "../../../cards/src/cards/actions/invoke-yendurai.ts";
import { ash } from "../../../cards/src/cards/tokens/ash.ts";
import { silkenForm } from "../../../cards/src/cards/equipment/silken-form.ts";
import { dromaiAshArtist } from "../../../cards/src/cards/heroes/dromai-ash-artist.ts";
import { constructNitroMechanoidYellow } from "../../../cards/src/cards/actions/construct-nitro-mechanoid.ts";
import { loadFleshAndBloodStructuredCards } from "../../../cards/src/runtime-registry.ts";
import { galvanicBender } from "../../../cards/src/cards/equipment/galvanic-bender.ts";
import { misfireDampener } from "../../../cards/src/cards/equipment/misfire-dampener.ts";
import { dashInventorExtraordinaire } from "../../../cards/src/cards/heroes/dash-inventor-extraordinaire.ts";
import { tekloFoundryHeart } from "../../../cards/src/cards/equipment/teklo-foundry-heart.ts";
import { achillesAccelerator } from "../../../cards/src/cards/equipment/achilles-accelerator.ts";
import { tekloPlasmaPistol } from "../../../cards/src/cards/weapons/teklo-plasma-pistol.ts";
import { viziertronicModelI } from "../../../cards/src/cards/equipment/viziertronic-model-i.ts";
import { hyperDriver } from "../../../cards/src/cards/tokens/hyper-driver.ts";
import { bamBamYellow } from "../../../cards/src/cards/actions/bam-bam.ts";
import { bravo, nimblismBlue, sigilOfSolaceRed, snatchRed } from "./fixtures.ts";

const loadedConstructNitroPhysical = (
  await loadFleshAndBloodStructuredCards([constructNitroMechanoidYellow.canonicalId])
).get(constructNitroMechanoidYellow.canonicalId);
if (!loadedConstructNitroPhysical) throw new Error("Missing physical Construct Nitro Mechanoid");
const constructNitroPhysical = loadedConstructNitroPhysical;

const selfNegatingAction = defineFleshAndBloodCard({
  canonicalId: "test:self-negating-action",
  slug: "self-negating-action",
  types: ["Action"],
  cost: 0,
  abilities: [
    {
      id: "self-negating-action-a1",
      kind: "resolution",
      text: "Negate this.",
      effect: { type: "negate", target: { selector: "self" } },
    },
  ],
});

const stealConstructInstant = defineFleshAndBloodCard({
  canonicalId: "test:steal-construct-instant",
  slug: "steal-construct-instant",
  types: ["Instant"],
  cost: 0,
  abilities: [
    {
      id: "steal-construct-instant-a1",
      kind: "resolution",
      text: "Steal target object an opponent controls in the arena.",
      effect: {
        type: "gain-control",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "opponent",
          zones: ["permanent"],
          count: 1,
        },
        controller: "controller",
        duration: "this-turn",
      },
      label: { name: "steal" },
    },
  ],
});

const attachPhantasmInstant = defineFleshAndBloodCard({
  canonicalId: "test:attach-phantasm-instant",
  slug: "attach-phantasm-instant",
  types: ["Instant"],
  cost: 0,
  abilities: [
    {
      id: "attach-phantasm-instant-a1",
      kind: "resolution",
      text: "Target action card gains phantasm this turn.",
      effect: {
        type: "grant-property",
        property: { kind: "keyword", keyword: { name: "phantasm" } },
        target: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["stack"],
          filter: {
            typeBox: {
              types: ["Action"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
      },
    },
  ],
});

function restore(
  game: ReturnType<typeof FabTestEngine.start>,
): ReturnType<typeof FabTestEngine.start> {
  const state = game.getState();
  return FabTestEngine.fromState(
    restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    ),
  ).configure({ autoPassPriority: false, autoPitch: false, pitchStack: "manual" });
}

function setup(withSilkenForm = false): ReturnType<typeof FabTestEngine.start> {
  return FabTestEngine.start(
    {
      hero: dromaiAshArtist,
      ...(withSilkenForm ? { arms: [silkenForm] } : {}),
      arena: [ash],
      hand: [invokeYenduraiRed, nimblismBlue, sigilOfSolaceRed, snatchRed],
      arsenal: [snatchRed],
      actionPoints: 1,
      resourcePoints: 1,
      deck: 8,
    },
    { hero: bravo, deck: 8 },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
}

function setupConstruct(
  staleResponse = false,
  controlChange = false,
  withAttachedEffect = false,
): ReturnType<typeof FabTestEngine.start> {
  return FabTestEngine.start(
    {
      hero: dashInventorExtraordinaire,
      head: [viziertronicModelI],
      chest: [tekloFoundryHeart],
      arms: [staleResponse ? misfireDampener : galvanicBender],
      legs: [achillesAccelerator],
      weapon1: [tekloPlasmaPistol],
      arena: [
        { card: hyperDriver, state: { steamCounters: 1 } },
        { card: hyperDriver, state: { steamCounters: 1 } },
        { card: hyperDriver, state: { steamCounters: 1 } },
      ],
      hand: [constructNitroPhysical, nimblismBlue, sigilOfSolaceRed, snatchRed],
      arsenal: [snatchRed],
      actionPoints: 1,
      resourcePoints: 4,
      deck: 8,
    },
    {
      hero: bravo,
      hand: controlChange
        ? [stealConstructInstant, nimblismBlue, nimblismBlue, nimblismBlue]
        : [
            bamBamYellow,
            nimblismBlue,
            sigilOfSolaceRed,
            withAttachedEffect ? attachPhantasmInstant : snatchRed,
          ],
      arsenal: [snatchRed],
      deck: 8,
    },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
}

function chooseOnlyTarget(game: ReturnType<typeof FabTestEngine.start>): string {
  const Dash = game.as(dashInventorExtraordinaire);
  const decision = Dash.expectDecision("entity-target");
  expect(decision.candidates).toHaveLength(decision.max);
  const ids = decision.candidates.map((candidate) => candidate.instanceId);
  Dash.exec({
    move: "answer-decision",
    payload: {
      decisionId: decision.decisionId,
      stateVersion: decision.stateVersion,
      answer: { kind: "entity-target", instanceIds: ids },
    },
  });
  return ids.join(",");
}

function announceTargetAndPay(game: ReturnType<typeof FabTestEngine.start>): {
  invokeId: string;
  ashId: string;
} {
  const Dromai = game.as(dromaiAshArtist);
  const invokeId = game.findCardInZone(Dromai.id, "hand", invokeYenduraiRed);
  const ashId = game.findCardInZone(Dromai.id, "arena", ash);

  Dromai.exec({ move: "begin-play", payload: { instanceId: invokeId } });
  const targetDecision = game.getState().decision;
  expect(targetDecision?.kind).toBe("entity-target");
  if (targetDecision?.kind !== "entity-target") throw new Error("Expected Ash declaration.");
  expect(targetDecision.candidates.map((candidate) => candidate.instanceId)).toContain(ashId);
  expect(Dromai.zone("hand")).toHaveLength(4);
  expect(Dromai.zone("arsenal")).toEqual([snatchRed.canonicalId]);
  expect(Dromai.resourcePoints()).toBe(1);

  Dromai.chooseTargets(Dromai.cardIn("arena", ash));
  expect(Dromai.resourcePoints()).toBe(0);
  return { invokeId, ashId };
}

describe("Invocation / Construct resolving-card transform", () => {
  it("resolves a layer that moves and removes its own source without duplicate cleanup", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [selfNegatingAction, nimblismBlue, sigilOfSolaceRed, snatchRed],
        arsenal: [snatchRed],
        deck: 8,
      },
      { hero: dromaiAshArtist, deck: 8 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const instanceId = game.findCardInZone(Bravo.id, "hand", selfNegatingAction);

    Bravo.exec({ move: "begin-play", payload: { instanceId } });
    game.passBoth();

    expect(Bravo.zone("graveyard")).toContain(selfNegatingAction.canonicalId);
    expect(game.getState().rulesStack).toEqual([]);
    expect(
      game.committedEvents().filter((event) => event.name === "remove-rules-layer"),
    ).toHaveLength(1);
  });

  it("Invoke Yendurai declares Ash before payment, hosts it atomically, and survives restore", () => {
    let game = setup(true);
    const Dromai = game.as(dromaiAshArtist);
    const invokeId = game.findCardInZone(Dromai.id, "hand", invokeYenduraiRed);
    const ashId = game.findCardInZone(Dromai.id, "arena", ash);
    Dromai.exec({ move: "begin-play", payload: { instanceId: invokeId } });
    expect(game.getState().decision?.kind).toBe("entity-target");
    game = restore(game);
    const RestoredDromai = game.as(dromaiAshArtist);
    expect(RestoredDromai.resourcePoints()).toBe(1);
    RestoredDromai.chooseTargets(RestoredDromai.cardIn("arena", ash));
    expect(RestoredDromai.resourcePoints()).toBe(0);

    game.passBoth();
    const state = game.getState();
    expect(RestoredDromai.zone("arena")).toContain(invokeYenduraiRed.canonicalId);
    expect(RestoredDromai.zone("arena")).not.toContain(ash.canonicalId);
    expect(state.containers.subcardsByHostId[invokeId]).toEqual([ashId]);
    expect(state.objects[ashId]?.incarnation).toBeGreaterThan(1);
    expect(state.objects[invokeId]?.activeFace).toMatchObject({
      kind: "paired",
      activeFaceIds: [`${invokeYenduraiRed.canonicalId}:face:back`],
    });
    expectFabCard(RestoredDromai, invokeYenduraiRed).toHaveKeyword("phantasm");
    expect(RestoredDromai.actionPoints()).toBe(1);

    game = restore(game);
    expect(game.getState().containers.subcardsByHostId[invokeId]).toEqual([ashId]);
    expect(game.getState().objects[invokeId]?.activeFace).toMatchObject({
      activeFaceIds: [`${invokeYenduraiRed.canonicalId}:face:back`],
    });
    expectFabCard(game.as(dromaiAshArtist), invokeYenduraiRed).toHaveKeyword("phantasm");
    const MaterialDromai = game.as(dromaiAshArtist);
    expectFabUnplayable(() => MaterialDromai.activate(silkenForm), /required activation target/i);
    expect(game.getState().containers.subcardsByHostId[invokeId]).toEqual([ashId]);
    expect(MaterialDromai.zone("arena")).not.toContain(ash.canonicalId);
    expect(MaterialDromai.zone("arena")).not.toContain("token:aether-ashwing");
  });

  it("a declared Ash that transforms in response is stale, but Invocation still enters back-face", () => {
    const game = setup(true);
    const Dromai = game.as(dromaiAshArtist);
    const { invokeId, ashId } = announceTargetAndPay(game);

    Dromai.activate(silkenForm);
    if (game.getState().decision?.kind === "entity-target") {
      Dromai.chooseTargets(Dromai.cardIn("arena", ash));
    }
    game.passBoth();
    expect(Dromai.zone("arena")).toContain("token:aether-ashwing");

    game.passBoth();
    expect(Dromai.zone("arena")).toContain(invokeYenduraiRed.canonicalId);
    expect(game.getState().containers.subcardsByHostId[invokeId]).toBeUndefined();
    expect(game.getState().objects[ashId]?.canonicalId).toBe("token:aether-ashwing");
    expect(game.getState().objects[invokeId]?.activeFace).toMatchObject({
      activeFaceIds: [`${invokeYenduraiRed.canonicalId}:face:back`],
    });
    expect(Dromai.actionPoints()).toBe(1);
    expect(Dromai.zone("arsenal")).toEqual([snatchRed.canonicalId]);
  });

  it("Construct Nitro declares six exact groups and atomically hosts all eight sources", () => {
    let game = setupConstruct();
    let Dash = game.as(dashInventorExtraordinaire);
    const constructId = game.findCardInZone(Dash.id, "hand", constructNitroMechanoidYellow);
    const expectedChildren = [
      game.findCardInZone(Dash.id, "head", viziertronicModelI),
      game.findCardInZone(Dash.id, "chest", tekloFoundryHeart),
      game.findCardInZone(Dash.id, "arms", galvanicBender),
      game.findCardInZone(Dash.id, "legs", achillesAccelerator),
      game.findCardInZone(Dash.id, "weapon1", tekloPlasmaPistol),
      ...game.findCardsInZone(Dash.id, "arena", [hyperDriver, hyperDriver, hyperDriver]),
    ];

    Dash.exec({ move: "begin-play", payload: { instanceId: constructId } });
    expect(Dash.zone("hand")).toHaveLength(4);
    expect(Dash.zone("arsenal")).toEqual([snatchRed.canonicalId]);
    expect(Dash.resourcePoints()).toBe(4);
    const declaredGroups: string[] = [];
    declaredGroups.push(chooseOnlyTarget(game));
    declaredGroups.push(chooseOnlyTarget(game));
    declaredGroups.push(chooseOnlyTarget(game));
    game = restore(game);
    Dash = game.as(dashInventorExtraordinaire);
    declaredGroups.push(chooseOnlyTarget(game));
    declaredGroups.push(chooseOnlyTarget(game));
    declaredGroups.push(chooseOnlyTarget(game));
    expect(declaredGroups).toHaveLength(6);
    expect(new Set(declaredGroups.flatMap((group) => group.split(","))).size).toBe(8);
    expect(Dash.resourcePoints()).toBe(0);
    game.passBoth();
    const state = game.getState();
    expect(state.containers.subcardsByHostId[constructId]).toEqual(expectedChildren);
    expect(state.objects[constructId]?.activeFace).toMatchObject({
      family: "flip",
      activeFaceIds: [`${constructNitroMechanoidYellow.canonicalId}:face:back`],
    });
    expect(Dash.zone("arena")).toContain(constructNitroMechanoidYellow.canonicalId);
    expectFabCard(Dash, constructNitroMechanoidYellow).toHavePower(6);
    expect(Dash.actionPoints()).toBe(1);
    expect(
      game
        .committedEvents()
        .filter(
          (event) =>
            event.name === "transform" && event.data.destination?.kind === "resolving-card",
        ),
    ).toHaveLength(1);

    game = restore(game);
    expect(game.getState().containers.subcardsByHostId[constructId]).toEqual(expectedChildren);
    expectFabCard(game.as(dashInventorExtraordinaire), constructNitroMechanoidYellow).toHavePower(
      6,
    );

    const RestoredDash = game.as(dashInventorExtraordinaire);
    const Bravo = game.as(bravo);
    RestoredDash.endTurn();
    Bravo.attackWith(bamBamYellow, { pitch: [nimblismBlue] });
    // Nitro Mechanoid is an Item. The only legal hit-destroy subject is
    // determined (CR 1.8.6c).
    game.helpers.resolveUntilIdle();
    expect(RestoredDash.zone("graveyard")).toEqual(
      expect.arrayContaining(
        expectedChildren.slice(0, 5).map((id) => game.getState().objects[id]!.canonicalId),
      ),
    );
    expect(expectedChildren.slice(5).every((id) => game.getState().objects[id] === undefined)).toBe(
      true,
    );
    expect(game.getState().containers.subcardsByHostId[constructId]).toBeUndefined();
    expect(RestoredDash.zone("graveyard")).toContain(constructNitroMechanoidYellow.canonicalId);
    // CR 9.1.3b: leaving the arena makes this a new object, so the same
    // physical Construct returns to its front face rather than remaining Nitro.
    expect(game.getState().objects[constructId]?.activeFace).toMatchObject({
      family: "flip",
      activeFaceIds: [`${constructNitroMechanoidYellow.canonicalId}:face:front`],
    });
  });

  it("CR 9.1.2c: an exact-object effect remains attached when Construct Nitro changes face", () => {
    const game = setupConstruct(false, false, true);
    const Dash = game.as(dashInventorExtraordinaire);
    const Bravo = game.as(bravo);
    const constructId = game.findCardInZone(Dash.id, "hand", constructNitroMechanoidYellow);

    Dash.exec({ move: "begin-play", payload: { instanceId: constructId } });
    for (let group = 0; group < 6; group += 1) chooseOnlyTarget(game);
    const stackObject = game.getState().objects[constructId]!;

    game.helpers.passPriorityTo(Bravo);
    Bravo.play(attachPhantasmInstant);
    // Construct is the sole Action card on the stack, so normal declaration
    // auto-selects it without bypassing the public target path.
    game.passBoth();

    expect(Dash.zone("stack")).toContain(constructNitroMechanoidYellow.canonicalId);
    expectFabCard(Dash, constructNitroMechanoidYellow).toHaveKeyword("phantasm");
    const attachedEffect = game
      .getState()
      .continuousEffectInstances.find((effect) =>
        effect.initialSubjects.some((subject) => subject.instanceId === constructId),
      );
    expect(attachedEffect).toBeDefined();

    game.passBoth();
    const nitro = game.getState().objects[constructId]!;
    expect(nitro.instanceId).toBe(stackObject.instanceId);
    expect(nitro.incarnation).toBe(stackObject.incarnation);
    expect(nitro.activeFace).toMatchObject({
      family: "flip",
      activeFaceIds: [`${constructNitroMechanoidYellow.canonicalId}:face:back`],
    });
    expectFabCard(Dash, constructNitroMechanoidYellow).toHaveKeyword("phantasm");
    expect(
      game
        .getState()
        .continuousEffectInstances.some((effect) => effect.effectId === attachedEffect?.effectId),
    ).toBe(true);
  });

  it("Material follows the exact host when an opponent gains control", () => {
    const game = setupConstruct(false, true);
    const Dash = game.as(dashInventorExtraordinaire);
    const Bravo = game.as(bravo);
    const constructId = game.findCardInZone(Dash.id, "hand", constructNitroMechanoidYellow);

    Dash.exec({ move: "begin-play", payload: { instanceId: constructId } });
    for (let group = 0; group < 6; group += 1) chooseOnlyTarget(game);
    game.passBoth();
    expectFabCard(Dash, constructNitroMechanoidYellow).toHavePower(6);

    Dash.endTurn();
    Bravo.play(stealConstructInstant);
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).toContain(constructNitroMechanoidYellow.canonicalId);
    expect(Dash.zone("arena")).not.toContain(constructNitroMechanoidYellow.canonicalId);
    expect(game.getState().containers.subcardsByHostId[constructId]).toContainEqual(
      expect.any(String),
    );
    expectFabCard(Bravo, constructNitroMechanoidYellow).toHavePower(6);
  });

  it("Construct Nitro negates atomically when a declared equipment is stale", () => {
    const game = setupConstruct(true);
    const Dash = game.as(dashInventorExtraordinaire);
    const constructId = game.findCardInZone(Dash.id, "hand", constructNitroMechanoidYellow);
    const sourceIds = [
      game.findCardInZone(Dash.id, "head", viziertronicModelI),
      game.findCardInZone(Dash.id, "chest", tekloFoundryHeart),
      game.findCardInZone(Dash.id, "arms", misfireDampener),
      game.findCardInZone(Dash.id, "legs", achillesAccelerator),
      game.findCardInZone(Dash.id, "weapon1", tekloPlasmaPistol),
      ...game.findCardsInZone(Dash.id, "arena", [hyperDriver, hyperDriver, hyperDriver]),
    ];

    Dash.exec({ move: "begin-play", payload: { instanceId: constructId } });
    for (let group = 0; group < 6; group += 1) chooseOnlyTarget(game);
    expect(Dash.resourcePoints()).toBe(0);

    Dash.activate(misfireDampener);
    game.passBoth();
    expect(Dash.zone("graveyard")).toContain(misfireDampener.canonicalId);
    game.passBoth();

    expect(Dash.zone("graveyard")).toContain(constructNitroMechanoidYellow.canonicalId);
    expect(Dash.zone("arena")).not.toContain(constructNitroMechanoidYellow.canonicalId);
    expect(game.getState().containers.subcardsByHostId[constructId]).toBeUndefined();
    expect(
      game
        .committedEvents()
        .filter(
          (event) =>
            event.name === "transform" && event.data.destination?.kind === "resolving-card",
        ),
    ).toHaveLength(0);
    for (const sourceId of sourceIds.filter((id) => id !== sourceIds[2])) {
      expect(game.getState().objects[sourceId]?.history.moves.at(-1)?.to.zone).not.toBe("under");
    }
    expect(Dash.zone("arsenal")).toEqual([snatchRed.canonicalId]);
  });
});
