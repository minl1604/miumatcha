import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs/promises";
const state = (page: Page) =>
  page.evaluate(() => (window as any).__MIU_DEBUG.getState());
const act = (page: Page, action: unknown) =>
  page.evaluate(
    (action) => (window as any).__MIU_DEBUG.dispatch(action),
    action,
  );
async function start(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Bắt đầu chăm tiệm" }).click();
  await expect(page.locator("canvas")).toHaveCount(1);
}
async function closePanel(page: Page) {
  await page
    .getByRole("button", { name: "Đóng bảng", exact: true })
    .last()
    .click();
}
async function makeFirst(page: Page) {
  await page
    .getByRole("button", { name: "Pha món này", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Thêm nguyên liệu vào ly" }).click();
  await page
    .getByRole("button", { name: "Pha nhanh · kỹ thuật 40/100" })
    .click();
  await expect(
    page.getByText("Điểm đồ uống /100", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Giao đúng đơn & thu tiền" }).click();
}
test("Chủ tiệm mới pha, giao, thu một lần, đóng ngày và tiếp tục sau tải trang", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await start(page);
  await page.getByRole("button", { name: "Mở cửa tiệm" }).click();
  await expect(
    page.getByRole("button", { name: "Pha món này" }).first(),
  ).toBeVisible();
  await makeFirst(page);
  let s = await state(page);
  expect(s.orders.filter((o: any) => o.paid).length).toBe(1);
  const sold = s.orders.find((o: any) => o.paid);
  const cash = s.cash;
  await act(page, { type: "SERVE", orderId: sold.id });
  s = await state(page);
  expect(s.cash).toBe(cash);
  expect(
    s.transactions.filter((t: any) => t.id === `sale:${sold.id}`),
  ).toHaveLength(1);
  await page.getByRole("button", { name: "Đóng cửa", exact: true }).click();
  if ((await state(page)).phase === "closing")
    await page.getByRole("button", { name: /Đóng sổ · bỏ/ }).click();
  s = await state(page);
  expect(s.phase).toBe("after");
  expect(s.reports).toHaveLength(1);
  expect(s.reports[0].endCash - s.reports[0].startCash).toBe(
    s.reports[0].cashFlow,
  );
  await page.getByRole("button", { name: "Thu chi", exact: true }).click();
  await expect(
    page.getByText("Đối soát lợi nhuận", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: `screenshots/report-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await closePanel(page);
  await page.getByRole("button", { name: "Ngày tiếp theo" }).click();
  await expect.poll(async () => (await state(page)).day).toBe(2);
  await expect
    .poll(async () =>
      page.evaluate(async () => {
        const source = "/src/persistence.ts";
        const p = await import(source);
        return (await p.loadGame())?.day;
      }),
    )
    .toBe(2);
  await page.reload();
  await page.waitForFunction(() => !!(window as any).__MIU_DEBUG);
  await expect.poll(async () => (await state(page)).day).toBe(2);
  await expect(
    page.getByRole("button", { name: "Tiếp tục chơi", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("Nhập hàng, đặt cây theo ô, xuất nhập bản lưu và giữ cài đặt", async ({
  page,
}, testInfo) => {
  await start(page);
  await page.getByRole("button", { name: "Kho & bánh", exact: true }).click();
  await page.getByLabel("Nhập Sữa tươi", { exact: true }).fill("100");
  const milkRow = page
    .locator("tr")
    .filter({ has: page.getByLabel("Nhập Sữa tươi", { exact: true }) });
  await milkRow.getByRole("button").click();
  let s = await state(page);
  expect(s.cash).toBe(846500);
  expect(s.deliveries).toHaveLength(1);
  await act(page, { type: "STEP", seconds: 30 });
  s = await state(page);
  expect(s.deliveries[0].status).toBe("arrived");
  expect(
    s.inventory
      .filter((b: any) => b.ingredient === "milk")
      .reduce((a: number, b: any) => a + b.quantity, 0),
  ).toBe(2300);
  await closePanel(page);
  await page.getByRole("button", { name: "Trang trí", exact: true }).click();
  await page.getByRole("button", { name: "Mua nội thất", exact: true }).click();
  await page
    .locator(".panel")
    .filter({
      has: page.getByRole("heading", { name: "Cây xanh an toàn", exact: true }),
    })
    .getByRole("button", { name: "Mua & chọn vị trí" })
    .click();
  await page.getByRole("button", { name: "Ô 0,4", exact: true }).click();
  s = await state(page);
  expect(
    s.furniture.some((f: any) => f.kind === "plant" && f.x === 0 && f.y === 4),
  ).toBe(true);
  await closePanel(page);
  await page.getByRole("button", { name: "Cài đặt", exact: true }).click();
  await page.getByLabel("Giảm chuyển động", { exact: true }).check();
  await page
    .getByLabel("Có tình huống thất thoát / trộm cắp", { exact: true })
    .uncheck();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Xuất JSON", exact: true }).click();
  const download = await downloadPromise;
  const filepath = await download.path();
  expect(filepath).toBeTruthy();
  const exported = await fs.readFile(filepath!, "utf8");
  expect(JSON.parse(exported).format).toBe("miu-matcha");
  await page.getByRole("button", { name: "Chơi mới", exact: true }).click();
  await page.getByRole("button", { name: "Xác nhận thay bản lưu" }).click();
  expect((await state(page)).cash).toBe(850000);
  expect((await state(page)).settings.reducedMotion).toBe(true);
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "miu.json",
      mimeType: "application/json",
      buffer: Buffer.from(exported),
    });
  await page.getByRole("button", { name: "Xác nhận thay bản lưu" }).click();
  expect(
    (await state(page)).furniture.some(
      (f: any) => f.kind === "plant" && f.x === 0,
    ),
  ).toBe(true);
  await closePanel(page);
  await expect
    .poll(async () =>
      page.evaluate(async () => {
        const source = "/src/persistence.ts";
        const p = await import(source);
        return (await p.loadGame())?.cash;
      }),
    )
    .toBe(806500);
  await page.reload();
  await page.waitForFunction(() => !!(window as any).__MIU_DEBUG);
  expect((await state(page)).cash).toBe(806500);
  expect((await state(page)).settings.theft).toBe(false);
  await page.screenshot({
    path: `screenshots/decor-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
test("Tạo công thức riêng, chặn ô cửa và phản ứng mèo có khoảng nghỉ", async ({
  page,
}) => {
  await start(page);
  await page.getByRole("button", { name: "Thực đơn", exact: true }).click();
  await page
    .getByRole("button", { name: "Tạo công thức", exact: true })
    .click();
  await page.getByLabel("Tên món", { exact: true }).fill("Mây trà của Linh");
  await page.getByRole("button", { name: "Lưu vào sổ công thức" }).click();
  expect(
    (await state(page)).recipes.some((r: any) => r.name === "Mây trà của Linh"),
  ).toBe(true);
  await closePanel(page);
  await page.locator(".cat-card").filter({ hasText: "Matcha" }).click();
  await page.getByRole("button", { name: "Gãi cằm", exact: true }).click();
  let s = await state(page);
  const trust = s.cats[0].trust;
  expect(s.cats[0].expression).toContain("rừ rừ");
  await page.getByRole("button", { name: "Gãi cằm", exact: true }).click();
  s = await state(page);
  expect(s.cats[0].trust).toBe(trust);
  expect(s.cats[0].expression).toContain("cần nghỉ");
  await closePanel(page);
  await page.getByRole("button", { name: "Trang trí", exact: true }).click();
  await page.getByLabel("Chọn nội thất").selectOption("initial-table-1");
  await page.getByRole("button", { name: "Ô 7,10", exact: true }).click();
  expect(
    (await state(page)).furniture.find((f: any) => f.id === "initial-table-1")
      .x,
  ).toBe(3);
});
