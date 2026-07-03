import { useEffect, useRef } from "react";
import { AspectRatio } from "@mantine/core";
import { useCardPreview, type CardPreviewDetails } from "../CardPreview/CardPreviewContext";
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
  className,
  onImageLoad,
  onImageError,
}: CardImageProps) {
  const src =
    faceDown || !imageUrl ? (cardType === "legend" ? LEGEND_CARD_BACK : CARD_BACK) : imageUrl;
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { show, hide } = useCardPreview();
  // Face-down cards (deck/eddies/legend backs) don't reveal the actual card,
  // so previewing them adds no information.
  const previewable = !disablePreview && !faceDown && !!imageUrl;

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
      onMouseEnter={
        previewable
          ? () =>
              show({
                imageUrl: src,
                alt,
                color,
                details: previewDetails ?? { name: alt },
              })
          : undefined
      }
      onMouseLeave={previewable ? () => hide() : undefined}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={classes.img}
        onLoad={onImageLoad}
        onError={onImageError}
      />
    </AspectRatio>
  );
}
