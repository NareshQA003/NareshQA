import { expect } from '@playwright/test';

export class AdminPage {

    constructor(page) {
        this.page = page;
        this.admin = page.locator("//span[text()='Admin']");
        this.add = page.locator("//button[normalize-space()='Add']");
        this.userNamesCell = page.locator("//div[@class='oxd-table-card']/div/div[2]/div");

    }

    async navigateToAdminPage() {
        await this.admin.click();
        await this.add.click();
    }

    async isUsernameInPage(username) {
         await this.page.waitForFunction(
        (expected, selector) => {
            const elements = Array.from(document.querySelectorAll(selector));
            return elements.some(el => el.textContent.includes(expected));
        },
        username,
        `//div[@class='oxd-table-card']/div/div[2]/div[text()='${username}']` // <-- replace with the correct selector for your username column
    );

        const usernames = await this.userNamesCell.allTextContents();
        console.log(usernames)
        const isPresent = usernames.some(u => u.includes(username));
        console.log(isPresent)
        // Assertion inside the same function
        expect(isPresent, `Username "${username}" not found in the current page`).toBeTruthy();
    }



}