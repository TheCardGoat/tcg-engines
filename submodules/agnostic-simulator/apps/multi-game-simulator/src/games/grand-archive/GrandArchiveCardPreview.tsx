import type { SimulatorEntity } from "@tcg/simulator-contract";
import { CardFace } from "@tcg/simulator-ui";
import { getGrandArchiveCard } from "@tcg/grand-archive-cards";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { grandArchiveCardPresentation } from "@tcg/grand-archive-server-adapter";

interface GrandArchiveCardPreviewContextValue {
  readonly previewedEntityId?: string;
  readonly show: (entity: SimulatorEntity) => void;
  readonly hide: () => void;
}

const GrandArchiveCardPreviewContext = createContext<GrandArchiveCardPreviewContextValue | null>(
  null,
);

export function grandArchiveEntityWithPrintedDetails(entity: SimulatorEntity): SimulatorEntity {
  if (entity.details) return entity;
  const definitionId = entity.dataAttributes?.["data-definition-id"];
  const card = typeof definitionId === "string" ? getGrandArchiveCard(definitionId) : undefined;
  if (!card?.effect) return entity;
  return {
    ...entity,
    details: {
      rules: [
        {
          id: "printed-text",
          kind: "text",
          text: card.effect.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1"),
        },
      ],
    },
  };
}

export function GrandArchiveCardPreviewProvider({ children }: { readonly children: ReactNode }) {
  const [preview, setPreview] = useState<SimulatorEntity>();
  useEffect(() => {
    if (!preview) return;
    const dismiss = (event: PointerEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest(".ga-history-card-reference, [data-sim-entity-id]")
      )
        return;
      setPreview(undefined);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [preview]);
  const value = useMemo<GrandArchiveCardPreviewContextValue>(
    () => ({
      previewedEntityId: preview?.id,
      show: (entity) => {
        if (entity.face === "public") setPreview(entity);
      },
      hide: () => setPreview(undefined),
    }),
    [preview?.id],
  );

  return (
    <GrandArchiveCardPreviewContext.Provider value={value}>
      {children}
      {preview ? (
        <div
          id="ga-card-preview"
          className="ga-hand-preview"
          data-testid="ga-card-preview"
          role="dialog"
          aria-label={`Card preview: ${preview.title}`}
        >
          <CardFace
            as="div"
            entity={grandArchiveCardPresentation({ ...preview, decorations: [] })}
            density="full"
            fill
            fullImageFit="contain"
          />
        </div>
      ) : null}
    </GrandArchiveCardPreviewContext.Provider>
  );
}

export function useGrandArchiveCardPreview(): GrandArchiveCardPreviewContextValue {
  const context = useContext(GrandArchiveCardPreviewContext);
  if (!context) throw new Error("useGrandArchiveCardPreview must be used inside its provider.");
  return context;
}
