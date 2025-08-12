import { test } from '@playwright/test';
import { LoginPage } from '../orangeHRMPages/loginPage.js';
import { AdminPage } from '../orangeHRMPages/adminPage.js';
import { AddUserPage } from '../orangeHRMPages/addUserPage.js';

test.describe('Admin - Add User Flow', () => {
    test('Should add a new user and verify in the list', async ({ page }) => {
        
        const loginPage = new LoginPage(page);
        const adminPage = new AdminPage(page);
        const addUserPage = new AddUserPage(page);

        const testData = {
            role: 'Admin',
            empName: 'Virat  Kohli',
            status: 'Enabled',
            username: "OneFiveooe",
            password: 'Test@1234'
        };

        
        await loginPage.goto();
        await loginPage.login('Admin', 'admin123');

        
        await adminPage.navigateToAdminPage();

        
        await addUserPage.addUser(testData);

        
        await adminPage.isUsernameInPage(testData.username);
    });
});
