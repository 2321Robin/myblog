import test from "node:test";
import assert from "node:assert/strict";

// getBaseUrl reads NODE_ENV/SITE_URL per call, so each case sets them explicitly.
function withEnv(env, run) {
  const saved = { NODE_ENV: process.env.NODE_ENV, SITE_URL: process.env.SITE_URL };
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return run();
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("production requires SITE_URL", async () => {
  const { getBaseUrl } = await import("../src/lib/site.ts");
  withEnv({ NODE_ENV: "production", SITE_URL: undefined }, () => {
    assert.throws(() => getBaseUrl(), /SITE_URL/);
  });
});

test("production rejects non-https and malformed SITE_URL", async () => {
  const { getBaseUrl } = await import("../src/lib/site.ts");
  withEnv({ NODE_ENV: "production", SITE_URL: "http://example.test" }, () => {
    assert.throws(() => getBaseUrl(), /https/);
  });
  withEnv({ NODE_ENV: "production", SITE_URL: "not a url" }, () => {
    assert.throws(() => getBaseUrl(), /valid absolute URL/);
  });
});

test("a valid SITE_URL is normalized without a trailing slash", async () => {
  const { getBaseUrl } = await import("../src/lib/site.ts");
  withEnv({ NODE_ENV: "production", SITE_URL: "https://example.test/" }, () => {
    assert.equal(getBaseUrl(), "https://example.test");
  });
});

test("development falls back to localhost", async () => {
  const { getBaseUrl } = await import("../src/lib/site.ts");
  withEnv({ NODE_ENV: "development", SITE_URL: undefined }, () => {
    assert.equal(getBaseUrl(), "http://localhost:3000");
  });
});
