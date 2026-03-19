import { $isCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_HIGH,
	KEY_ENTER_COMMAND,
} from "lexical";
import { useEffect } from "react";

export function ExitCodeBlockPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return editor.registerCommand(
			KEY_ENTER_COMMAND,
			(event) => {
				const selection = $getSelection();
				if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;

				const anchorNode = selection.anchor.getNode();
				const codeNode = anchorNode.getParent();

				if (!$isCodeNode(codeNode)) return false;
				if (!event?.ctrlKey && !event?.metaKey) return false;

				event.preventDefault();
				const paragraph = $createParagraphNode();
				codeNode.insertAfter(paragraph);
				paragraph.select();
				return true;
			},
			COMMAND_PRIORITY_HIGH,
		);
	}, [editor]);

	return null;
}
