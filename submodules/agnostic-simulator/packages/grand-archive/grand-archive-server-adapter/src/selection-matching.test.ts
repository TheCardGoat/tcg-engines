import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { grandArchiveCards } from "@tcg/grand-archive-cards";
import { GrandArchiveServerEngine } from "./server-engine.ts";
import { commandForGrandArchiveSubmission } from "./interaction.ts";

const context = { gameId: "ga-selection-test", sourceAuthority: "server" as const };

function structuredDecisionCard(
  id: string,
  type: GrandArchivePlayableCardType,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        ...(type === "CHAMPION" ? { lineageName: id } : {}),
        cost: { kind: type === "CHAMPION" ? "memory" : "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "WEAPON"
              ? { power: 2, durability: 3 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

describe("Grand Archive selection matching", () => {
  it("accepts reversed weapon selections when declaring an attack", () => {
    const champion = structuredDecisionCard("weapon-selection-champion", "CHAMPION");
    const weapon = structuredDecisionCard("weapon-selection-sword", "WEAPON");
    const fixture = GrandArchiveTestEngine.startFixture({
      playerOne: { id: "p1", champion, zones: { field: [weapon, weapon] } },
      playerTwo: { id: "p2", champion },
    });
    const server = new GrandArchiveServerEngine(
      fixture.program,
      new GrandArchiveMatchRuntime(fixture.program, fixture.state),
    );
    const view = server.getInteractionView("p1");
    const action = view.actions.find((entry) =>
      entry.inputs.some((input) => input.id === "weapons"),
    );
    if (!action) throw new Error("Expected an attack with weapon selection");
    const weapons = action.inputs.find((input) => input.id === "weapons");
    if (weapons?.kind !== "entity-selection") throw new Error("Expected weapon selection");
    const weaponIds = weapons.candidates.map(({ entity }) => entity.instanceId);
    expect(weaponIds).toHaveLength(2);
    const values = Object.fromEntries(
      action.inputs.map((input) => {
        if (input.kind !== "entity-selection")
          throw new Error("Expected an attack entity selection");
        return [
          input.id,
          input.id === "weapons"
            ? [...weaponIds].reverse()
            : input.candidates.slice(0, input.min).map(({ entity }) => entity.instanceId),
        ];
      }),
    );
    const submission = buildInteractionSubmission({ view, action, values });
    const result = server.submitInteraction("p1", submission, context);
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(weapons.ordered).toBe(false);
    expect(server.runtime.state.combat?.weaponIds).toEqual(weaponIds);
  });

  it.each([
    { slug: "library-witch", cost: 2, reverse: false },
    { slug: "library-witch", cost: 2, reverse: true },
    { slug: "blitz-mage", cost: 3, reverse: true },
  ])(
    "activates $slug for $cost reserve with reverse order: $reverse",
    ({ slug, cost, reverse }) => {
      const cardToPlay = grandArchiveCards.find((card) => card.slug === slug)!;
      const champion = grandArchiveCards.find((card) => card.slug === "spirit-of-fire")!;
      const filler = structuredDecisionCard("reserve-filler", "ACTION");
      const fixture = GrandArchiveTestEngine.startFixture({
        playerOne: {
          id: "p1",
          champion,
          zones: { hand: [cardToPlay, ...Array.from({ length: cost + 1 }, () => filler)] },
        },
        playerTwo: { id: "p2", champion },
      });
      const server = new GrandArchiveServerEngine(
        fixture.program,
        new GrandArchiveMatchRuntime(fixture.program, fixture.state),
      );
      const view = server.getInteractionView("p1");
      const action = view.actions.find(
        (candidate) => candidate.source?.definitionId === cardToPlay.canonicalId,
      )!;
      expect(action).toBeDefined();
      const payment = action.inputs.find((input) => input.id === "reserve-payment");
      if (payment?.kind !== "entity-selection") throw new Error("Expected reserve selection");
      expect(payment).toMatchObject({ min: cost, max: cost, ordered: false });
      const ids = payment.candidates.slice(0, cost).map(({ entity }) => {
        if (entity.kind !== "card") throw new Error("Expected a hand card");
        return entity.instanceId;
      });
      if (reverse) ids.reverse();
      for (const invalidIds of [
        [ids[0]!, ids[0]!],
        ["not-a-candidate", ...ids.slice(1)],
      ]) {
        const rejected = server.submitInteraction(
          "p1",
          buildInteractionSubmission({
            view,
            action,
            values: { "reserve-payment": invalidIds },
          }),
          context,
        );
        expect(rejected.success).toBe(false);
        expect(server.getStateID()).toBe(view.stateVersion);
        expect(server.runtime.state.zones[grandArchivePlayerId("p1")].memory).toHaveLength(0);
      }
      const result = server.submitInteraction(
        "p1",
        buildInteractionSubmission({
          view,
          action,
          values: { "reserve-payment": ids },
        }),
        context,
      );
      expect(result.success, JSON.stringify(result)).toBe(true);
      expect([...server.runtime.state.zones[grandArchivePlayerId("p1")].memory].sort()).toEqual(
        [...ids].sort(),
      );
      expect(server.runtime.state.zones[grandArchivePlayerId("p1")].hand).toHaveLength(1);
      expect(server.runtime.state.zones[grandArchivePlayerId("p1")]["effects-stack"]).toHaveLength(
        1,
      );
    },
  );

  it.each(["targets", "modes", "both", "resolution"])(
    "matches reversed %s when activating a modal card",
    (reverse) => {
      const choiceCard = structuredDecisionCard("selection-action", "ACTION", [
        {
          id: "selectionCard-a1",
          kind: "card-resolution",
          text: "Choose two modes and two champions.",
          effect: { kind: "no-op" },
          targets: [
            {
              id: "champions",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: { kind: "exactly", amount: 2 },
              candidates: {
                kind: "object",
                zones: ["field"],
                player: "each-player",
                filter: { kind: "type", oneOf: ["CHAMPION"] },
              },
            },
          ],
          modes: {
            choose: { kind: "exactly", amount: 2 },
            declared: "announcement",
            modes: [
              {
                id: "mode-1",
                text: "Draw one.",
                effect: { kind: "draw", player: "controller", amount: 1 },
              },
              {
                id: "mode-2",
                text: "Draw two.",
                effect: { kind: "draw", player: "controller", amount: 2 },
              },
              {
                id: "mode-3",
                text: "Draw three.",
                effect: { kind: "draw", player: "controller", amount: 3 },
              },
            ],
          },
        },
      ]);
      const champion = structuredDecisionCard(
        "selection-champion",
        "CHAMPION",
        reverse === "resolution"
          ? [
              {
                id: "selection-champion-a1",
                kind: "triggered",
                text: "Copy the opponent's activation and choose new modes.",
                trigger: { kind: "event", event: { name: "card-activated", actor: "opponent" } },
                effect: {
                  kind: "copy",
                  subject: { kind: "event-subject" },
                  copy: "card-activation",
                  mayChooseNewModes: true,
                },
              },
            ]
          : [],
      );
      const filler = structuredDecisionCard("selection-filler", "ACTION");
      const fixture = GrandArchiveTestEngine.startFixture({
        playerOne: {
          id: "p1",
          champion,
          zones: {
            hand: [choiceCard],
            "main-deck": [filler, filler, filler, filler, filler, filler],
          },
        },
        playerTwo: { id: "p2", champion, zones: { "main-deck": [filler] } },
      });
      const server = new GrandArchiveServerEngine(
        fixture.program,
        new GrandArchiveMatchRuntime(fixture.program, fixture.state),
      );
      const view = server.getInteractionView("p1");
      const action = view.actions.find((candidate) => candidate.intent === "play-card")!;
      expect(action, JSON.stringify(view)).toBeDefined();
      const targetInput = action.inputs.find((input) => input.id === "target:champions");
      if (targetInput?.kind !== "entity-selection") throw new Error("Expected target selection");
      expect(targetInput.ordered).toBe(false);
      const targets = targetInput.candidates.map(({ entity }) => entity.instanceId);
      const modes = ["mode-1", "mode-2"];
      if (reverse !== "modes") targets.reverse();
      if (reverse !== "targets") modes.reverse();
      const result = server.submitInteraction(
        "p1",
        buildInteractionSubmission({
          view,
          action,
          values: { "target:champions": targets, modes },
        }),
        context,
      );
      expect(result.success, JSON.stringify(result)).toBe(true);
      expect(server.runtime.state.stack[0]?.selectedModeIds).toEqual(["mode-1", "mode-2"]);
      expect(server.runtime.state.stack[0]?.targets[0]?.targetIds).toEqual(
        expect.arrayContaining(targets),
      );
      if (reverse === "resolution") {
        for (let step = 0; step < 8 && !server.runtime.state.decision; step += 1) {
          const actorId = server.getActivePlayerId()!;
          const passView = server.getInteractionView(actorId);
          const pass = passView.actions.find((candidate) => candidate.intent === "pass")!;
          expect(
            server.submitInteraction(
              actorId,
              buildInteractionSubmission({ view: passView, action: pass }),
              context,
            ).success,
          ).toBe(true);
        }
        const decision = server.runtime.state.decision;
        expect(decision?.kind).toBe("remode-stack-item");
        if (decision?.kind !== "remode-stack-item") throw new Error("Expected copied modes choice");
        const decisionView = server.getInteractionView(decision.playerId);
        const choice = decisionView.actions.find((candidate) =>
          candidate.inputs.some((input) => input.id === "modeIds"),
        )!;
        const chosen = server.submitInteraction(
          decision.playerId,
          buildInteractionSubmission({
            view: decisionView,
            action: choice,
            values: { modeIds: ["mode-3", "mode-1"] },
          }),
          context,
        );
        expect(chosen.success, JSON.stringify(chosen)).toBe(true);
        expect(
          server.runtime.state.stack.find((item) => item.id === decision.targetStackItemId)
            ?.selectedModeIds,
        ).toEqual(["mode-1", "mode-3"]);
      }
    },
  );

  it("accepts reversed additional-cost cards without reordering cost components", () => {
    const champion = structuredDecisionCard("additional-cost-champion", "CHAMPION");
    const filler = structuredDecisionCard("additional-cost-filler", "ACTION");
    const source = structuredDecisionCard("additional-cost-action", "ACTION", [
      {
        id: "extraCost-a1",
        kind: "card-resolution",
        text: "Banish two cards as an additional cost.",
        additionalCost: {
          kind: "select-and-move",
          player: "controller",
          from: "hand",
          to: "banishment",
          count: { kind: "exactly", amount: 2 },
          filter: { kind: "name", value: filler.canonicalId, match: "exact" },
        },
        effect: { kind: "draw", player: "controller", amount: 1 },
      },
    ]);
    const fixture = GrandArchiveTestEngine.startFixture({
      playerOne: {
        id: "p1",
        champion,
        zones: { hand: [source, filler, filler, filler], "main-deck": [filler] },
      },
      playerTwo: { id: "p2", champion },
    });
    const server = new GrandArchiveServerEngine(
      fixture.program,
      new GrandArchiveMatchRuntime(fixture.program, fixture.state),
    );
    const view = server.getInteractionView("p1");
    const action = view.actions.find(
      (candidate) => candidate.source?.definitionId === source.canonicalId,
    )!;
    const input = action.inputs.find((candidate) => candidate.id === "additional-cost:0");
    if (input?.kind !== "entity-selection") throw new Error("Expected additional-cost cards");
    expect(input.ordered).toBe(false);
    const ids = input.candidates
      .slice(0, 2)
      .map(({ entity }) => entity.instanceId)
      .reverse();
    const order = action.inputs.find((candidate) => candidate.id === "cost-order");
    if (order?.kind !== "option-selection") throw new Error("Expected explicit cost ordering");
    const submission = buildInteractionSubmission({
      view,
      action,
      values: {
        [input.id]: ids,
        [order.id]: [order.options.at(-1)!.id],
      },
    });
    expect(
      commandForGrandArchiveSubmission(server.runtime, "p1", submission)?.command,
    ).toMatchObject({
      costPaymentOrders: [{ path: [], order: [1, 0] }],
    });
    const result = server.submitInteraction("p1", submission, context);
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect([...server.runtime.state.zones[grandArchivePlayerId("p1")].banishment].sort()).toEqual(
      [...ids].sort(),
    );
    expect(server.runtime.state.zones[grandArchivePlayerId("p1")].hand).toHaveLength(1);
  });
});
