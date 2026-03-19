import { WritingCanvas } from "~/components/canvas";

export function meta() {
	return [
		{ title: "Write" }
	];
}

export default function Home() {
	return <div className="grid grid-cols-8 h-screen">
		<div className="col-span-4 col-start-3 h-full overflow-y-auto">
			<WritingCanvas />
		</div>
	</div>;
}
