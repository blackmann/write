import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { ActiveBlockHighlightPlugin } from "~/lib/active-block-highlight-plugin";
import { CodeHighlightPlugin } from "~/lib/code-highlight-plugin";
import { ExitCodeBlockPlugin } from "~/lib/exit-code-block-plugin";

function InitialContentPlugin({ markdown }: { markdown: string }) {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		editor.update(() => {
			$convertFromMarkdownString(markdown, TRANSFORMERS);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return null;
}

const editorConfig = {
	namespace: "WritingCanvas",
	nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, CodeNode, CodeHighlightNode],
	onError(error: Error) {
		throw error;
	},
	theme: {
		root: "editor-root",
		paragraph: "editor-paragraph",
		heading: { h1: "editor-h1", h2: "editor-h2", h3: "editor-h3" },
		quote: "editor-quote",
		list: { ul: "editor-ul", ol: "editor-ol", listitem: "editor-listitem" },
		link: "editor-link",
		code: "editor-code",
		text: { bold: "editor-bold", italic: "editor-italic", code: "editor-text-code" },
	},
};

export function WritingCanvas({ initialMarkdown }: { initialMarkdown?: string }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return <div className="min-h-full py-16 px-4" aria-hidden />;

	return (
		<LexicalComposer initialConfig={editorConfig}>
			<div className="relative min-h-full py-16 px-4">
				<RichTextPlugin
					contentEditable={
						<ContentEditable
							className="editor-content-editable outline-none"
							aria-label="Writing canvas"
						/>
					}
					placeholder={
						<div className="editor-placeholder mt-1">Start writing...</div>
					}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<HistoryPlugin />
				<AutoFocusPlugin />
				<ListPlugin />
				<LinkPlugin />
				<CodeHighlightPlugin />
				<ExitCodeBlockPlugin />
				<ActiveBlockHighlightPlugin />
				<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
				{initialMarkdown && <InitialContentPlugin markdown={initialMarkdown} />}
			</div>
		</LexicalComposer>
	);
}
