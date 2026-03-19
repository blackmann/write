import { $isCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useEffect, useRef } from "react";

const HIGHLIGHT_CLASS = "editor-block-focused";

export function ActiveBlockHighlightPlugin() {
	const [editor] = useLexicalComposerContext();
	const prevKeyRef = useRef<string | null>(null);

	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			// Remove highlight from previous block
			if (prevKeyRef.current) {
				editor.getElementByKey(prevKeyRef.current)?.classList.remove(HIGHLIGHT_CLASS);
				prevKeyRef.current = null;
			}

			editorState.read(() => {
				const selection = $getSelection();
				if (!$isRangeSelection(selection)) return;

				const anchorNode = selection.anchor.getNode();
				const topBlock = anchorNode.getTopLevelElement();
				if (!topBlock || $isCodeNode(topBlock)) return;

				prevKeyRef.current = topBlock.getKey();
			});

			if (prevKeyRef.current) {
				editor.getElementByKey(prevKeyRef.current)?.classList.add(HIGHLIGHT_CLASS);
			}
		});
	}, [editor]);

	return null;
}
