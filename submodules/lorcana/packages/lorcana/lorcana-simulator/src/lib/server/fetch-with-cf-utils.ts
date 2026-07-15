function normalizeApiOrigin(value: string): string {
  return value
    .trim()
    .replace(/\/v1\/?$/, "")
    .replace(/\/$/, "");
}

function addRailwayDefaultPort(url: URL): URL {
  if (url.hostname.endsWith(".railway.internal") && !url.port) {
    url.port = "8080";
  }

  return url;
}

function addDefaultProtocolIfHostname(value: string): string {
  if (/^[a-z][a-z\d+\-.]*:\/\//i.test(value)) {
    return value;
  }

  const hostnameCandidate = value.split("/")[0] ?? "";
  const looksLikeHost =
    hostnameCandidate === "localhost" ||
    hostnameCandidate.startsWith("localhost:") ||
    /^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?$/.test(hostnameCandidate) ||
    /^[a-z\d](?:[a-z\d-]*[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]*[a-z\d])?)+(?::\d+)?$/i.test(
      hostnameCandidate,
    );

  if (!looksLikeHost) {
    return value;
  }

  const hostname = (hostnameCandidate.split(":")[0] ?? "").toLowerCase();

  if (hostname === "railway.internal" || hostname.endsWith(".railway.internal")) {
    // Railway private-network routes are HTTP-only and should stay on the private network.
    return `http://${value}`;
  }

  return `https://${value}`;
}

export function validateAndNormalizePrivateApiOrigin(value: string): string {
  let url: URL;
  try {
    url = addRailwayDefaultPort(new URL(addDefaultProtocolIfHostname(value.trim())));
  } catch {
    throw new Error("Invalid PRIVATE_API_URL: must be an absolute http(s) URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(
      `Invalid PRIVATE_API_URL protocol "${url.protocol}": only http and https are supported.`,
    );
  }

  return normalizeApiOrigin(url.toString());
}
