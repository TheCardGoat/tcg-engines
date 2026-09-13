/**
 * KAT003 Mask of Many Faces — Ninja Head d1 Blade Break.
 *
 * Printed:
 *   Instant - {r}, destroy Mask of Many Faces: Name a card. The next attack
 *   action card you play this turn gains that name.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Instant 1{r}+destroy-self names a card (name-card binds named-card).
 * 2. grant-property name value "chosen" must resolve that binding — not leave
 *    the literal "chosen" on the next AAC (structural continuous fix).
 * 3. Next AAC played this turn gets the named identity on evaluation.
 * 4. 0 RP illegal; second AAC is not renamed (next only).
 * 5. Blade Break is separate defend path; Instant destroys without defending.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { maskOfManyFaces } from "../../../../../../cards/src/cards/equipment/mask-of-many-faces.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const LIFE = 20;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  options: { namedCard?: string } = {},
): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
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
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision?.kind === "effect-resolution" && options.namedCard) {
      const option = decision.options.find(
        (candidate) => candidate.id === options.namedCard || candidate.label === options.namedCard,
      );
      if (!option) throw new Error(`Named-card option ${options.namedCard} is not public.`);
      game.answerDecision(decision.actorId, {
        kind: "effect-resolution",
        optionId: option.id,
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function evaluatedNames(
  game: ReturnType<typeof FabTestEngine.start>,
  instanceId: string,
): readonly string[] {
  const record = game.getState().objects[instanceId];
  if (!record) return [];
  const view = buildFabRulesView(game.getState());
  return view.object({ instanceId, incarnation: record.incarnation })?.current.names ?? [];
}

describe("mask-of-many-faces (KAT003)", () => {
  it("core mechanic: Instant {r}+destroy → name card → next AAC gains that name", () => {
    // The name is chosen from the match's public identity catalog. Seat
    // Nimblism so the test catalog contains it, then answer through the public
    // decision before playing Snatch as the next AAC.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: LIFE,
        head: [maskOfManyFaces],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    const expectedName =
      game.getState().cardDefinitions[nimblismBlue.canonicalId]?.base.names[0] ??
      nimblismBlue.canonicalId;

    Bravo.activate(maskOfManyFaces);
    drain(game, { namedCard: expectedName });

    expect(game.renderedPlayerNarrative(Bravo.id)).toContain(`You named ${expectedName}.`);
    expect(
      game
        .moveLogs()
        .flatMap((log) => log.public)
        .some((message) => message.key === "flesh-and-blood.name-card"),
    ).toBe(true);

    expect(Bravo.zone("graveyard")).toContain(maskOfManyFaces.canonicalId);
    expect(Bravo.zone("head")).not.toContain(maskOfManyFaces.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);

    // Play next AAC — it keeps its printed name and gains the chosen identity.
    // Read the name while combat is open (before drain closes the chain).
    Bravo.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    const atkId = game.combat()?.activeLink?.activeAttack.sourceObjectId;
    expect(atkId).toBeTruthy();
    const names = evaluatedNames(game, atkId!);
    expect(names).toContain("Snatch");
    expect(names).not.toContain("chosen");
    expect(names.map((name) => name.toLowerCase())).toContain(String(expectedName).toLowerCase());
  });

  it("boundaries: 0 RP illegal; model Instant mixed cost + name-then-grant", () => {
    const poor = FabTestEngine.start(
      {
        hero: bravo,
        head: [maskOfManyFaces],
        resourcePoints: 0,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => poor.as(bravo).activate(maskOfManyFaces)).toThrow();

    const a1 = maskOfManyFaces.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "asset", type: "resources", amount: 1 },
        { class: "effect", type: "destroy-self" },
      ],
    });
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        { type: "name-card" },
        {
          type: "grant-property",
          property: { kind: "name", value: "chosen" },
          duration: "this-turn",
          appliesTo: { next: { typeBox: { types: ["Action"], subtypes: ["Attack"] } } },
        },
      ],
    });
    expect(maskOfManyFaces.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(maskOfManyFaces.base.numeric.defense).toBe(1);
  });
});
