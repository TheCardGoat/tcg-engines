import { useFabCardArt } from "./FabPresentationCatalog";
import type { SimulatorEntity } from "@tcg/simulator-contract";

import { useFabCardLocale } from "./FabPresentationCatalog";
import { useFabPreviewTarget } from "./FabCardPreview";
import type { FabPresentationState } from "./state";

export function FabHistoryCardReference({
  name,
  definition,
  definitionId,
  entityId,
}: {
  readonly name: string;
  readonly definition?: FabPresentationState["cardDefinitions"][string];
  readonly definitionId?: string;
  readonly entityId?: string;
}) {
  const canonicalId = definitionId ?? definition?.presentationCanonicalId;
  const locale = useFabCardLocale();
  const { resolveFabCardArt } = useFabCardArt();
  const art = resolveFabCardArt({ canonicalId, name, locale });
  const entity: SimulatorEntity = {
    id: entityId ?? `fab-log-card:${canonicalId ?? name}`,
    title: name,
    subtitle: definition?.typeLine ?? definition?.cardType ?? "Card",
    kind: "card",
    ownerId: "log",
    face: "public",
    states: [],
    stats: [],
    traits: [],
    imageUrl: art.printedImageUrl ?? definition?.imageUrl,
    imageAspectRatio: art.imageAspectRatio,
    details: {
      rules: definition?.printedText
        ? [{ id: `${name}:printed`, kind: "ability", text: definition.printedText }]
        : [],
    },
    dataAttributes: canonicalId ? { "data-fab-canonical-id": canonicalId } : undefined,
  };
  const previewTarget = useFabPreviewTarget(entity, { pinOnClick: true });

  return (
    <span
      role="button"
      tabIndex={0}
      className="fab-card-name-reference fab-card-name-reference-label"
      data-fab-pitch={definition?.pitchValue ?? "none"}
      aria-label={`Preview ${name}`}
      {...previewTarget.previewProps}
    >
      {name}
    </span>
  );
}
