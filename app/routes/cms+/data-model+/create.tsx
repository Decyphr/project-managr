import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { z } from 'zod';
import { RouteTitle } from '~/components/cms/route-title.tsx';
import { Button } from '~/components/ui/button.tsx';
import { Input } from '~/components/ui/input.tsx';
import { Label } from '~/components/ui/label.tsx';
import { CollectionEditor } from '~/routes/resources+/collection-editor.tsx';
import { requireUserId } from '~/utils/auth.server.ts';
import { prisma } from '~/utils/db.server.ts';
import { toCamelCase } from '~/utils/misc.ts';

export const loader = async ({}: DataFunctionArgs) => {
	return json({});
};

export const CollectionCreateSchema = z.object({
	title: z.string().min(1),
	description: z.string().nullable(),
});

export const action = async ({ request }: DataFunctionArgs) => {
	const userId = await requireUserId(request);
	const formData = await request.formData();

	/* const submission = parse(formData, {
		schema: CollectionCreateSchema,
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
	} */

	const title = formData.get('title');
	const description = formData.get('description');

	if (!title || typeof title !== 'string' || title.length < 1) {
		return json({ status: 'error', message: 'Invalid title' }, { status: 400 });
	}

	if (!description || typeof description !== 'string') {
		return json({ status: 'error', message: 'Invalid title' }, { status: 400 });
	}

	const handle = toCamelCase(title);

	try {
		const collection = await prisma.collection.create({
			data: {
				title,
				description,
				handle,
			},
		});

		return redirect('/cms/data-model');
	} catch (err) {
		console.log(err);
		return json(
			{ status: 'error', message: 'Something went wrong' },
			{ status: 500 },
		);
	}
};

export default function CreateDataModel() {
	return (
		<div>
			<RouteTitle title="New Data Model" />
			<CollectionEditor />
		</div>
	);
}
