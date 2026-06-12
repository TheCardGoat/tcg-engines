import type { CSSProperties, Ref } from "react";

import { cx } from "../class-names";

export const DEFAULT_CARD_ASPECT_RATIO = 5 / 7;

export interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: number;
  fit?: "cover" | "contain";
  fill?: boolean;
  loading?: "eager" | "lazy";
  className?: string;
  imageClassName?: string;
  imageRef?: Ref<HTMLImageElement>;
  style?: CSSProperties;
  onImageLoad?: () => void;
  onImageError?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function CardImage({
  src,
  alt,
  aspectRatio = DEFAULT_CARD_ASPECT_RATIO,
  fit = "cover",
  fill = false,
  loading = "lazy",
  className,
  imageClassName,
  imageRef,
  style,
  onImageLoad,
  onImageError,
  onMouseEnter,
  onMouseLeave,
}: CardImageProps) {
  return (
    <div
      className={cx(
        "sim-card-image relative overflow-hidden rounded-[3px]",
        fill ? "h-full w-full" : "w-full",
        className,
      )}
      style={{
        ...style,
        aspectRatio: fill ? style?.aspectRatio : (style?.aspectRatio ?? aspectRatio),
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        loading={loading}
        className={cx(
          "absolute inset-0 h-full w-full select-none",
          fit === "cover" ? "object-cover" : "object-contain",
          imageClassName,
        )}
        draggable={false}
        onLoad={onImageLoad}
        onError={onImageError}
      />
    </div>
  );
}
