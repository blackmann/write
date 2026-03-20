import { $isCodeNode } from "@lexical/code";
import { registerCodeHighlighting, ShikiTokenizer } from "@lexical/code-shiki";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect } from "react";

export function CodeHighlightPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const getTheme = () => (mq.matches ? "one-dark-pro" : "snazzy-light");

		const cleanup = registerCodeHighlighting(editor, {
			...ShikiTokenizer,
			defaultTheme: getTheme(),
		});

		const handleChange = () => {
			const theme = getTheme();
			editor.update(() => {
				$getRoot()
					.getChildren()
					.forEach((node) => {
						if ($isCodeNode(node)) node.setTheme(theme);
					});
			});
		};

		mq.addEventListener("change", handleChange);
		return () => {
			cleanup();
			mq.removeEventListener("change", handleChange);
		};
	}, [editor]);

	return null;
}
