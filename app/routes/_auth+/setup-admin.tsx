import { conform, useForm } from '@conform-to/react';
import { getFieldsetConstraint, parse } from '@conform-to/zod';
import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useFetcher, useNavigation } from '@remix-run/react';
import { safeRedirect } from 'remix-utils';
import { createPassword } from 'tests/db-utils.ts';
import { z } from 'zod';
import { ErrorList, Field } from '~/components/forms.tsx';
import { Button } from '~/components/ui/button.tsx';
import { authenticator, getPasswordHash, signup } from '~/utils/auth.server.ts';
import { prisma } from '~/utils/db.server.ts';
import { commitSession, getSession } from '~/utils/session.server.ts';

export const loader = async ({}: DataFunctionArgs) => {
	const hasUsers = await prisma.user.count();
	if (hasUsers) {
		return redirect('/cms/dashboard');
	}

	return json({});
};

const AdminUserSchema = z.object({
	name: z.string().nullable(),
	email: z.string().email(),
	username: z.string().min(3).max(32),
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
});

export const action = async ({ request }: DataFunctionArgs) => {
	// ignore POST request if there are already users
	const hasUsers = await prisma.user.count();
	if (hasUsers) {
		return json({});
	}

	const formData = await request.formData();
	const submission = parse(formData, {
		schema: AdminUserSchema,
		acceptMultipleErrors: () => true,
	});

	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const);
	}

	if (!submission.value) {
		return json(
			{
				status: 'error',
				submission,
			} as const,
			{ status: 400 },
		);
	}

	const { name, email, username, password } = submission.value;

	console.log({ name, email, username, password });

	try {
		const adminRole = await prisma.role.create({
			data: {
				name: 'admin',
				permissions: {
					create: { name: 'admin' },
				},
			},
		});

		const session = await signup({
			email,
			username,
			password,
			name,
			roles: [adminRole.id],
		});

		const cookieSession = await getSession(request.headers.get('cookie'));
		cookieSession.set(authenticator.sessionKey, session.id);

		const newCookie = await commitSession(cookieSession, {
			expires: session.expirationDate,
		});

		return redirect('/cms/dashboard', {
			headers: { 'Set-Cookie': newCookie },
		});
	} catch (err) {
		console.error(err);
		return json({ error: 'Unable to create admin user' }, { status: 400 });
	}
};

export default function SetupAdminUser() {
	const adminUserForm = useFetcher();
	const [form, fields] = useForm({
		id: 'setup-admin',
		constraint: getFieldsetConstraint(AdminUserSchema),
		lastSubmission: adminUserForm.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: AdminUserSchema });
		},
		shouldRevalidate: 'onBlur',
	});

	return (
		<div>
			<div className="mx-auto w-full max-w-md px-8"></div>
			<adminUserForm.Form method="post" {...form.props}>
				<Field
					labelProps={{ children: 'Name' }}
					inputProps={{
						...conform.input(fields.name),
						autoComplete: 'name',
					}}
					errors={fields.name.errors}
				/>
				<Field
					labelProps={{ children: 'Username' }}
					inputProps={{
						...conform.input(fields.username),
						autoComplete: 'username',
					}}
					errors={fields.username.errors}
				/>
				<Field
					labelProps={{ children: 'Email' }}
					inputProps={{
						...conform.input(fields.email),
						type: 'email',
						autoComplete: 'email',
					}}
					errors={fields.email.errors}
				/>
				<Field
					labelProps={{ children: 'Password' }}
					inputProps={{
						...conform.input(fields.password),
						type: 'password',
						autoComplete: 'password',
					}}
					errors={fields.password.errors}
				/>
				<Field
					labelProps={{ children: 'Confirm Password' }}
					inputProps={{
						...conform.input(fields.confirmPassword),
						type: 'password',
						autoComplete: 'confirmPassword',
					}}
					errors={fields.confirmPassword.errors}
				/>
				<ErrorList errors={form.errors} id={form.errorId} />
				<Button type="submit">Create Admin User</Button>
			</adminUserForm.Form>
		</div>
	);
}
