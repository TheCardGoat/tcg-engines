import "./FabBoardCardFace.css";
import { useFabCardArt } from "./FabPresentationCatalog";
import { CardFace } from "@tcg/simulator-ui";
import type { SimulatorEntity, SimulatorEntityDecoration } from "@tcg/simulator-contract";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { useFabCardLocale } from "./FabPresentationCatalog";
import { useFabImageRetry } from "./useFabImageRetry";
import { FabCardPreviewFallback, useFabPreviewTarget } from "./FabCardPreview";
import { hiddenCardPresentationForFabLayout } from "./projection";

const FAB_COUNTER_DECORATION_PREFIX = "fab-counter-";
const MAX_VISIBLE_COUNTER_TYPES = 3;
const EMPTY_HIGHLIGHTED_ENTITY_IDS: ReadonlySet<string> = new Set();
const FabBoardHighlightContext = createContext<ReadonlySet<string>>(EMPTY_HIGHLIGHTED_ENTITY_IDS);

export function FabBoardHighlightProvider({
  entityIds,
  children,
}: {
  readonly entityIds: readonly string[];
  readonly children: ReactNode;
}) {
  const highlighted = useMemo(() => new Set(entityIds), [entityIds]);
  return (
    <FabBoardHighlightContext.Provider value={highlighted}>
      {children}
    </FabBoardHighlightContext.Provider>
  );
}

type FabCounterIcon = "defense" | "power" | "fallback";

function iconForFabCounter(label: string): FabCounterIcon {
  const tokens = label.toLocaleLowerCase().split(/[^a-z]+/u);

  if (tokens.includes("d") || tokens.includes("defense") || tokens.includes("defence")) {
    return "defense";
  }
  if (tokens.includes("p") || tokens.includes("power")) {
    return "power";
  }

  return "fallback";
}

function FabCardCounter({ decoration }: { readonly decoration: SimulatorEntityDecoration }) {
  const value = decoration.content.kind === "text" ? decoration.content.text : "";
  const icon = iconForFabCounter(decoration.ariaLabel);

  return (
    <span
      className="fab-card-counter"
      data-fab-counter-icon={icon}
      data-fab-counter-stacked={value.includes("×") ? "true" : undefined}
      data-testid="fab-card-counter"
    >
      {value}
    </span>
  );
}

export function FabBoardCardFace({
  entity,
  density,
  fill = false,
  frameBadges = "show",
  preview = true,
}: {
  entity: SimulatorEntity;
  density: "mini" | "compact" | "normal" | "large" | "full";
  fill?: boolean;
  /** Context wrappers may replace tactical badges while retaining one card face. */
  frameBadges?: "show" | "hide";
  /** Dense thumbnails keep the same artwork contract without opening a hover preview. */
  preview?: boolean;
}) {
  const locale = useFabCardLocale();
  const {
    resolveFabCardArt,
    boardImageCandidatesForFabCard,
    imageUrlForFabCard,
    imageAspectRatioForFabCard,
  } = useFabCardArt();
  const highlightedEntityIds = useContext(FabBoardHighlightContext);
  const canonicalIdAttribute = entity.dataAttributes?.["data-fab-canonical-id"];
  const printingIdAttribute = entity.dataAttributes?.["data-fab-printing-id"];
  const presentationIdentity = {
    locale,
    canonicalId: typeof canonicalIdAttribute === "string" ? canonicalIdAttribute : undefined,
    printingId: typeof printingIdAttribute === "string" ? printingIdAttribute : undefined,
    name: entity.title,
  };
  const art = entity.face === "public" ? resolveFabCardArt(presentationIdentity) : undefined;
  const boardImageCandidates =
    entity.face === "public"
      ? boardImageCandidatesForFabCard(
          presentationIdentity,
          entity.imageUrl
            ? {
                imageUrl: entity.imageUrl,
                imageAspectRatio:
                  entity.imageAspectRatio ?? imageAspectRatioForFabCard(presentationIdentity),
              }
            : undefined,
        )
      : [];
  const candidateSource = boardImageCandidates
    .map((candidate) => `${candidate.artVariant}:${candidate.imageUrl}`)
    .join("\n");
  const retry = useFabImageRetry(candidateSource || undefined);
  const boardImageCandidateKey = retry.key;
  const [imageFailure, setImageFailure] = useState({ candidateKey: "", failedCount: 0 });
  const failedImageCount =
    imageFailure.candidateKey === boardImageCandidateKey ? imageFailure.failedCount : 0;
  const boardImageCandidate = boardImageCandidates[failedImageCount];
  useEffect(() => {
    if (candidateSource && !boardImageCandidate && !retry.failed) retry.fail();
  }, [candidateSource, boardImageCandidate, retry.failed, retry.fail]);
  const previewEntity =
    entity.face === "public"
      ? {
          ...entity,
          imageUrl: imageUrlForFabCard(presentationIdentity) ?? entity.imageUrl,
          imageAspectRatio: imageAspectRatioForFabCard(presentationIdentity),
        }
      : entity;
  const fallbackHiddenCardPresentation = hiddenCardPresentationForFabLayout(
    entity.hiddenBackLayout,
  );
  const resolvedBoardEntity =
    entity.face === "hidden"
      ? {
          ...fallbackHiddenCardPresentation,
          ...entity,
          backImageUrl: entity.backImageUrl ?? fallbackHiddenCardPresentation.backImageUrl,
        }
      : {
          ...entity,
          imageUrl: boardImageCandidate?.imageUrl,
          imageAspectRatio: boardImageCandidate?.imageAspectRatio ?? entity.imageAspectRatio,
          dataAttributes: {
            ...entity.dataAttributes,
            "data-fab-asset-locale": art?.assetLocale,
            "data-fab-asset-locale-fallback": art?.localeFallback ? "true" : undefined,
            ...(boardImageCandidate ? { "data-art-variant": boardImageCandidate.artVariant } : {}),
          },
        };
  const counterDecorations =
    resolvedBoardEntity.decorations?.filter((decoration) =>
      decoration.id.startsWith(FAB_COUNTER_DECORATION_PREFIX),
    ) ?? [];
  const visibleDecorations =
    frameBadges === "show"
      ? resolvedBoardEntity.decorations?.filter(
          (decoration) => !decoration.id.startsWith(FAB_COUNTER_DECORATION_PREFIX),
        )
      : undefined;
  const counterDescription = counterDecorations
    .map((decoration) => {
      const count = decoration.content.kind === "text" ? decoration.content.text : "";
      return `${decoration.ariaLabel}: ${count}`;
    })
    .join(", ");
  const visibleCounterDecorations = counterDecorations.slice(0, MAX_VISIBLE_COUNTER_TYPES);
  const hiddenCounterTypeCount = counterDecorations.length - visibleCounterDecorations.length;
  const boardEntity = {
    ...resolvedBoardEntity,
    decorations: visibleDecorations,
    ...(counterDecorations.length > 0
      ? {
          accessibilityDescription: [
            resolvedBoardEntity.accessibilityDescription,
            `Counters: ${counterDescription}`,
          ]
            .filter((description): description is string => Boolean(description))
            .join(". "),
        }
      : {}),
  };
  const usesImageFallback = boardEntity.face === "public" && !boardImageCandidate;
  const previewTarget = useFabPreviewTarget(previewEntity, {
    enabled: preview && previewEntity.face === "public",
  });

  return (
    <div
      className="fab-board-card-face-shell"
      style={{
        aspectRatio:
          boardImageCandidates[0]?.imageAspectRatio ??
          resolvedBoardEntity.imageAspectRatio ??
          imageAspectRatioForFabCard(presentationIdentity),
      }}
      {...previewTarget.previewProps}
    >
      <CardFace
        key={retry.key}
        entity={boardEntity}
        density={density}
        as="div"
        highlighted={highlightedEntityIds.has(entity.id)}
        fill={fill}
        fullImageChrome="edge-to-edge"
        fullImageFit="cover"
        onImageError={
          boardImageCandidate
            ? () => {
                setImageFailure({
                  candidateKey: boardImageCandidateKey,
                  failedCount: failedImageCount + 1,
                });
              }
            : undefined
        }
      />
      {usesImageFallback ? (
        <FabCardPreviewFallback entity={boardEntity} status="error" variant="board" />
      ) : null}
      {counterDecorations.length > 0 ? (
        <span className="fab-card-counter-row" aria-hidden="true">
          {visibleCounterDecorations.map((decoration) => (
            <FabCardCounter key={decoration.id} decoration={decoration} />
          ))}
          {hiddenCounterTypeCount > 0 ? (
            <span
              className="fab-card-counter fab-card-counter-overflow"
              data-testid="fab-card-counter-overflow"
            >
              +{hiddenCounterTypeCount}
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
