import { glob, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { useLoaderData, useSearchParams } from "react-router";
import { WritingCanvas } from "~/components/canvas";
import { FilePanel } from "~/components/file-panel";
import type { Route } from "./+types/home";

export function meta() {
	return [{ title: "Write" }];
}

export async function loader({ request }: Route.LoaderArgs) {
	const cwd = process.env.WRITE_CWD ?? process.cwd();
	const url = new URL(request.url);
	const openName = url.searchParams.get("open");

	const paths: string[] = [];
	for await (const f of glob("**/*.{md,mdx}", { cwd })) {
		paths.push(f);
	}
	paths.sort();

	const files = await Promise.all(
		paths.map(async (name) => {
			const raw = await readFile(join(cwd, name), "utf-8");
			const { data } = matter(raw);
			return { name, title: (data.title as string | undefined) ?? name };
		}),
	);

	let content: string | null = null;
	if (openName) {
		const raw = await readFile(join(cwd, openName), "utf-8");
		const parsed = matter(raw);
		content = parsed.content;
	}

	return { files, content };
}

export default function Home() {
	const { content } = useLoaderData<typeof loader>();
	const [searchParams] = useSearchParams();
	const openName = searchParams.get("open");

	return (
		<div className="flex h-screen">
			<div className="max-w-xs">
				<FilePanel />
			</div>

			<div className="grid grid-cols-8">
				<div className="col-start-2 col-span-5 h-full overflow-y-auto">
					<WritingCanvas
						key={openName ?? "empty"}
						initialMarkdown={content ?? undefined}
					/>
				</div>
			</div>
		</div>
	);
}
