import { describe, expect, it } from "vitest";
import { potionOfSeeingBlue } from "../../../cards/src/cards/actions/potion-of-seeing.ts";
import { lostInThoughtRed } from "../../../cards/src/cards/actions/lost-in-thought.ts";
import { seduceSecretsYellow } from "../../../cards/src/cards/instants/seduce-secrets.ts";
import { righteousCleansingYellow } from "../../../cards/src/cards/actions/righteous-cleansing.ts";
import { bravo, dash, nimblismBlue, pummelRed, sigilOfSolaceRed, snatchRed } from "./fixtures.ts";
import {
  createFabMatchContext,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../snapshot/match-context.ts";
import { FabTestEngine } from "../testing/test-engine.ts";

describe("catalog target declaration debt", () => {
  it("public Potion activation declares a hero, not every card in that hero's hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [potionOfSeeingBlue], hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [snatchRed, snatchRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    game.exec({
      move: "activate",
      actorId: Bravo.id,
      payload: { instanceId: Bravo.cardIn("arena", potionOfSeeingBlue).instanceId },
    });
    const target = Bravo.expectDecision("entity-target");
    expect(target.candidates.map((candidate) => candidate.instanceId).sort()).toEqual(
      [Bravo.id, game.as(dash).id].sort(),
    );
    game.answerDecision(Bravo.id, {
      kind: "entity-target",
      instanceIds: [game.as(dash).id],
    });
    game.passBoth();
    expect(Bravo.zone("graveyard")).toContain(potionOfSeeingBlue.canonicalId);
    expect(game.getState().decision).toBeNull();
  });

  it("reuses Lost in Thought's exact declared hero for its filtered hand choice", () => {
    let game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [lostInThoughtRed, snatchRed, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    let Bravo = game.as(bravo);
    let Dash = game.as(dash);
    Bravo.exec({
      move: "begin-play",
      payload: {
        instanceId: Bravo.cardIn("hand", lostInThoughtRed).instanceId,
      },
    });

    const heroTarget = Bravo.expectDecision("entity-target");
    expect(heroTarget.candidates.map((candidate) => candidate.instanceId).sort()).toEqual(
      [Bravo.id, Dash.id].sort(),
    );
    expect(
      Dash.expectFailure({
        move: "answer-decision",
        payload: {
          decisionId: heroTarget.decisionId,
          stateVersion: heroTarget.stateVersion,
          answer: { kind: "entity-target", instanceIds: [Dash.id] },
        },
      }).accepted,
    ).toBe(false);

    const beforeRestore = game.getState();
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(beforeRestore),
        createFabMatchContext(beforeRestore.cardDefinitions, beforeRestore.publicCardIdentities),
      ),
    ).configure({ autoPassPriority: false });
    Bravo = game.as(bravo);
    Dash = game.as(dash);
    game.answerDecision(Bravo.id, {
      kind: "entity-target",
      instanceIds: [Dash.id],
    });
    game.passBoth();
    game.helpers.resolveUntilIdle();
    // Dash's only attack action is determined (CR 1.8.6c). The look reused the
    // declared hero: Bravo's hand/arsenal cards are not legal parameters.
    expect(Dash.zone("hand")).not.toContain(snatchRed.canonicalId);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("hand").filter((id) => id === nimblismBlue.canonicalId)).toHaveLength(3);
    expect(Bravo.zone("arena")).toContain("token:ponder");
    expect(Bravo.zone("hand")).toContain(snatchRed.canonicalId);
    game.assertCardHiddenFrom(Bravo, Dash.cardIn("arsenal", snatchRed), Dash);
  });

  it.each([
    ["controller", bravo],
    ["opponent", dash],
  ] as const)(
    "reuses Seduce Secrets' exact %s hero across hand and deck looks",
    (_label, selectedHero) => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          hand: [snatchRed, nimblismBlue, nimblismBlue, nimblismBlue],
          arsenal: [seduceSecretsYellow],
          deck: [snatchRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        {
          hero: dash,
          hand: [snatchRed, nimblismBlue, nimblismBlue, nimblismBlue],
          arsenal: [snatchRed],
          deck: [snatchRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        { autoPassPriority: false },
      );
      const Bravo = game.as(bravo);
      const Dash = game.as(dash);
      const selected = selectedHero === bravo ? Bravo : Dash;
      Bravo.playFromArsenal(seduceSecretsYellow, { target: selected.id });
      game.passBoth();

      expect(game.getState().decision).toBeNull();
      expect(Bravo.zone("arsenal")).toEqual([]);
      expect(Bravo.zone("hand")).toHaveLength(5);
      expect(Bravo.zone("graveyard")).toContain(seduceSecretsYellow.canonicalId);
      game.assertCardHiddenFrom(Bravo, Dash.cardIn("arsenal", snatchRed), Dash);
    },
  );

  it("resolves Righteous Cleansing through one private same-name group and remainder order", () => {
    let game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [righteousCleansingYellow, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [pummelRed],
        resourcePoints: 7,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: [pummelRed, sigilOfSolaceRed, snatchRed, nimblismBlue, snatchRed],
      },
      { autoPassPriority: false },
    );
    let Bravo = game.as(bravo);
    let Dash = game.as(dash);
    Bravo.attackWith(righteousCleansingYellow, { target: Dash.id });
    const choice = game.advanceToDecision(Bravo, "group-choice");
    expect(choice.entries).toHaveLength(5);
    const snatches = Dash.cardsIn("deck", snatchRed).map((card) => card.instanceId);
    const nimblism = Dash.cardIn("deck", nimblismBlue).instanceId;
    const sigil = Dash.cardIn("deck", sigilOfSolaceRed).instanceId;
    const pummel = Dash.cardIn("deck", pummelRed).instanceId;
    expect(choice.cohorts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Snatch", entryIds: expect.arrayContaining(snatches) }),
      ]),
    );
    expect(
      Dash.expectFailure({
        move: "answer-decision",
        payload: {
          decisionId: choice.decisionId,
          stateVersion: choice.stateVersion,
          answer: {
            kind: "group-choice",
            selectedIds: snatches,
            orderedRemainderIds: [nimblism, sigil, pummel],
          },
        },
      }).accepted,
    ).toBe(false);
    expect(
      Bravo.expectFailure({
        move: "answer-decision",
        payload: {
          decisionId: choice.decisionId,
          stateVersion: choice.stateVersion,
          answer: {
            kind: "group-choice",
            selectedIds: [snatches[0]!, nimblism],
            orderedRemainderIds: [snatches[1]!, sigil, pummel],
          },
        },
      }).accepted,
    ).toBe(false);

    const beforeRestore = game.getState();
    const snapshot = serializeFabMatchSnapshot(beforeRestore);
    expect(isFabMatchSnapshotV21(snapshot)).toBe(true);
    expect(
      isFabMatchSnapshotV21({
        ...snapshot,
        decision: {
          ...snapshot.decision!,
          entries: [
            ...(snapshot.decision?.kind === "group-choice" ? snapshot.decision.entries : []),
            { id: "foreign-private-card", label: "hidden" },
          ],
        },
      }),
    ).toBe(false);
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        snapshot,
        createFabMatchContext(beforeRestore.cardDefinitions, beforeRestore.publicCardIdentities),
      ),
    ).configure({ autoPassPriority: false });
    Bravo = game.as(bravo);
    Dash = game.as(dash);
    game.answerDecision(Bravo.id, {
      kind: "group-choice",
      selectedIds: snatches,
      orderedRemainderIds: [nimblism, sigil, pummel],
    });
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("banished").filter((id) => id === snatchRed.canonicalId)).toHaveLength(2);
    expect(Dash.zone("deck").slice(-3)).toEqual([
      pummelRed.canonicalId,
      sigilOfSolaceRed.canonicalId,
      nimblismBlue.canonicalId,
    ]);
    expect(
      Bravo.expectFailure({
        move: "answer-decision",
        payload: {
          decisionId: choice.decisionId,
          stateVersion: choice.stateVersion,
          answer: {
            kind: "group-choice",
            selectedIds: snatches,
            orderedRemainderIds: [nimblism, sigil, pummel],
          },
        },
      }).accepted,
    ).toBe(false);
    game.assertCardHiddenFrom(Bravo, Dash.cardIn("arsenal", sigilOfSolaceRed), Dash);
  });
});
