import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
const root = path.resolve("out");
const server = createServer(async (req, res) => {
  try {
    let file = path.join(
      root,
      decodeURIComponent(new URL(req.url, "http://localhost").pathname),
    );
    if (!file.startsWith(root + path.sep) && file !== root) throw new Error();
    if ((await stat(file + ".html").catch(() => null))?.isFile()) file += ".html";
    else if ((await stat(file).catch(() => null))?.isDirectory()) file = path.join(file, "index.html");
    const content = await readFile(file);
    const types = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".woff2": "font/woff2",
    };
    res.writeHead(200, {
      "content-type": types[path.extname(file)] || "application/octet-stream",
    });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
  args: [
    "--no-sandbox",
    "--no-zygote",
    "--single-process",
    "--disable-dev-shm-usage",
  ],
  headless: true,
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  // This suite tests the static export's unconfigured/empty state; live email and API flows are separate UAT gates.
  await page.route("**/*", (route) =>
    new URL(route.request().url()).origin === origin
      ? route.continue()
      : route.abort(),
  );
  const routes = [
    "/",
    "/about",
    "/councils",
    "/services",
    "/help",
    "/login",
    "/signup",
    "/account",
    "/contact",
    "/reset-password",
    "/search?postcode=EN118AA",
    "/council-view?council=barnet",
    "/council-service?council=barnet&service=council-tax",
    "/write-review?council=barnet",
    "/council/hertfordshire",
    "/service/westminster/planning/reviews",
    "/legal/privacy",
    "/legal/cookies",
    "/legal/terms",
    "/legal/community-guidelines",
    "/legal/defamation-policy",
  ];
  for (const width of [390, 768, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      const response = await page.goto(origin + route, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200, route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      if (overflow)
        console.log(
          await page.evaluate(() =>
            [...document.querySelectorAll("body *")]
              .filter((e) => e.getBoundingClientRect().right > innerWidth + 1)
              .slice(0, 12)
              .map((e) => ({
                tag: e.tagName,
                text: e.textContent.slice(0, 90),
                width: e.getBoundingClientRect().width,
                right: e.getBoundingClientRect().right,
                cls: e.className,
              })),
          ),
        );
      assert.equal(
        overflow,
        false,
        `Horizontal overflow at ${width}: ${route}`,
      );
    }
  }
  await page.goto(origin + "/council/hertfordshire");
  const missing = await page
    .locator('nav[aria-label="On this page"] a')
    .evaluateAll((links) =>
      links
        .filter((a) => !document.getElementById(a.hash.slice(1)))
        .map((a) => a.hash),
    );
  assert.deepEqual(missing, []);
  await page.setViewportSize({width:390,height:900});
  await page.getByRole('button',{name:'Open menu',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'Close menu',exact:true}).getAttribute('aria-expanded'),'true');
  await page.getByRole('button',{name:'Close menu',exact:true}).click();
  await page.goto(origin + "/write-review?council=barnet");
  await page
    .getByLabel("Review title", { exact: true })
    .fill("Road repair feedback");
  await page
    .getByLabel("Your experience", { exact: true })
    .fill("The repair crew completed the work promptly.");
  await page.getByRole("radio", { name: "4 stars", exact: true }).click();
  await page.getByRole('radio',{name:'4 stars',exact:true}).press('ArrowRight');
  assert.equal(await page.getByRole('radio',{name:'5 stars',exact:true}).getAttribute('aria-checked'),'true');
  await page.reload();
  await assert.equal(
    await page.getByLabel("Review title", { exact: true }).inputValue(),
    "Road repair feedback",
  );
  await page.evaluate(() =>
    localStorage.setItem(
      "rylc_review_draft_v1:barnet",
      JSON.stringify({
        rating: 4,
        serviceId: "",
        title: "Expired draft",
        body: "An expired draft that should not return.",
        expiresAt: 1,
      }),
    ),
  );
  await page.reload();
  assert.equal(
    await page.getByLabel("Review title", { exact: true }).inputValue(),
    "",
  );
  await page.goto(origin + "/search?postcode=EN118AA");
  assert.equal(
    await page.getByText("Westminster City Council", { exact: true }).count(),
    0,
  );
  assert.equal(
    await page
      .getByRole("link", { name: /Find your local council on GOV.UK/ })
      .count(),
    1,
  );
  await page.goto(origin + "/about");
  assert.equal(await page.getByText("48,000+", { exact: true }).count(), 0);
  assert.deepEqual(errors, [], "Browser runtime errors");
  const notice = page.getByRole('button',{name:'Got it',exact:true});
  if(await notice.count()) await notice.click();
  if (process.env.QA_SCREENSHOT_DIR) {
    await mkdir(process.env.QA_SCREENSHOT_DIR, { recursive: true });
    for (const width of [390, 1366]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [name, route] of [
        ["home", "/"],
        ["resources", "/council/hertfordshire"],
        ["review", "/write-review?council=barnet"],
      ]) {
        await page.goto(origin + route, { waitUntil: "networkidle" });
        await page.screenshot({
          path: path.join(
            process.env.QA_SCREENSHOT_DIR,
            `${name}-${width}.png`,
          ),
          fullPage: true,
        });
      }
    }
  }
  console.log(
    `PASS: ${routes.length} page states at 3 widths; guide anchors; draft recovery/expiry; postcode honesty; unsupported totals removed; no runtime errors.`,
  );
} finally {
  await browser.close();
  server.close();
}
