
import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const resumeDownloadDirectory = path.join(process.cwd(), 'downloads');
const updateDate = new Date();
const dateTag = `${updateDate.getDate()}${new Intl.DateTimeFormat('en-US', {
  month: 'short'
}).format(updateDate)}`;
let renamedResumeName: string | undefined;
let renamedResumePath: string | undefined;

test('Naukri login, refresh resume, and update resume headline', async ({ page }) => {
  await test.step('Open Naukri homepage', async () => {
    await page.goto('https://www.naukri.com/');
  });

  await test.step('Dismiss homepage popup if present', async () => {
    const closeButton = page.getByRole('button', { name: 'Close' });
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }
  });

  await test.step('Open login form', async () => {
    await page.getByRole('link', { name: 'Login' }).click();
  });

  await test.step('Enter account username', async () => {
    await page.getByRole('textbox', { name: 'Email ID / Username' })
      .fill(process.env.NAUKRI_USERNAME || '');
  });

  await test.step('Enter account password', async () => {
    await page.getByRole('textbox', { name: 'Password' })
      .fill(process.env.NAUKRI_PASSWORD || '');
  });

  await test.step('Submit login form', async () => {
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.waitForLoadState('domcontentloaded');
  });

  await test.step('Dismiss post-login popup if present', async () => {
    const popupClose = page.locator('.crossIcon');
    if (await popupClose.isVisible().catch(() => false)) {
      await popupClose.click();
    }
  });

  await test.step('Open profile', async () => {
    await page.getByRole('link', { name: 'View profile' }).click();

    await page.getByRole('button', { name: 'Resume', exact: true })
      .waitFor({ state: 'visible' });

    const profileNameElement = page.locator('.fullname');
    await expect(profileNameElement).toHaveText(/\S+/, { timeout: 15000 });
    const profileName = (await profileNameElement.innerText()).trim();
    const safeProfileName = profileName
      .replace(/[<>:"|?*\x00-\x1F]/g, '_')
      .replace(/[\/\\]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');

    if (!safeProfileName) {
      throw new Error('Could not read the profile name for the resume filename.');
    }

    renamedResumeName = `${safeProfileName}_${dateTag}.pdf`;
    renamedResumePath = path.join(resumeDownloadDirectory, renamedResumeName);
  });

  await test.step('Open resume section', async () => {
    await page.getByRole('button', { name: 'Resume', exact: true }).click();
  });

  await test.step('Download and rename the current resume', async () => {
    if (!renamedResumePath) {
      throw new Error('The dated resume filename was not initialized.');
    }

    await mkdir(resumeDownloadDirectory, { recursive: true });

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download resume' }).click();
    const download = await downloadPromise;
    await download.saveAs(renamedResumePath);
  });

  await test.step('Upload the renamed resume', async () => {
    if (!renamedResumeName || !renamedResumePath) {
      throw new Error('The dated resume filename was not initialized.');
    }

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Update resume' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(renamedResumePath);

    await expect(page.getByText('Resume has been successfully uploaded.', { exact: true }))
      .toBeVisible({ timeout: 30000 });
    await expect(page.getByTitle(renamedResumeName))
      .toBeVisible({ timeout: 30000 });
  });

  await test.step('Open resume headline editor', async () => {
    await page.getByRole('button', { name: 'Edit resume headline' }).click();
  });

  const headline = page.getByRole('textbox', { name: 'Resume headline' });

  await test.step('Enter updated resume headline', async () => {
    await headline.fill(
      'Java Developer | 3.5 Years Experience | Core Java | Java 8/17 | Spring Boot | Microservices | REST APIs | Hibernate | SQL'
    );
  });

  await test.step('Save resume headline', async () => {
    await page.getByRole('button', { name: 'Save' }).click();
  });

  await test.step('Verify updated headline is visible', async () => {
    await expect(page.locator('#lazyResumeHead')).toContainText(
      'Java Developer',
      { timeout: 10000 }
    );
    await expect(page.locator('#lazyResumeHead')).toContainText('Spring Boot');
  });

  await test.step('Dismiss update confirmation if present', async () => {
    const closeSuccessPopup = page.getByRole('button', { name: 'Close' });
    if (await closeSuccessPopup.isVisible().catch(() => false)) {
      await closeSuccessPopup.click();
    }
  });

  await test.step('Open profile menu', async () => {
    await page.getByRole('button', { name: 'Open profile menu' }).click();
  });

  await test.step('Log out', async () => {
    await page.getByRole('button', { name: 'Logout' }).click();
  });
});
