import { useCallback, useEffect, useRef, type MouseEvent } from "react";
import { AspectRatio } from "@mantine/core";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { ViewerSafeCardImage } from "@tcg/simulator-ui";
import { useHasHover } from "../../../../lib/media-query";
import { useCardPreview, type CardPreviewDetails } from "../CardPreview/CardPreviewContext";
import { useCardInspect } from "./CardInspectContext";
import classes from "./CardImage.module.css";

export const CARD_BACK = "https://r2.tcg.online/public/cyberpunk/cards/back/card-back.webp";
export const LEGEND_CARD_BACK =
  "https://r2.tcg.online/public/cyberpunk/cards/back/legend-card-back.webp";
export const CARD_ASPECT_RATIO = 5 / 7;

interface CardImageProps {
  imageUrl?: string;
  faceDown?: boolean;
  alt?: string;
  /** Card type — used to select the correct card-back image when face-down. */
  cardType?: "legend" | "unit" | "gear" | "program";
  /** Disable the global hover preview (e.g. for the card-back of an opponent's hand). */
  disablePreview?: boolean;
  /** Card frame color, forwarded to the hover preview as an accent border. */
  color?: "blue" | "green" | "red" | "yellow";
  /** Face-up card facts shown while the hover preview image is loading or unavailable. */
  previewDetails?: CardPreviewDetails;
  /** On touch-only devices, tap the image itself to open the card inspect modal. */
  inspectOnTap?: boolean;
  className?: string;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

export function CardImage({
  imageUrl,
  faceDown = false,
  alt = "",
  cardType,
  disablePreview = false,
  color,
  previewDetails,
  inspectOnTap = false,
  className,
  onImageLoad,
  onImageError,
}: CardImageProps) {
  const src =
    faceDown || !imageUrl ? (cardType === "legend" ? LEGEND_CARD_BACK : CARD_BACK) : imageUrl;
  const entity: SimulatorEntity = {
    id: faceDown ? "hidden-card" : alt || "card",
    title: faceDown ? "Hidden card" : alt || "Card",
    subtitle: cardType ?? "Card",
    kind: "card",
    ownerId: "viewer",
    face: faceDown ? "hidden" : "public",
    states: [],
    stats: [],
    traits: [],
    imageUrl,
    backImageUrl: cardType === "legend" ? LEGEND_CARD_BACK : CARD_BACK,
  };
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { show, hide } = useCardPreview();
  const { inspect } = useCardInspect();
  const hasHover = useHasHover();
  // Face-down cards (deck/eddies/legend backs) don't reveal the actual card,
  // so previewing them adds no information.
  const previewable = !disablePreview && !faceDown && !!imageUrl;
  const hoverPreviewable = previewable && hasHover;
  const tapInspectable = previewable && inspectOnTap && !hasHover;
  const showPreview = useCallback(() => {
    if (!previewable) return;

    show({
      imageUrl: src,
      face: "public",
      alt,
      color,
      details: previewDetails ?? { name: alt },
    });
  }, [alt, color, previewDetails, previewable, show, src]);
  const openInspect = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!tapInspectable) return;

      event.preventDefault();
      event.stopPropagation();
      hide();
      inspect({
        imageUrl: src,
        face: "public",
        name: previewDetails?.name ?? alt,
        color,
      });
    },
    [alt, color, hide, inspect, previewDetails?.name, src, tapInspectable],
  );

  useEffect(() => {
    if (!onImageLoad && !onImageError) return;

    const image = imageRef.current;
    if (!image?.complete) return;

    if (image.naturalWidth > 0) {
      onImageLoad?.();
    } else {
      onImageError?.();
    }
  });

  return (
    <AspectRatio
      ratio={CARD_ASPECT_RATIO}
      className={`${classes.wrap} ${className ?? ""}`}
      onMouseEnter={hoverPreviewable ? showPreview : undefined}
      onMouseLeave={hoverPreviewable ? () => hide() : undefined}
      onFocus={hoverPreviewable ? showPreview : undefined}
      onBlur={hoverPreviewable ? () => hide() : undefined}
      onClick={tapInspectable ? openInspect : undefined}
    >
      <ViewerSafeCardImage
        entity={entity}
        alt={faceDown ? "Hidden card" : alt}
        fill
        className="h-full w-full"
        imageClassName={classes.img}
        imageRef={imageRef}
        onImageLoad={onImageLoad}
        onImageError={onImageError}
      />
    </AspectRatio>
  );
}
