import type { CSSProperties, ImgHTMLAttributes, Ref } from "react";
export { STANDARD_CARD_IMAGE_ASPECT_RATIO } from "@tcg/simulator-contract";

import { cx } from "../class-names";

export interface CardImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "loading" | "draggable" | "onLoad" | "onError"
> {
  src: string;
  alt: string;
  loading?: "eager" | "lazy";
  className?: string;
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
  loading = "lazy",
  className,
  imageRef,
  style,
  onImageLoad,
  onImageError,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: CardImageProps) {
  return (
    <img
      {...rest}
      ref={imageRef}
      src={src}
      alt={alt}
      loading={loading}
      className={cx("sim-card-image block h-full w-full select-none object-contain", className)}
      style={style}
      draggable={false}
      onLoad={onImageLoad}
      onError={onImageError}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}
