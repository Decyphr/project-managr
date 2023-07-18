import { RouteTitle } from '~/components/cms/route-title.tsx';
import { CollectionEditor } from '~/routes/resources+/collection-editor.tsx';

export default function CreateDataModel() {
	return (
		<div>
			<RouteTitle title="New Data Model" />
			<CollectionEditor />
		</div>
	);
}
