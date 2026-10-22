import { randomBytes } from "node:crypto";

// One token per dev-server process. It never leaves the machine: injected into
// the page as a dev-only <meta> tag and sent back via a request header.
// Stored on globalThis because the dev server compiles this module once per
// runtime layer (route handler and RSC renderer); a module-local variable would
// produce two different tokens and break the editor.
const KEY = "__w2321DevSaveToken";
const globals = globalThis as typeof globalThis & { [KEY]?: string };

export function getDevSaveToken(): string {
  if (!globals[KEY]) {
    globals[KEY] = randomBytes(32).toString("hex");
  }
  return globals[KEY];
}
