import type { SimulatorEntity } from "@tcg/simulator-contract";

import { CardImage, type CardImageProps } from "./CardImage";
import { projectSimulatorEntityForFace, type SimulatorEntityFace } from "./entity-visibility";

export interface ViewerSafeCardImageProps extends Omit<CardImageProps, "src" | "alt"> {
  readonly entity: SimulatorEntity;
  readonly face?: SimulatorEntityFace;
  readonly alt?: string;
}

/**
 * The only card-art component that product surfaces should mount.
 *
 * It projects the entity before choosing a URL, so a hidden entity may carry
 * a leaked private image URL without that URL ever reaching an img element or
 * initiating a browser request.
 */
export function ViewerSafeCardImage({
  entity,
  face,
  alt,
  ...imageProps
}: ViewerSafeCardImageProps) {
  const projected = projectSimulatorEntityForFace(entity, face);
  const src = projected.face === "hidden" ? projected.backImageUrl : projected.imageUrl;
  if (!src) return null;

  return <CardImage {...imageProps} src={src} alt={alt ?? projected.title} />;
}
