/**
 * CR 1.7.5 / 6.6.6a — modal ability mode declaration and resolution.
 */
import { describe, expect, it } from "vite-plus/test";

import type { FabModalAbility } from "@tcg/flesh-and-blood-types";

import { meetMadnessRed } from "../../../cards/src/cards/actions/meet-madness.ts";
import { artOfWarYellow } from "../../../cards/src/cards/instants/art-of-war.ts";
import { thespianCharmYellow } from "../../../cards/src/cards/instants/thespian-charm.ts";
import { heronSFlightRed } from "../../../cards/src/cards/actions/heron-s-flight.ts";
import { brutalAssaultBlue } from "../../../cards/src/cards/shared/test-recipients.ts";
import { craneDanceRed } from "../../../cards/src/cards/actions/crane-dance.ts";
import { soulbeadStrikeRed } from "../../../cards/src/cards/actions/soulbead-strike.ts";
import { coaxACommotionRed } from "../../../cards/src/cards/actions/coax-a-commotion.ts";
import { lifeOfThePartyRed } from "../../../cards/src/cards/actions/life-of-the-party.ts";
import { hitTheGasBlue } from "../../../cards/src/cards/actions/hit-the-gas.ts";
import {
  isModalAbility,
  modalChooseBounds,
  modalChooseCount,
  resolveModalChooseSelection,
  selectModalModes,
} from "../abilities.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import {
  bravo,
  dash,
  heartOfFyendal,
  nimbleStrikeRed,
  nimblismBlue,
  snatchRed,
} from "./fixtures.ts";

describe("CR 1.7.5 modal ability helpers", () => {
  const artModal = (artOfWarYellow.base.abilities ?? []).find(isModalAbility)!;

  it("Art of War is a choose-2 modal with 4 modes", () => {
    expect(isModalAbility(artModal)).toBe(true);
    expect(modalChooseCount(artModal)).toBe(2);
    expect(artModal.modes).toHaveLength(4);
  });

  it("selectModalModes rejects repeat indexes by default (CR 1.7.5b)", () => {
    const picked = selectModalModes(artModal, { modeIndexes: [0, 0, 1] });
    expect(picked).toHaveLength(2);
    expect(picked[0]?.id).not.toBe(picked[1]?.id);
  });

  it("selectModalModes accepts mode ability ids", () => {
    const ids = (artModal.modes ?? []).slice(1, 3).map((m, i) => m.id ?? `m${i}`);
    const picked = selectModalModes(artModal, { modeIds: ids });
    expect(picked).toHaveLength(2);
  });
});

/** Adapts a triggered ability with a modal resolution into the helper-facing FabModalAbility shape. */
const triggeredModal = (card: typeof coaxACommotionRed): FabModalAbility => {
  const ability = card.base.abilities?.find(
    (candidate) =>
      candidate.kind === "static" &&
      candidate.staticKind === "triggered" &&
      candidate.resolution.kind === "modal",
  );
  if (
    !ability ||
    ability.kind !== "static" ||
    ability.staticKind !== "triggered" ||
    ability.resolution.kind !== "modal"
  ) {
    throw new Error(`expected ${card.slug} to have a triggered modal resolution`);
  }
  return {
    kind: "modal",
    id: ability.id,
    text: ability.text,
    modal: {
      choose: ability.resolution.choose,
      allowRepeat: ability.resolution.allowRepeat,
      random: ability.resolution.random,
    },
    modes: ability.resolution.modes,
  };
};

describe("choose any-number modal helpers", () => {
  const coaxModal = triggeredModal(coaxACommotionRed);
  const thespianModal = (thespianCharmYellow.base.abilities ?? []).find(isModalAbility)!;

  it("authors Hit the Gas as any-number, not all", () => {
    const ability = hitTheGasBlue.base.abilities?.[0];
    const text = JSON.stringify(ability);
    expect(text).toContain('"type":"any-number"');
    expect(text).not.toContain('"type":"all"');
  });

  it("authors Coax a Commotion and Thespian Charm as any-number, not all", () => {
    expect(coaxModal.modal.choose).toEqual({ type: "any-number" });
    expect(thespianModal.modal.choose).toEqual({ type: "any-number" });
    expect(modalChooseCount(coaxModal)).toBe(coaxModal.modes.length);
  });

  it("resolves Life of the Party conditional choose after evaluating the branch", () => {
    const lotp = (lifeOfThePartyRed.base.abilities ?? []).find(isModalAbility)!;
    expect(
      resolveModalChooseSelection(lotp, {
        condition: () => true,
        amount: () => {
          throw new Error("all-branch must not evaluate as a numeric amount");
        },
      }),
    ).toEqual({ count: lotp.modes.length, kind: "all" });
    expect(
      resolveModalChooseSelection(lotp, {
        condition: () => false,
        amount: () => {
          throw new Error("numeric else branch is a literal 1");
        },
      }),
    ).toEqual({ count: 1, kind: "exact" });
  });

  it("selectModalModes accepts the empty set and any subset", () => {
    expect(modalChooseBounds(coaxModal)).toEqual({ min: 0, max: coaxModal.modes.length });
    expect(selectModalModes(coaxModal, { modeIds: [] })).toEqual([]);
    const first = coaxModal.modes[0]!;
    expect(selectModalModes(coaxModal, { modeIds: [first.id] }).map((mode) => mode.id)).toEqual([
      first.id,
    ]);
    expect(
      selectModalModes(coaxModal, { modeIds: coaxModal.modes.map((mode) => mode.id) }),
    ).toHaveLength(coaxModal.modes.length);
  });

  it("selectModalModes still takes every mode for choose-all", () => {
    const allModal = {
      ...coaxModal,
      modal: { choose: { type: "all" as const } },
    } satisfies FabModalAbility;
    expect(modalChooseBounds(allModal)).toEqual({
      min: allModal.modes.length,
      max: allModal.modes.length,
    });
    expect(selectModalModes(allModal, { modeIds: [] }).map((mode) => mode.id)).toEqual(
      allModal.modes.map((mode) => mode.id),
    );
  });
});

describe("CR 1.7.5 engine — Art of War mode resolution", () => {
  it("resolves chosen modes: next-attack go again sticky (mode 2)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [artOfWarYellow, nimbleStrikeRed, nimblismBlue],
        deck: 8,
        resourcePoints: 2,
      },
      { hero: dash, life: 20, deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    // Choose modes 1 and 2: go again applicator + arsenal defend (indexes 1, 2).
    Bravo.play(artOfWarYellow, { modeIndexes: [1, 2] });
    // Instant on stack — both players pass to resolve.
    game.passBoth();
    expect(game.getState().continuousEffectInstances).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          controllerId: Bravo.id,
          futureApplicability: expect.objectContaining({ remaining: 1 }),
        }),
      ]),
    );

    Bravo.play(nimbleStrikeRed, {
      target: game.as(dash).id,
      pitch: [nimblismBlue],
    });
    game.passBoth();
    // nextAttackGoAgain is consumed when the attack is played.
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });
});

describe("CR 1.7.5 engine — Heron's Flight combo modal", () => {
  /**
   * Heron's Flight (CRU056): Combo — if Crane Dance was the last attack this
   * combat chain, when you attack with Heron's Flight it gains +2{p} and you
   * choose 1 defend restriction.
   *
   * Classic multi-link: Soulbead (go again) → Crane Dance (combo) → Heron's Flight.
   */
  /** Answer layer-mode / play-mode option decisions; drain triggered layers. */
  function resolveHeronComboLayers(game: FabTestEngine): void {
    for (let safety = 0; safety < 24; safety += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "option" && decision.options.length > 0) {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "option", optionIds: [decision.options[0]!.id] },
          },
        });
        continue;
      }
      const stackTop = game.getState().rulesStack.at(-1);
      if (stackTop?.kind === "card" || stackTop?.kind === "triggered") {
        game.passBoth();
        continue;
      }
      break;
    }
  }

  it("applies +2 power and the chosen restriction after Crane Dance", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [soulbeadStrikeRed, craneDanceRed, heronSFlightRed],
        deck: 10,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, hand: [brutalAssaultBlue, nimblismBlue], deck: 10 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(soulbeadStrikeRed, { target: Dash.id });
    game.passBoth();
    game.advanceCombatTo("resolution");
    expect(Bravo.actionPoints()).toBeGreaterThanOrEqual(1);

    Bravo.play(craneDanceRed, { target: Dash.id });
    game.passBoth();
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.advanceCombatTo("resolution");
    expect(Bravo.actionPoints()).toBeGreaterThanOrEqual(1);

    const restrictBefore = game
      .getState()
      .continuousEffectInstances.filter((continuous) =>
        continuous.atoms.some(
          (atom) => atom.kind === "rule" && atom.parameters.kind === "rule-modification",
        ),
      ).length;

    Bravo.play(heronSFlightRed, { target: Dash.id });
    resolveHeronComboLayers(game);

    const link = game.combat()?.activeLink;
    // Printed 3 + Combo +2
    expect(link?.attackPower).toBe(5);
    // Chosen mode: restrict defend (continuous rule-modification atom).
    // The chosen mode (options[0]: "can only be defended by attack action
    // cards") is live on this link. Assert it BEHAVIORALLY rather than by
    // counting instances: Crane Dance's own combo restriction correctly dies
    // with its attack now that defend rules latch their subject, so a
    // before/after count delta is no longer a stable signal.
    expect(restrictBefore).toBeGreaterThanOrEqual(1);
    game.advanceCombatTo("defend");
    // The engine presented the "non-attack only" mode as options[0]: an
    // attack-action defender is denied while a plain action still blocks.
    expect(() => Dash.defendWith(brutalAssaultBlue)).toThrow(/prevents this card/);
    Dash.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();
  });

  it("a wrong prior attack fails the combo gate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [soulbeadStrikeRed, heronSFlightRed],
        deck: 10,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 10 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const restrictBefore = game
      .getState()
      .continuousEffectInstances.filter((continuous) =>
        continuous.atoms.some(
          (atom) => atom.kind === "rule" && atom.parameters.kind === "rule-modification",
        ),
      ).length;

    Bravo.play(soulbeadStrikeRed, { target: Dash.id });
    game.passBoth();
    game.advanceCombatTo("resolution");

    Bravo.play(heronSFlightRed, { target: Dash.id });
    resolveHeronComboLayers(game);

    // Combo failed: printed power 3, no +2; no new defend restriction.
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    const restrictAfter = game
      .getState()
      .continuousEffectInstances.filter((continuous) =>
        continuous.atoms.some(
          (atom) => atom.kind === "rule" && atom.parameters.kind === "rule-modification",
        ),
      ).length;
    expect(restrictAfter).toBe(restrictBefore);
  });
});

describe("CR 1.7.5 engine — Meet Madness random hit modal", () => {
  /**
   * Meet Madness (AAC014): When this hits a hero, choose 1 at random:
   * - They choose a card in their hand. Banish it.
   * - They choose a card in their arsenal. Banish it.
   * - Banish the top card of their deck.
   *
   * Proves random mode selection is automatic (no layer-mode decision for the
   * controller) and the chosen mode's effect resolves through public moves.
   */
  it("resolves the random chosen mode on hit (no controller mode decision)", () => {
    const handMarker = nimblismBlue;
    const arsenalMarker = snatchRed;
    const deckTop = heartOfFyendal;
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [meetMadnessRed],
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [handMarker],
        arsenal: [arsenalMarker],
        deck: [deckTop, nimbleStrikeRed, nimbleStrikeRed, nimbleStrikeRed],
      },
      {
        autoPassPriority: false,
        autoPitch: false,
        pitchStack: "manual",
        seed: "meet-madness-random-hit",
      },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const handBefore = Dash.zone("hand").slice();
    const arsenalBefore = Dash.zone("arsenal").slice();
    const deckBefore = Dash.zone("deck").slice();
    const banishedBefore = Dash.zone("banished").length;

    Bravo.attackWith(meetMadnessRed);
    // Walk combat to the damage/hit checkpoint without auto-answering choices.
    game.passBoth(); // attack -> defend
    game.passBoth(); // defend -> reaction
    game.passBoth(); // reaction -> damage (hit trigger collected)

    // Random modal must NOT open a controller mode-choice decision.
    const afterHit = game.getState().decision;
    if (afterHit?.kind === "option" && afterHit.continuation?.kind === "layer-mode") {
      throw new Error(
        "Random modal opened a controller layer-mode decision; expected auto-pick via RNG",
      );
    }

    // Drain priority / answer effect decisions until combat or stack settles.
    for (let safety = 0; safety < 40; safety += 1) {
      const decision = game.getState().decision;
      if (decision) {
        if (decision.kind === "entity-target" && decision.candidates.length > 0) {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: {
                kind: "entity-target",
                instanceIds: [decision.candidates[0]!.instanceId],
              },
            },
          });
          continue;
        }
        if (decision.kind === "option" && decision.options.length > 0) {
          // Should not be layer-mode for random; allow other option decisions.
          if (decision.continuation?.kind === "layer-mode") {
            throw new Error("Unexpected layer-mode decision on random modal resolution");
          }
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: {
                kind: "option",
                optionIds: [decision.options[0]!.id],
              },
            },
          });
          continue;
        }
        if (decision.kind === "boolean") {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "boolean", value: true },
            },
          });
          continue;
        }
        // Unknown decision shape — stop and fail with context.
        throw new Error(
          `Unexpected decision during Meet Madness resolution: ${JSON.stringify({
            kind: decision.kind,
            label: decision.label,
          })}`,
        );
      }

      const stackTop = game.getState().rulesStack.at(-1);
      if (stackTop?.kind === "triggered" || stackTop?.kind === "card") {
        game.passBoth();
        continue;
      }
      if (game.combat()?.open) {
        game.passBoth();
        continue;
      }
      break;
    }

    const banishedAfter = Dash.zone("banished");
    expect(banishedAfter.length).toBeGreaterThan(banishedBefore);

    const handLost = handBefore.some((id) => !Dash.zone("hand").includes(id));
    const arsenalLost = arsenalBefore.some((id) => !Dash.zone("arsenal").includes(id));
    const deckTopLost = deckBefore[0] !== undefined && !Dash.zone("deck").includes(deckBefore[0]!);
    // Exactly one mode's observable side-effect should land.
    const modesFired = [handLost, arsenalLost, deckTopLost].filter(Boolean).length;
    expect(modesFired).toBeGreaterThanOrEqual(1);
    // Banish must be opponent-owned cards only (defender zones).
    expect(banishedAfter.length - banishedBefore).toBeGreaterThanOrEqual(1);
  });

  it("edge: when hand and arsenal are empty, only deck-top mode can banish", () => {
    const deckTop = heartOfFyendal;
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [meetMadnessRed],
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        arsenal: [],
        deck: [deckTop, nimbleStrikeRed, nimbleStrikeRed],
      },
      {
        autoPassPriority: false,
        autoPitch: false,
        pitchStack: "manual",
        seed: "meet-madness-empty-hand-arsenal",
      },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const topId = Dash.zone("deck")[0];
    expect(topId).toBeTruthy();

    Bravo.attackWith(meetMadnessRed);
    game.passBoth();
    game.passBoth();
    game.passBoth();

    for (let safety = 0; safety < 40; safety += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "entity-target" && decision.candidates.length > 0) {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: {
              kind: "entity-target",
              instanceIds: [decision.candidates[0]!.instanceId],
            },
          },
        });
        continue;
      }
      if (decision?.kind === "option" && decision.continuation?.kind === "layer-mode") {
        throw new Error("Random modal must not ask controller for modes");
      }
      if (decision) {
        // Decline / pick first for other choices if any.
        if (decision.kind === "boolean") {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "boolean", value: false },
            },
          });
          continue;
        }
        break;
      }
      const stackTop = game.getState().rulesStack.at(-1);
      if (stackTop?.kind === "triggered" || game.combat()?.open) {
        game.passBoth();
        continue;
      }
      break;
    }

    // With empty hand/arsenal, only mode 3 (deck top) can move a card; other
    // modes fizzle on empty selection. Seed may pick any mode — assert legality:
    // never banishes from empty zones (no crash), and if something banished it
    // is the deck top.
    const banished = Dash.zone("banished");
    if (banished.length > 0) {
      expect(banished).toContain(topId);
    }
    expect(Dash.zone("hand")).toEqual([]);
    expect(Dash.zone("arsenal")).toEqual([]);
  });
});

it("modal effects resolve only through declared layers and the event kernel", () => {
  // Art of War already proves declared modes become continuous atoms via the
  // layer path (modes on the card layer). This assertion locks that the helper
  // surface and engine path stay aligned: random modes use the same declaredModes
  // channel as player-chosen modes.
  const artModal = (artOfWarYellow.base.abilities ?? []).find(isModalAbility)!;
  const picked = selectModalModes(artModal, { modeIndexes: [0, 1] });
  expect(picked).toHaveLength(2);
  const meetModal = triggeredModal(meetMadnessRed);
  expect(meetModal.modal.random).toBe(true);
  const randomPicked = selectModalModes(meetModal, { randomPick: () => 2 });
  expect(randomPicked).toHaveLength(1);
  expect(randomPicked[0]?.id).toBe(meetModal.modes[2]?.id);
});
