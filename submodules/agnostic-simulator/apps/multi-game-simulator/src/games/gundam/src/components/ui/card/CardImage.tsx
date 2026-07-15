import { buildCardImageUrl } from "./card-image-format.ts";

export interface CardImageProps {
  readonly set: string;
  readonly cardNumber: string;
  readonly src?: string;
  readonly alt: string;
  readonly className?: string;
  readonly onLoad?: () => void;
  readonly onError?: () => void;
}

export function CardImage({
  set,
  cardNumber,
  src,
  alt,
  className,
  onLoad,
  onError,
}: CardImageProps) {
  const resolvedSrc = src ?? buildCardImageUrl(set, cardNumber);

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
