import type { EngineInteractionView } from "@tcg/protocol";
import { TargetModal, type TargetCard } from "@tcg/simulator-presentation/target-modal";
import { Button, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { usePresentationSettings } from "@tcg/simulator-presentation/settings";
import { useInteractionSurface } from "@tcg/simulator-ui";
import { SearchRetrievePrompt } from "../../components/SearchRetrievePrompt";
import { SharedInteractionPrompt } from "../../components/SharedInteractionPrompt";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import {
  grandArchiveEntityWithPrintedDetails,
  useGrandArchiveCardPreview,
} from "./GrandArchiveCardPreview";

/** Only the viewer projection supplies art; protocol candidates supply legal choices. */
export function GrandArchiveChoicePrompt({
  fixture,
  view,
}: {
  fixture: GrandArchiveHarnessFixture;
  view: EngineInteractionView;
}) {
  const viewerId = fixture.table.seats.find((seat) => seat.perspective === "bottom")?.id ?? "";
  const surface = useInteractionSurface(view, { disabled: view.actorId !== viewerId });
  const { reducedMotion, soundEnabled } = usePresentationSettings();
  const preview = useGrandArchiveCardPreview();
  const cards = new Map<string, TargetCard>(
    fixture.entities
      .filter((entity) => entity.face === "public")
      .map((entity) => {
        const printed = grandArchiveEntityWithPrintedDetails(entity);
        const zone = fixture.table.zones.find((entry) => entry.entityIds.includes(entity.id));
        return [
          entity.id,
          {
            id: entity.id,
            label: entity.title,
            imageUrl: printed.imageUrl,
            aspectRatio: printed.imageAspectRatio,
            group: zone?.label,
          },
        ];
      }),
  );
  const input = surface.input;
  if (
    input?.kind === "entity-selection" &&
    !input.ordered &&
    input.candidates.every((candidate) => candidate.entity.kind === "card")
  ) {
    return (
      <SearchRetrievePrompt
        surface={surface}
        cards={cards}
        title={input.role === "cost" ? "Choose payment cards" : "Choose cards"}
        reducedMotion={reducedMotion}
      />
    );
  }
  return (
    <SharedInteractionPrompt
      contextualPlacement="inline"
      surface={surface}
      view={view}
      viewerId={viewerId}
      cards={cards}
      source={surface.action?.source ? cards.get(surface.action.source.instanceId) : undefined}
      numberedOrdering
      reducedMotion={reducedMotion}
      soundEnabled={soundEnabled}
      onInspect={(card) => {
        const entity = fixture.entities.find(
          (entry) => entry.id === card.id && entry.face === "public",
        );
        if (entity) preview.show(entity);
      }}
    />
  );
}

/** Phase entry point lists visible native materialization and Preserve choices. */
export function GrandArchiveMaterializationPrompt({
  fixture,
  actionIds,
  onBegin,
}: {
  fixture: GrandArchiveHarnessFixture;
  actionIds: readonly string[];
  onBegin: (actionId: string) => void;
}) {
  const [opened, setOpened] = useState(false);
  const { reducedMotion } = usePresentationSettings();
  const preview = useGrandArchiveCardPreview();
  const choices = actionIds.flatMap((id) => {
    const action = fixture.interactionView?.actions.find(
      (entry) => entry.id === id && entry.enabled,
    );
    const entity = fixture.entities.find(
      (entry) => entry.id === action?.source?.instanceId && entry.face === "public",
    );
    if (!action || !entity) return [];
    const printed = grandArchiveEntityWithPrintedDetails(entity);
    const returnsPreservedCard = fixture.interactions.some(
      (entry) => entry.id === id && entry.movePreview.command === "return-preserved-card",
    );
    return [
      {
        id: action.id,
        label: returnsPreservedCard ? action.text.key : entity.title,
        imageUrl: printed.imageUrl,
        aspectRatio: printed.imageAspectRatio,
        enabled: true,
        entity,
        returnsPreservedCard,
      },
    ];
  });
  if (!choices.length) return null;
  const hasPreserve = choices.some((choice) => choice.returnsPreservedCard);
  const hasMaterialize = choices.some((choice) => !choice.returnsPreservedCard);
  const title = hasPreserve ? "Choose a materialization action" : "Choose a card to materialize";
  const description = hasPreserve
    ? hasMaterialize
      ? "Materialize a card and pay its cost, or return a preserved card to your hand instead of materializing."
      : "Return a preserved card to your hand instead of materializing."
    : "Choose a card to materialize. Its cost must be paid before it enters the field.";
  return (
    <>
      <Stack gap="xs" role="region" aria-label="Materialization choices">
        <Text size="sm" fw={600}>
          {hasPreserve ? "Materialization choices" : "Materialize a card"}
        </Text>
        <Text size="xs">
          {choices.length} legal {choices.length === 1 ? "choice" : "choices"}. {description}
        </Text>
        <Button mih={44} onClick={() => setOpened(true)}>
          {hasPreserve ? "Choose materialization action" : "Choose material"}
        </Button>
      </Stack>
      <TargetModal
        opened={opened}
        title={title}
        cards={choices}
        mode="select"
        reducedMotion={reducedMotion}
        closeLabel="Return to board"
        description={description}
        onClose={() => setOpened(false)}
        onInspect={(card) => preview.show(card.entity)}
        onCard={(card) => {
          setOpened(false);
          onBegin(card.id);
        }}
      />
    </>
  );
}
