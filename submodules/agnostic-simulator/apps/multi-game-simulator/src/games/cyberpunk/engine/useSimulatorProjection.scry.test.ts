import { describe, expect, it } from "vitest";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import { theHeistRetailStarterDeckViktorVektorSitDownAndRelax } from "@tcg/cyberpunk-cards";
import { buildInteractionSubmissionForActionId, type InteractionInput } from "@tcg/protocol";
import { defOf } from "@tcg/cyberpunk-engine";

import { interactionSubmissionToEngineAction } from "./interactionDispatch.js";
import { getScenario, P1, P2, type Scenario } from "./fixtures/scenarios.js";
import { selectionToValues } from "./useSimulatorProjection.js";

type CyberpunkTestEngineLike = ReturnType<Scenario["build"]>;

/** Panel-shaped selection the shared InteractionPanel submits. */
interface PanelSelection {
  entityIds: string[];
  optionIds: string[];
  paymentIds: string[];
  orderedIds: string[];
}

const EMPTY_PANEL_SELECTION: PanelSelection = {
  entityIds: [],
  optionIds: [],
  paymentIds: [],
  orderedIds: [],
};

const VIKTOR_SCENARIO = "legendViktorVektorSitDownAndRelaxRetail";

interface ViktorScryContext {
  engine: CyberpunkTestEngineLike;
  view: ReturnType<typeof buildCyberpunkInteractionView>;
  action: ReturnType<typeof buildCyberpunkInteractionView>["actions"][number];
  destinationZoneId: string;
}

/**
 * Drives the real engine into Viktor Vektor's may-skip scry prompt (call
 * legend → look at the revealed cards, put any into hand or back) and builds
 * the interaction view exactly the way production does.
 */
function buildViktorScryContext(): ViktorScryContext {
  const engine = getScenario(VIKTOR_SCENARIO).build();
  const viktor = engine
    .getCardsInZone("legendArea", P1)
    .find((card) => defOf(card).id === theHeistRetailStarterDeckViktorVektorSitDownAndRelax.id);
  if (!viktor) {
    throw new Error("Expected Viktor Vektor (Retail) in the P1 legend area");
  }

  engine.callLegend(viktor, { as: P1 });

  const prompt = engine.getPrompt(P1);
  if (prompt.choice?.type !== "scry") {
    throw new Error(`Expected a scry pending choice, got ${prompt.choice?.type ?? "none"}`);
  }

  const view = buildCyberpunkInteractionView({
    actorId: P1,
    stateVersion: engine.getState().ctx.stateID,
    prompt,
  });
  const action = view.actions.find((candidate) => candidate.id === "resolveScry");
  if (!action) {
    throw new Error("The scry choice did not project a resolveScry action");
  }

  const destinationInput = action.inputs.find((input) => input.id === "destinationZone");
  if (!destinationInput || destinationInput.kind !== "option-selection") {
    throw new Error("Expected an option-selection destinationZone input");
  }
  const selectedCardIdsInput = action.inputs.find((input) => input.id === "selectedCardIds");
  if (!selectedCardIdsInput || selectedCardIdsInput.kind !== "entity-selection") {
    throw new Error("Expected an entity-selection selectedCardIds input");
  }

  return {
    engine,
    view,
    action,
    destinationZoneId: destinationInput.options[0]!.id,
  };
}

function requireSelectedCardIdsInput(
  context: ViktorScryContext,
): Extract<InteractionInput, { kind: "entity-selection" }> {
  const input = context.action.inputs.find((candidate) => candidate.id === "selectedCardIds");
  if (!input || input.kind !== "entity-selection") {
    throw new Error("Expected an entity-selection selectedCardIds input");
  }
  return input;
}

describe("useSimulatorProjection scry submissions", () => {
  it("encodes an empty optional scalar card choice as an explicit pass", () => {
    const inputs: InteractionInput[] = [
      {
        kind: "entity-selection",
        id: "cardId",
        role: "source",
        entityKinds: ["card"],
        min: 0,
        max: 1,
        ordered: false,
        candidates: [],
        text: { key: "test.card" },
      },
      {
        kind: "boolean",
        id: "pass",
        required: false,
        text: { key: "test.pass" },
      },
    ];

    expect(selectionToValues(inputs, EMPTY_PANEL_SELECTION)).toEqual({ pass: true });
  });

  it("omits an empty optional scalar when it is not a decline action", () => {
    const inputs: InteractionInput[] = [
      {
        kind: "entity-selection",
        id: "attachToId",
        role: "target",
        entityKinds: ["card"],
        min: 0,
        max: 1,
        ordered: false,
        candidates: [],
        text: { key: "test.attach" },
      },
    ];

    expect(selectionToValues(inputs, EMPTY_PANEL_SELECTION)).toEqual({});
  });

  it("submits an explicit empty card selection for a may-skip scry prompt", () => {
    const context = buildViktorScryContext();
    const { engine, view, action, destinationZoneId } = context;

    // Both scry inputs are omission-allowed (min 0), so the shared panel
    // projects only the destination option — the player can confirm with no
    // cards picked.
    expect(requireSelectedCardIdsInput(context).min).toBe(0);

    const values = selectionToValues(action.inputs, {
      ...EMPTY_PANEL_SELECTION,
      optionIds: [destinationZoneId],
    });

    // Regression: selectedCardIds must survive as an explicit empty array —
    // omitting the key made the engine-action converter throw, silently
    // dropping the submission and deadlocking the match on the prompt.
    expect(values).toEqual({
      destinationZone: destinationZoneId,
      selectedCardIds: [],
    });

    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: action.id,
      values,
    });
    expect(submission).not.toBeNull();

    const engineAction = interactionSubmissionToEngineAction(submission!, P1);
    expect(engineAction).toEqual({
      type: "resolveScry",
      destinations: [{ zone: destinationZoneId, cardIds: [] }],
      as: P1,
    });

    // Driving the converted action through the real engine command surface
    // proves the prompt resolves instead of deadlocking.
    const result = engine.getLocalEngine().processCommand(
      {
        commandID: "test-resolve-scry-empty-panel-selection",
        move: "resolveScry",
        input: { args: { destinations: [{ zone: destinationZoneId, cardIds: [] }] } },
      },
      P1,
    );
    expect(result.success).toBe(true);
    expect(engine.getPrompt(P1).choice).toBeNull();
  });

  it("still submits a picked scry card and the engine resolves it into hand", () => {
    const context = buildViktorScryContext();
    const { engine, view, action, destinationZoneId } = context;

    const selectedCardIdsInput = requireSelectedCardIdsInput(context);
    const enabledCandidate = selectedCardIdsInput.candidates.find(
      (candidate) => candidate.enabled !== false,
    );
    if (!enabledCandidate) {
      throw new Error("Expected at least one enabled scry candidate");
    }

    const values = selectionToValues(action.inputs, {
      ...EMPTY_PANEL_SELECTION,
      optionIds: [destinationZoneId],
      entityIds: [enabledCandidate.entity.instanceId],
    });

    // A multi-pick destination (max > 1) keeps the array form.
    expect(values).toEqual({
      destinationZone: destinationZoneId,
      selectedCardIds: [enabledCandidate.entity.instanceId],
    });

    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: action.id,
      values,
    });
    expect(submission).not.toBeNull();

    const engineAction = interactionSubmissionToEngineAction(submission!, P1);
    expect(engineAction).toEqual({
      type: "resolveScry",
      destinations: [{ zone: destinationZoneId, cardIds: [enabledCandidate.entity.instanceId] }],
      as: P1,
    });

    const result = engine.getLocalEngine().processCommand(
      {
        commandID: "test-resolve-scry-single-pick",
        move: "resolveScry",
        input: {
          args: {
            destinations: [
              { zone: destinationZoneId, cardIds: [enabledCandidate.entity.instanceId] },
            ],
          },
        },
      },
      P1,
    );
    expect(result.success).toBe(true);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.instanceId)).toContain(
      enabledCandidate.entity.instanceId,
    );
  });

  it("defaults an absent selectedCardIds key to an empty pick instead of throwing", () => {
    const context = buildViktorScryContext();
    const { view, action, destinationZoneId } = context;

    // Defense in depth for the panel fix: a submission that carries only the
    // destination must convert to a no-op scry rather than throw.
    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: action.id,
      values: { destinationZone: destinationZoneId },
    });
    expect(submission).not.toBeNull();

    expect(interactionSubmissionToEngineAction(submission!, P1)).toEqual({
      type: "resolveScry",
      destinations: [{ zone: destinationZoneId, cardIds: [] }],
      as: P1,
    });
  });

  it("keeps omitting required (min > 0) entity selections left empty", () => {
    const inputs: InteractionInput[] = [
      {
        id: "requiredTarget",
        kind: "entity-selection",
        entityKinds: ["card"],
        role: "target",
        text: { key: "Required target" },
        min: 1,
        max: 1,
        ordered: false,
        candidates: [
          { entity: { kind: "card", instanceId: "target-1", ownerId: P2 }, enabled: true },
        ],
      },
    ];

    // Documented behavior: required inputs with nothing selected are omitted
    // so the protocol validator reports the missing value instead of the
    // engine receiving an illegal empty selection.
    expect(selectionToValues(inputs, EMPTY_PANEL_SELECTION)).toEqual({});
  });
});
