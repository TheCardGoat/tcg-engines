import { useEffect, useState, type ImgHTMLAttributes } from "react";

export interface NarutoCardImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  readonly src: string | undefined;
  readonly fallbackLabel?: string;
}

/**
 * Keeps a broken art URL from turning a card into an unexplained browser icon.
 * The caller still owns the accessible card name, so the fallback exposes only
 * a generic visual identity and never reveals concealed card information.
 */
export function NarutoCardImage({
  src,
  alt = "",
  className,
  fallbackLabel = "Preview card",
  onError,
  ...imageProps
}: NarutoCardImageProps) {
  const [failed, setFailed] = useState(src === undefined);
  const isCardBack = fallbackLabel === "Card back";

  useEffect(() => setFailed(src === undefined), [src]);

  if (failed) {
    return (
      <span
        aria-label={alt || fallbackLabel}
        className={className}
        data-card-image-fallback="true"
        data-card-image-kind={isCardBack ? "back" : "identity"}
        role="img"
        style={{
          alignItems: "center",
          display: "grid",
          justifyItems: "center",
          padding: "0.35rem",
        }}
      >
        {isCardBack ? null : fallbackLabel}
      </span>
    );
  }

  return (
    <img
      {...imageProps}
      alt={alt}
      className={className}
      src={src}
      onError={(event) => {
        onError?.(event);
        setFailed(true);
      }}
    />
  );
}
