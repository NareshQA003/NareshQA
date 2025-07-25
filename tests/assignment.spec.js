import { test, expect } from '@playwright/test';
import { parseISO, differenceInDays } from 'date-fns';

test('Extract patent dates and compute differences', async ({ page }) => {
    const searchTerm = process.env.SEARCH_KEY || 'paracetamol';

    // Navigate to the app
    await page.goto("https://patinformed.wipo.int/", { waitUntil: "domcontentloaded" });

    // Perform search
    const searchInput = page.locator("//input[contains(@placeholder,'Search pharmaceutical')]");
    await searchInput.fill(searchTerm);
    await searchInput.press("Enter");

    // Handle disclaimer
    const modal = page.locator("#modalsHomepage");
    await modal.waitFor({ timeout: 5000 });

    const button = modal.locator("button:has-text('I have read and agree to the terms')");
    await button.click({ force: true });
    console.log("Accepted the disclaimer and proceeded to search results.");

    // Waits for results table
    const resultsTable = page.locator("table.results");
    await resultsTable.waitFor({ timeout: 10000 }).catch(() => {});

    // Check if results are available
    const resultRows = resultsTable.locator("tbody tr");
    const rowCount = await resultRows.count();

    if (rowCount === 0) {
        console.log(`No results found for "${searchTerm}". Please try a different keyword.`);
        return; // Exit the test
    }

    console.log(`Found ${rowCount} result(s) for "${searchTerm}". Opening the first result...`);
    await resultRows.first().click();
 
    // Wait for details to load
    const detailSections = page.locator(".patentDetails.noBorder");
    await detailSections.first().waitFor({ timeout: 10000 });

    let filingDateStr, publicationDateStr, grantDateStr;

    const sections = await detailSections.all();

    for (const section of sections) {
        const content = await section.innerText();

        if (!filingDateStr) {
            const match = content.match(/Filing date\s+(\d{4}-\d{2}-\d{2})/i);
            if (match) filingDateStr = match[1];
        }

        if (!publicationDateStr) {
            const match = content.match(/Publication date\s+(\d{4}-\d{2}-\d{2})/i);
            if (match) publicationDateStr = match[1];
        }

        if (!grantDateStr) {
            const match = content.match(/Grant date\s+(\d{4}-\d{2}-\d{2})/i);
            if (match) grantDateStr = match[1];
        }

        if (filingDateStr && publicationDateStr && grantDateStr) {
            break; // Stops if all dates are found
        }
    }

    // Display extracted dates
    console.log("\nExtracted Dates:");
    console.log(`Publication date: ${publicationDateStr || 'Not found'}`);
    console.log(`Grant date: ${grantDateStr || 'Not found'}`);
    console.log(`Filing date: ${filingDateStr || 'Not found'}`);

    const filingDate = filingDateStr ? parseISO(filingDateStr) : null;
    const publicationDate = publicationDateStr ? parseISO(publicationDateStr) : null;
    const grantDate = grantDateStr ? parseISO(grantDateStr) : null;

    console.log("\nDate Differences:");
    if (publicationDate && grantDate) {
        console.log(`Difference between Publication and Grant date: ${Math.abs(differenceInDays(publicationDate, grantDate))} days`);
    }
    if (publicationDate && filingDate) {
        console.log(`Difference between Publication and Filing date: ${Math.abs(differenceInDays(publicationDate, filingDate))} days`);
    }
    if (grantDate && filingDate) {
        console.log(`Difference between Grant and Filing date: ${Math.abs(differenceInDays(grantDate, filingDate))} days`);
    }

    // Ensure at least any one date is available
    expect([filingDateStr, publicationDateStr, grantDateStr].some(Boolean)).toBeTruthy();
});
