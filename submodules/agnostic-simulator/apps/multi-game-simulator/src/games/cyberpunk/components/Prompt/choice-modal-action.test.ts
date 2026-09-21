import { describe, expect, it } from "vite-plus/test";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import type { ChoicePrompt, MatchState, PlayerPrompt } from "@tcg/cyberpunk-engine";
import {
  choiceActionHasRenderableDrawerContent,
  choiceModalActionFromInteractionView,
  getTargetPromptPresentation,
} from "./choiceModalAction";
import { optionInput } from "./interactionInputs";

// The chooseEffect interaction action (modal mode selection, e.g. a Legend
// CALL "Choose one effect") carries its option input as "optionId". The modal
// picker must surface it so the choice modal renders the mode buttons.

const chooseEffectPrompt: PlayerPrompt = {
  status: "choice",
  availableMoves: [],
  choice: {
    type: "chooseEffect",
    chooserId: "p1",
    payload: {
      options: [
        { id: "buff", label: "Give a friendly Unit +2 power this turn", effects: [] },
        { id: "draw", label: "Draw 1", effects: [] },
      ],
    },
  } satisfies Extract<ChoicePrompt, { type: "chooseEffect" }>,
};

function viewActions(prompt: PlayerPrompt) {
  return buildCyberpunkInteractionView({
    actorId: "p1",
    stateVersion: 1,
    prompt,
  }).actions;
}

describe("choice modal action picker — resolveChooseEffect", () => {
  it("picks the resolveChooseEffect action and presents it as a drawer", () => {
    const actions = viewActions(chooseEffectPrompt);
    const action = actions.find((candidate) => candidate.id === "resolveChooseEffect");
    expect(action).toBeTruthy();
    expect(optionInput(action!, "optionId")?.options.map((option) => option.id)).toEqual([
      "buff",
      "draw",
    ]);

    const picked = choiceModalActionFromInteractionView(actions, {} as MatchState);
    expect(picked?.id).toBe("resolveChooseEffect");

    const presentation = getTargetPromptPresentation({
      actions,
      matchState: {} as MatchState,
      choice: chooseEffectPrompt.choice,
    });
    expect(presentation.presentation).toBe("drawer");
    expect(presentation.action?.id).toBe("resolveChooseEffect");
  });

  it("treats the action as renderable drawer content", () => {
    const actions = viewActions(chooseEffectPrompt);
    const action = actions.find((candidate) => candidate.id === "resolveChooseEffect");
    expect(choiceActionHasRenderableDrawerContent(action!)).toBe(true);
  });

  it("ignores a resolveChooseEffect action without its option input", () => {
    const picked = choiceModalActionFromInteractionView(
      [
        {
          protocolVersion: 1,
          gameSlug: "cyberpunk",
          actorId: "p1",
          stateVersion: 1,
          status: "choice",
          id: "resolveChooseEffect",
          intent: "choose-option",
          inputs: [],
        },
      ],
      {} as MatchState,
    );
    expect(picked).toBeNull();
  });
});

describe("choice modal action picker — resolvePreventGigSteal", () => {
  const preventPrompt: PlayerPrompt = {
    status: "choice",
    availableMoves: [],
    choice: {
      type: "preventGigSteal",
      chooserId: "p1",
      payload: {
        attackerId: "attacker",
        rivalId: "p1",
        stealEntries: [{ dieId: "gd_1", value: 2 }],
        handEntries: [{ cardId: "ci_1", cost: 2 }],
      },
    } satisfies Extract<ChoicePrompt, { type: "preventGigSteal" }>,
  };

  it("picks the resolvePreventGigSteal action and presents it as a drawer", () => {
    const actions = viewActions(preventPrompt);
    const action = actions.find((candidate) => candidate.id === "resolvePreventGigSteal");
    expect(action).toBeTruthy();

    const picked = choiceModalActionFromInteractionView(actions, {} as MatchState);
    expect(picked?.id).toBe("resolvePreventGigSteal");

    const presentation = getTargetPromptPresentation({
      actions,
      matchState: {} as MatchState,
      choice: preventPrompt.choice,
    });
    expect(presentation.presentation).toBe("drawer");
    expect(presentation.action?.id).toBe("resolvePreventGigSteal");
  });

  it("treats the action as renderable drawer content", () => {
    const actions = viewActions(preventPrompt);
    const action = actions.find((candidate) => candidate.id === "resolvePreventGigSteal");
    expect(choiceActionHasRenderableDrawerContent(action!)).toBe(true);
  });
});

describe("choice modal action picker — atomic Gig adjustment", () => {
  const adjustGigPrompt: PlayerPrompt = {
    status: "choice",
    availableMoves: [],
    choice: {
      type: "chooseTarget",
      chooserId: "p1",
      effectId: "zetatech-faceplate-trigger",
      payload: {
        type: "effectTarget",
        targetKind: "gig",
        min: 0,
        max: 1,
        eligibleIds: ["friendly-d6", "rival-d8"],
        selectedBindingId: "gig",
        adjustGig: {
          maxAmount: 1,
          direction: "either",
          chooseUpTo: true,
          effectIndex: 0,
        },
      },
    } satisfies Extract<ChoicePrompt, { type: "chooseTarget" }>,
  };
  const matchState = {
    G: {
      players: {
        p1: { gigArea: ["friendly-d6"] },
        p2: { gigArea: ["rival-d8"] },
      },
    },
  } as MatchState;

  it("keeps public Gig candidates on the board instead of auto-opening the drawer", () => {
    const actions = viewActions(adjustGigPrompt);
    const action = actions.find((candidate) => candidate.id === "resolveAdjustGig");
    expect(action).toBeTruthy();

    expect(choiceModalActionFromInteractionView(actions, matchState)).toBeNull();
    expect(
      choiceModalActionFromInteractionView(actions, matchState, {
        includeSpatialTargets: true,
      })?.id,
    ).toBe("resolveAdjustGig");

    const presentation = getTargetPromptPresentation({
      actions,
      matchState,
      choice: adjustGigPrompt.choice,
    });
    expect(presentation.presentation).toBe("spatial");
    expect(presentation.action?.id).toBe("resolveAdjustGig");
  });
});
