import { useMemo, useState } from "react";

import type {
  HarnessFixture,
  InteractionInput,
  SimulatorInteraction,
} from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { ChoiceChips } from "./ChoiceChips";

export interface InteractionPanelProps {
  fixture: HarnessFixture;
  onSubmitInteraction?: (
    interactionId: string,
    selection: {
      entityIds: string[];
      optionIds: string[];
      paymentIds: string[];
      orderedIds: string[];
    },
  ) => void;
  onPreviewMove?: (interaction: SimulatorInteraction) => void;
}

export function InteractionPanel({
  fixture,
  onSubmitInteraction,
  onPreviewMove,
}: InteractionPanelProps) {
  const [selectedEntityIds, setSelectedEntityIds] = useState<Record<string, string[]>>({});
  const [selectedOptionIds, setSelectedOptionIds] = useState<Record<string, string[]>>({});
  const [paymentEntityIds, setPaymentEntityIds] = useState<Record<string, string[]>>({});
  const [orderedEntityIds, setOrderedEntityIds] = useState<Record<string, string[]>>({});

  const entityMap = useMemo(
    () => new Map(fixture.entities.map((entity) => [entity.id, entity])),
    [fixture.entities],
  );

  const candidateLabel = (entityId: string) => entityMap.get(entityId)?.title ?? entityId;
  const boundsLabel = (input: InteractionInput) =>
    `${input.min ?? 0}-${input.max ?? input.candidateEntityIds.length}`;
  const sourceLabel = (interaction: SimulatorInteraction) =>
    interaction.sourceEntityId
      ? (entityMap.get(interaction.sourceEntityId)?.title ?? "Adapter prompt")
      : "Adapter prompt";

  const toggleCandidate = (interactionId: string, entityId: string, input: InteractionInput) => {
    const current = selectedEntityIds[interactionId] ?? [];
    const isMulti = input.kind === "multi-target" || input.kind === "payment";
    const next = current.includes(entityId)
      ? current.filter((id) => id !== entityId)
      : isMulti
        ? [...current, entityId]
        : [entityId];
    setSelectedEntityIds((prev) => ({ ...prev, [interactionId]: next }));
  };

  const togglePayment = (interactionId: string, entityId: string) => {
    const current = paymentEntityIds[interactionId] ?? [];
    const next = current.includes(entityId)
      ? current.filter((id) => id !== entityId)
      : [...current, entityId];
    setPaymentEntityIds((prev) => ({ ...prev, [interactionId]: next }));
  };

  const toggleOrderEntity = (interactionId: string, entityId: string) => {
    const current = orderedEntityIds[interactionId] ?? [];
    const next = current.includes(entityId)
      ? current.filter((id) => id !== entityId)
      : [...current, entityId];
    setOrderedEntityIds((prev) => ({ ...prev, [interactionId]: next }));
  };

  const submitInteraction = (interaction: SimulatorInteraction) => {
    onSubmitInteraction?.(interaction.id, {
      entityIds: selectedEntityIds[interaction.id] ?? [],
      optionIds: selectedOptionIds[interaction.id] ?? [],
      paymentIds: paymentEntityIds[interaction.id] ?? [],
      orderedIds: orderedEntityIds[interaction.id] ?? [],
    });
  };

  const isSubmitEnabled = (interaction: SimulatorInteraction): boolean => {
    const input = interaction.input;
    const sel = selectedEntityIds[interaction.id] ?? [];
    const opts = selectedOptionIds[interaction.id] ?? [];
    const pays = paymentEntityIds[interaction.id] ?? [];
    const ords = orderedEntityIds[interaction.id] ?? [];

    switch (input.kind) {
      case "single-target":
        return sel.length === 1;
      case "multi-target":
        return sel.length >= (input.min ?? 1) && sel.length <= (input.max ?? sel.length);
      case "option":
        return opts.length >= 1;
      case "payment":
        return pays.length >= (input.min ?? 1);
      case "ordering":
        return ords.length >= (input.min ?? 1);
      case "action":
        return true;
      case "drag-drop-target":
        return sel.length >= 1;
      default:
        return true;
    }
  };

  const eyebrowClass =
    "eyebrow text-[12px] font-extrabold leading-tight tracking-normal text-[var(--game-accent)] uppercase";
  const chipClass = (isSelected: boolean) =>
    cx(
      "interaction-chip inline-flex min-h-6 cursor-pointer items-center break-words rounded-full border px-2 py-1 text-[11px] font-extrabold leading-none transition-colors",
      isSelected
        ? "border-[var(--game-accent)] bg-[var(--game-accent)]/20 text-[var(--game-accent)]"
        : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--muted)] hover:text-[var(--text)]",
    );
  const zoneChipClass =
    "interaction-chip inline-flex min-h-6 items-center break-words rounded-full border border-[var(--border)] bg-slate-50 px-2 py-1 text-[11px] font-extrabold leading-none text-[var(--quiet)]";

  return (
    <aside
      className="interaction-panel min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-[18px] shadow-[var(--shadow)] max-[520px]:p-3.5"
      aria-label="Interaction panel"
    >
      <div className="panel-heading mb-3.5">
        <p className={eyebrowClass}>ui to engine</p>
        <h2 className="mt-1.5 break-words text-[22px] font-extrabold leading-tight text-[var(--text)]">
          Interaction draft
        </h2>
      </div>
      {fixture.interactions.map((interaction) => {
        const input = interaction.input;
        const selEntities = selectedEntityIds[interaction.id] ?? [];
        const selOptions = selectedOptionIds[interaction.id] ?? [];
        const selPayments = paymentEntityIds[interaction.id] ?? [];
        const selOrdered = orderedEntityIds[interaction.id] ?? [];
        return (
          <article
            key={interaction.id}
            className="interaction-card grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3.5"
            data-testid={`interaction-card:${interaction.id}`}
            data-interaction-id={interaction.id}
          >
            <div className="interaction-header">
              <p className={eyebrowClass}>active prompt</p>
              <h3 className="mt-1 break-words text-lg font-black text-[var(--text)]">
                {interaction.label}
              </h3>
            </div>
            <p className="interaction-prompt text-sm leading-snug text-[var(--muted)]">
              {interaction.prompt}
            </p>
            <p className="source-line text-sm leading-snug text-[var(--muted)]">
              Source: {sourceLabel(interaction)}
            </p>

            {input.kind === "option" && input.options.length > 0 && (
              <div className="grid gap-2">
                <span className="text-[11px] font-black uppercase text-[var(--quiet)]">
                  Choose one
                </span>
                <ChoiceChips
                  options={input.options}
                  selectedIds={selOptions}
                  multi={input.max !== undefined && input.max > 1}
                  onSelect={(ids) =>
                    setSelectedOptionIds((prev) => ({ ...prev, [interaction.id]: ids }))
                  }
                />
              </div>
            )}

            {(input.kind === "single-target" ||
              input.kind === "multi-target" ||
              input.kind === "drag-drop-target") && (
              <div className="grid gap-2">
                <span className="text-[11px] font-black uppercase text-[var(--quiet)]">
                  Select target{input.kind === "multi-target" ? "s" : ""}{" "}
                  <span className="ml-1 text-[10px] font-bold text-[var(--muted)]">
                    ({boundsLabel(input)})
                  </span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {input.candidateEntityIds.map((entityId) => (
                    <button
                      key={entityId}
                      className={chipClass(selEntities.includes(entityId))}
                      onClick={() => toggleCandidate(interaction.id, entityId, input)}
                      aria-pressed={selEntities.includes(entityId)}
                      data-testid={`interaction-candidate:${interaction.id}:${entityId}`}
                      data-entity-id={entityId}
                    >
                      {candidateLabel(entityId)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {input.kind === "payment" && (
              <div className="grid gap-2">
                <span className="text-[11px] font-black uppercase text-[var(--quiet)]">
                  Payment{" "}
                  <span className="text-[10px] font-bold text-[var(--muted)]">
                    ({boundsLabel(input)})
                  </span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {input.candidateEntityIds.map((entityId) => (
                    <button
                      key={entityId}
                      className={chipClass(selPayments.includes(entityId))}
                      onClick={() => togglePayment(interaction.id, entityId)}
                      aria-pressed={selPayments.includes(entityId)}
                      data-testid={`interaction-payment:${interaction.id}:${entityId}`}
                      data-entity-id={entityId}
                    >
                      {candidateLabel(entityId)}
                    </button>
                  ))}
                </div>
                {selPayments.length > 0 && (
                  <p className="text-xs font-bold text-[var(--game-accent)]">
                    {selPayments.length} resources selected
                  </p>
                )}
              </div>
            )}

            {input.kind === "ordering" && (
              <div className="grid gap-2">
                <span className="text-[11px] font-black uppercase text-[var(--quiet)]">
                  Order{" "}
                  <span className="text-[10px] font-bold text-[var(--muted)]">
                    ({boundsLabel(input)})
                  </span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {input.candidateEntityIds.map((entityId) => (
                    <button
                      key={entityId}
                      className={chipClass(selOrdered.includes(entityId))}
                      onClick={() => toggleOrderEntity(interaction.id, entityId)}
                      aria-pressed={selOrdered.includes(entityId)}
                      data-testid={`interaction-order:${interaction.id}:${entityId}`}
                      data-entity-id={entityId}
                    >
                      {candidateLabel(entityId)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {input.targetZoneIds.length > 0 && (
              <div className="grid gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2.5">
                <dt className="text-[11px] font-black uppercase text-[var(--quiet)]">
                  Target zones
                </dt>
                <dd className="m-0 flex flex-wrap gap-1">
                  {input.targetZoneIds.map((zoneId) => (
                    <span key={zoneId} className={zoneChipClass}>
                      {zoneId}
                    </span>
                  ))}
                </dd>
              </div>
            )}

            <div className="move-preview grid gap-2 rounded-md bg-[#121826] p-3 text-[#e9eef7]">
              <p className={eyebrowClass}>adapter move preview</p>
              <code className="break-words font-mono text-[13px]">
                {interaction.movePreview.engine}.{interaction.movePreview.command}
              </code>
              <span className="break-words font-mono text-xs leading-snug text-[#b9c3d3]">
                {interaction.movePreview.payload}
              </span>
              <button
                className="mt-1 w-full rounded-md bg-[var(--game-accent)]/20 py-2 text-xs font-black text-[var(--game-accent)] transition-colors hover:bg-[var(--game-accent)]/30"
                onClick={() => onPreviewMove?.(interaction)}
              >
                Preview Move
              </button>
            </div>

            <button
              className={cx(
                "w-full rounded-md py-2.5 text-sm font-black transition-colors",
                isSubmitEnabled(interaction)
                  ? "bg-[var(--game-accent)] text-white hover:opacity-90"
                  : "cursor-not-allowed bg-[var(--board-border)] text-[var(--board-muted)]",
              )}
              disabled={!isSubmitEnabled(interaction)}
              onClick={() => submitInteraction(interaction)}
              data-testid={`interaction-submit:${interaction.id}`}
            >
              Submit
            </button>
          </article>
        );
      })}
    </aside>
  );
}
