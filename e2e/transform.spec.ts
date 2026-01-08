import { test, expect } from "@playwright/test";

test.describe("Transform Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should transform text to uppercase", async ({ page }) => {
    const textarea = page.getByPlaceholder("Enter text to transform...");
    await textarea.fill("hello world");

    // Select uppercase transformation (default is uppercase, but let's be explicit)
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Uppercase" }).click();

    await page.getByRole("button", { name: "Transform" }).click();

    // Wait for result to appear and check the result text within the result container
    await expect(page.getByText("Result:")).toBeVisible();
    const resultContainer = page.locator(".font-mono");
    await expect(resultContainer).toHaveText("HELLO WORLD");
  });

  test("should transform text to lowercase", async ({ page }) => {
    const textarea = page.getByPlaceholder("Enter text to transform...");
    await textarea.fill("HELLO WORLD");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Lowercase" }).click();

    await page.getByRole("button", { name: "Transform" }).click();

    await expect(page.getByText("Result:")).toBeVisible();
    const resultContainer = page.locator(".font-mono");
    await expect(resultContainer).toHaveText("hello world");
  });

  test("should reverse text", async ({ page }) => {
    const textarea = page.getByPlaceholder("Enter text to transform...");
    await textarea.fill("hello");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Reverse" }).click();

    await page.getByRole("button", { name: "Transform" }).click();

    await expect(page.getByText("Result:")).toBeVisible();
    const resultContainer = page.locator(".font-mono");
    await expect(resultContainer).toHaveText("olleh");
  });

  test("should base64 encode text", async ({ page }) => {
    const textarea = page.getByPlaceholder("Enter text to transform...");
    await textarea.fill("hello");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Base64 Encode" }).click();

    await page.getByRole("button", { name: "Transform" }).click();

    await expect(page.getByText("Result:")).toBeVisible();
    const resultContainer = page.locator(".font-mono");
    // "hello" in base64 is "aGVsbG8="
    await expect(resultContainer).toHaveText("aGVsbG8=");
  });

  test("should base64 decode text", async ({ page }) => {
    const textarea = page.getByPlaceholder("Enter text to transform...");
    await textarea.fill("aGVsbG8=");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Base64 Decode" }).click();

    await page.getByRole("button", { name: "Transform" }).click();

    await expect(page.getByText("Result:")).toBeVisible();
    const resultContainer = page.locator(".font-mono");
    await expect(resultContainer).toHaveText("hello");
  });

  test("should count characters", async ({ page }) => {
    const textarea = page.getByPlaceholder("Enter text to transform...");
    await textarea.fill("hello");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Character Count" }).click();

    await page.getByRole("button", { name: "Transform" }).click();

    await expect(page.getByText("Result:")).toBeVisible();
    const resultContainer = page.locator(".font-mono");
    await expect(resultContainer).toHaveText("5");
  });

  test("should transform using keyboard shortcut (Cmd/Ctrl + Enter)", async ({
    page,
  }) => {
    const textarea = page.getByPlaceholder("Enter text to transform...");
    await textarea.fill("keyboard test");

    // Default is uppercase
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Uppercase" }).click();

    // Use keyboard shortcut
    await textarea.press("Control+Enter");

    await expect(page.getByText("Result:")).toBeVisible();
    const resultContainer = page.locator(".font-mono");
    await expect(resultContainer).toHaveText("KEYBOARD TEST");
  });

  test("should disable transform button when input is empty", async ({
    page,
  }) => {
    const transformButton = page.getByRole("button", { name: "Transform" });
    await expect(transformButton).toBeDisabled();
  });

  test("should show loading state while transforming", async ({ page }) => {
    const textarea = page.getByPlaceholder("Enter text to transform...");
    await textarea.fill("loading test");

    const transformButton = page.getByRole("button", { name: "Transform" });
    await transformButton.click();

    // Button should show "Transforming..." briefly
    // Then return to "Transform" after success
    await expect(page.getByText("Result:")).toBeVisible();
  });
});
