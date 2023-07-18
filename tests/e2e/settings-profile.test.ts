import { expect, test } from '../playwright-utils.ts';
// import { createUser } from '../../tests/db-utils.ts';

test('Users can login and view dashboard', async ({ login, page }) => {
	await login();
	await page.goto('/cms/dashboard');

	await expect(page).toHaveURL('/cms/dashboard');
});

/* test('Users can update their basic info', async ({ login, page }) => {
	await login();
	await page.goto('/cms/users/profile');

	const newUserData = createUser();

	await page.getByRole('textbox', { name: /^name/i }).fill(newUserData.name);
	await page
		.getByRole('textbox', { name: /^username/i })
		.fill(newUserData.username);
	// TODO: support changing the email... probably test this in another test though
	// await page.getByRole('textbox', {name: /^email/i}).fill(newUserData.email)

	await page.getByRole('button', { name: /^save/i }).click();

	await expect(page).toHaveURL(`/cms/users/${newUserData.username}`);
}); */
