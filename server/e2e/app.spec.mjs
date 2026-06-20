import {test, expect} from "@playwright/test";

test("login → dashboard → theme + language switch", async ({page}) => {
    await page.goto("/");

    // login form is shown when unauthenticated
    await expect(page.locator(".login")).toBeVisible();
    await page.locator(".login input[type=text]").fill("admin");
    await page.locator(".login input[type=password]").fill("admin");
    await page.locator(".login button").click();

    // authenticated → tab navigation renders
    const nav = page.locator(".tab-navigation");
    await expect(nav).toBeVisible();
    await expect(nav).toContainText("Server");

    // theme toggle flips the <html data-theme> attribute
    const html = page.locator("html");
    const before = (await html.getAttribute("data-theme")) || "light";
    await page.locator(".controls-theme").click();
    const after = before === "dark" ? "light" : "dark";
    await expect(html).toHaveAttribute("data-theme", after);

    // language switch to Ukrainian reloads the page (session persists) and
    // the nav labels become Ukrainian
    await page.locator("select.controls-lang").selectOption("uk");
    await expect(page.locator(".tab-navigation")).toContainText("Користувачі");
});

test("navigating to Monitoring and Recordings works", async ({page}) => {
    await page.goto("/");
    await page.locator(".login input[type=text]").fill("admin");
    await page.locator(".login input[type=password]").fill("admin");
    await page.locator(".login button").click();
    await expect(page.locator(".tab-navigation")).toBeVisible();

    // Monitoring tab
    await page.locator(".tab-navigation button", {hasText: "Monitoring"}).click();
    await expect(page.locator(".tab.monitoring")).toBeVisible();

    // Recordings tab
    await page.locator(".tab-navigation button", {hasText: "Recordings"}).click();
    await expect(page.locator(".tab.recordings")).toBeVisible();
});
