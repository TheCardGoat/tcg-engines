import { Button, Group, Text } from "@mantine/core";
import { useState } from "react";
import { validateInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";
import { GrandArchiveTabletop } from "./GrandArchiveTabletop";

/** Real viewer-safe adapter projections; validates answers without advancing an engine. */
export function GrandArchiveInteractionPreview({ scenario }: { scenario: string }) {
  const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === scenario);
  const [reset, setReset] = useState(0);
  const [result, setResult] = useState<string>();
  const [answer, setAnswer] = useState<InteractionSubmission>();
  if (!fixture) return <p>Unknown interaction preview.</p>;
  const submit = (submission: InteractionSubmission) => {
    const validation = fixture.interactionView
      ? validateInteractionSubmission(fixture.interactionView, submission)
      : undefined;
    setAnswer(submission);
    setResult(
      validation?.ok ? "Answer validated. Reset to try another choice." : "Answer rejected.",
    );
    return validation?.ok === true;
  };
  return (
    <>
      <Group p="sm" justify="space-between" style={{ background: "#101923", color: "#e7edf6" }}>
        <div>
          <Text fw={600}>{fixture.name}</Text>
          <Text size="sm">
            Adapter projection preview. Answers are validated; the engine does not advance.
          </Text>
          {result && (
            <Text role="status" size="sm">
              {result}
            </Text>
          )}
        </div>
        <Button
          variant="light"
          onClick={() => {
            setResult(undefined);
            setAnswer(undefined);
            setReset((value) => value + 1);
          }}
        >
          Reset preview
        </Button>
      </Group>
      {answer && (
        <details style={{ padding: 16, background: "#101923", color: "#e7edf6" }}>
          <summary style={{ cursor: "pointer", minHeight: 44 }}>Inspect submitted answer</summary>
          <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
            {JSON.stringify(answer, null, 2)}
          </pre>
        </details>
      )}
      <GrandArchiveTabletop
        key={`${scenario}:${reset}`}
        fixture={fixture}
        onSubmitProtocolInteraction={submit}
      />
    </>
  );
}
