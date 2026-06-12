import { useEffect } from "react";
import { SOCIAL_IMAGE_URL } from "./site";

export interface DocumentSeoInput {
  title: string;
  description: string;
  canonicalUrl: string;
  type?: "website" | "article";
  imageUrl?: string;
  jsonLd?: unknown;
}

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, key);
    document.head.append(meta);
  }
  meta.content = content;
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.append(link);
  }
  link.href = href;
}

export function useDocumentSeo(input: DocumentSeoInput) {
  useEffect(() => {
    document.title = input.title;
    setCanonical(input.canonicalUrl);
    setMeta('meta[name="description"]', "name", "description", input.description);
    setMeta('meta[property="og:type"]', "property", "og:type", input.type ?? "website");
    setMeta('meta[property="og:url"]', "property", "og:url", input.canonicalUrl);
    setMeta('meta[property="og:title"]', "property", "og:title", input.title);
    setMeta('meta[property="og:description"]', "property", "og:description", input.description);
    setMeta(
      'meta[property="og:image"]',
      "property",
      "og:image",
      input.imageUrl ?? SOCIAL_IMAGE_URL,
    );
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", input.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", input.description);
    setMeta(
      'meta[name="twitter:image"]',
      "name",
      "twitter:image",
      input.imageUrl ?? SOCIAL_IMAGE_URL,
    );

    const previous = document.getElementById("page-json-ld");
    previous?.remove();
    if (input.jsonLd) {
      const script = document.createElement("script");
      script.id = "page-json-ld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(input.jsonLd);
      document.head.append(script);
    }
  }, [input]);
}
