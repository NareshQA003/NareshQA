import { expect } from '@playwright/test';

export class AddUserPage {

    constructor(page) {
        this.page = page;
        this.userRole = page.locator("//label[text()='User Role']//parent::div//following-sibling::div//descendant::div[contains(text(),'Select')]")
        this.empName = page.locator("//label[text()='Employee Name']//parent::div//following-sibling::div//descendant::input");
        this.status = page.locator("//label[text()='Status']//parent::div//following-sibling::div//descendant::div[contains(text(),'Select')]")
        this.userName = page.locator("//label[text()='Username']//parent::div//following-sibling::div//descendant::input")
        this.password = page.locator("//label[text()='Password']//parent::div//following-sibling::div//descendant::input")
        this.confirmPassword = page.locator("//label[text()='Confirm Password']//parent::div//following-sibling::div//descendant::input")   
        this.save = page.locator("//button[normalize-space()='Save']")
    }

    async selectUserRole(role) {
        await this.page.waitForTimeout(1000);
        await this.userRole.click();
        await this.page.locator(`//div[@class='oxd-select-option']/span[text()='${role}']`).click();
    }

    async enterEmployeeName(name) {
        await this.empName.fill(name);
        // If auto-suggestion appears, select it
        await this.page.locator(`//span[text()='${name}']`).click({ timeout: 3000 }).catch(() => {});
    }

    async selectStatus(st) {
        await this.status.click();
        await this.page.locator(`//div[@class='oxd-select-option']/span[text()='${st}']`).click();
    }

    async enterUsername(uName) {
        await this.userName.fill(uName);
    }

    async enterPassword(pwd) {
        await this.password.fill(pwd);
    }

    async enterConfirmPassword(pwd) {
        await this.confirmPassword.fill(pwd);
    }

    async clickSave() {
        await this.save.click();
    }

     async addUser({ role, empName, status, username, password }) {
        await this.selectUserRole(role);
        await this.enterEmployeeName(empName);
        await this.selectStatus(status);
        await this.enterPassword(password);
        await this.enterConfirmPassword(password);
        await this.enterUsername(username);
        await this.clickSave();
    }

}