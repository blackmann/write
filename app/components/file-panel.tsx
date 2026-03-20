import { Link, useLoaderData, useSearchParams } from "react-router";
import type { loader } from "~/routes/home";

export function FilePanel() {
	const { files } = useLoaderData<typeof loader>();
	const [searchParams] = useSearchParams();
	const openName = searchParams.get("open");

	return (
		<div className="h-full border-r border-stone-200 dark:border-neutral-800 overflow-y-auto flex flex-col">
			<div className="flex flex-col py-2">
				{files.map((file) => (
					<Link
						key={file.name}
						to={`?open=${encodeURIComponent(file.name)}`}
						className={[
							"px-4 py-2 text-sm truncate hover:bg-stone-100 dark:hover:bg-neutral-800",
							openName === file.name
								? "bg-stone-100 dark:bg-neutral-800 font-medium"
								: "text-stone-600 dark:text-neutral-400",
						].join(" ")}
					>
						{file.title}
					</Link>
				))}
			</div>
		</div>
	);
}
