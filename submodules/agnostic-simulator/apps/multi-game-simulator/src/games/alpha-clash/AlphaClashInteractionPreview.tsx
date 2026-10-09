import { Button, Container, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useMemo, useState } from "react";
import { createInitialState, projectState, type ProjectedState } from "@tcg/alpha-clash-engine";
import {
  buildAlphaClashInteractionView,
  alphaClashSubmissionToPayload,
} from "@tcg/alpha-clash-server-adapter";
import { validateInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { InteractionWorkspace } from "@tcg/simulator-ui";
import {
  AlphaClashInteractionPanel,
  labelAlphaClashInteractions,
} from "./components/AlphaClashInteractions";

type Choice = ProjectedState["pendingChoices"][number];
/** Native typed choices injected into a viewer-safe state, then mapped by the real adapter. */
export function buildAlphaClashChoicePreview(kind: string) {
  const state = createInitialState({
    id: "interaction-preview",
    seed: 1,
    validateDeck: false,
    players: {
      "player-one": { name: "You", deck: { contenderId: "acx-contender-titan", deckIds: [] } },
      "player-two": {
        name: "Opponent",
        deck: { contenderId: "acx-contender-warden", deckIds: [] },
      },
    },
  });
  const projected = projectState(state, "player-one");
  const candidates = projected.cards
    .filter((card) => card.zone === "contender")
    .map((card) => card.instanceId);
  const base = {
    id: `preview-${kind}`,
    playerId: "player-one" as const,
    sourceId: candidates[0] ?? "preview-source",
  };
  const choices: Record<string, Choice> = {
    option: {
      ...base,
      kind: "option",
      prompt: "Use this optional effect?",
      options: [
        { id: "yes", label: "Use effect" },
        { id: "no", label: "Decline effect" },
      ],
      effects: [],
    },
    modal: {
      ...base,
      kind: "modal",
      prompt: "Choose one effect",
      options: [
        { id: "draw", label: "Draw a card", effects: [] },
        { id: "recover", label: "Recover health", effects: [] },
      ],
    },
    target: { ...base, kind: "target", prompt: "Choose a Contender", candidates, effects: [] },
    // Native effect data uses `then` as an array, not a Promise callback.
    // oxlint-disable-next-line unicorn/no-thenable
    count: { ...base, kind: "count", prompt: "Declare how many cards to use", max: 5, then: [] },
    division: {
      ...base,
      kind: "division",
      prompt: "Assign damage to the selected Contenders",
      candidates,
      total: 3,
      maxTargets: 2,
    },
  };
  const choice = choices[kind];
  if (!choice) return undefined;
  const view = buildAlphaClashInteractionView({
    actorId: "preview-player",
    seat: "player-one",
    stateVersion: 1,
    playerView: { ...projected, phase: { name: "primary" }, pendingChoices: [choice] },
  });
  return labelAlphaClashInteractions(view, (id) => {
    const card = projected.cards.find((entry) => entry.instanceId === id);
    return card?.name
      ? `${card.controller === "player-one" ? "You" : "Opponent"} · ${card.name}`
      : "Hidden card";
  });
}

export function AlphaClashInteractionPreview({ scenario }: { scenario: string }) {
  const view = useMemo(() => buildAlphaClashChoicePreview(scenario), [scenario]);
  const [reset, setReset] = useState(0);
  const [result, setResult] = useState<string>();
  if (!view) return <Text>Unknown choice preview.</Text>;
  const submit = (submission: InteractionSubmission) => {
    const validation = validateInteractionSubmission(view, submission);
    setResult(
      validation.ok
        ? JSON.stringify(alphaClashSubmissionToPayload(submission), null, 2)
        : "Answer rejected.",
    );
    return validation.ok;
  };
  return (
    <div style={{ minHeight: "100vh", background: "#0a111d", color: "#e7edf6" }}>
      <Container size="sm" py="xl">
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={2}>Alpha Clash choices</Title>
            <Button
              variant="light"
              onClick={() => {
                setResult(undefined);
                setReset((value) => value + 1);
              }}
            >
              Reset preview
            </Button>
          </Group>
          <Text c="#aab8c9">
            Native choice adapter preview. This uses typed sample choices and the real adapter.
            Answers are validated and converted to native commands; the engine does not advance.
          </Text>
          <InteractionWorkspace
            key={`${scenario}:${reset}`}
            view={view}
            viewerId="preview-player"
            onSubmit={submit}
          >
            <AlphaClashInteractionPanel view={view} viewerId="preview-player" onSubmit={submit} />
          </InteractionWorkspace>
          <Paper
            withBorder
            p="md"
            radius="md"
            style={{ background: "#101923", color: "#e7edf6", borderColor: "#324156" }}
          >
            <Text fw={600} role="status">
              {result === "Answer rejected."
                ? result
                : result
                  ? "Answer validated"
                  : "Choose an answer to inspect its native command"}
            </Text>
            {result && (
              <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{result}</pre>
            )}
          </Paper>
        </Stack>
      </Container>
    </div>
  );
}
