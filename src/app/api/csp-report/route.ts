// Collector for CSP violation reports (report-uri /api/csp-report). Reports
// stay tiny; anything over 64 KB is dropped while reading, not after. Every
// outcome answers 204: a non-2xx would make browsers retry the report. Entries
// are single-line JSON on stdout, so under systemd they land in the service
// journal (journalctl -u personal-homepage) with no filesystem bookkeeping.
const MAX_BODY_BYTES = 64 * 1024;

async function readBody(request: Request): Promise<unknown> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return null;
  if (!request.body) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  try {
    return JSON.parse(Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString("utf8"));
  } catch {
    return null;
  }
}

// Only the fields needed to triage a violation are kept; the full report can
// contain page fragments, so the rest is dropped on arrival.
function logReport(raw: unknown): void {
  const report = (raw as { "csp-report"?: Record<string, unknown> } | null)?.["csp-report"];
  if (!report || typeof report !== "object") return;
  console.log(
    JSON.stringify({
      csp: {
        time: new Date().toISOString(),
        documentUri: report["document-uri"],
        violatedDirective: report["violated-directive"],
        effectiveDirective: report["effective-directive"],
        blockedUri: report["blocked-uri"],
        disposition: report["disposition"],
      },
    }),
  );
}

export async function POST(request: Request): Promise<Response> {
  logReport(await readBody(request));
  return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
}
