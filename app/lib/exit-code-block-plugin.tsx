import { $isCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$createParagraphNode,
	$getSelection,
	$isElementNode,
	$isLineBreakNode,
	$isRangeSelection,
	COMMAND_PRIORITY_HIGH,
	KEY_ARROW_DOWN_COMMAND,
	KEY_ARROW_UP_COMMAND,
	KEY_ENTER_COMMAND,
	type LexicalNode,
	mergeRegister,
} from "lexical";
import { useEffect } from "react";

function isAtTopOfCode(anchorNode: LexicalNode): boolean {
	let node = anchorNode.getPreviousSibling();
	while (node !== null) {
		if ($isLineBreakNode(node)) return false;
		node = node.getPreviousSibling();
	}
	return true;
}

function isAtBottomOfCode(anchorNode: LexicalNode): boolean {
	let node = anchorNode.getNextSibling();
	while (node !== null) {
		if ($isLineBreakNode(node)) return false;
		node = node.getNextSibling();
	}
	return true;
}

export function ExitCodeBlockPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return mergeRegister(
			editor.registerCommand(
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
			),

			editor.registerCommand(
				KEY_ARROW_UP_COMMAND,
				(event) => {
					const selection = $getSelection();
					if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;
					if (event?.shiftKey || event?.altKey || event?.metaKey || event?.ctrlKey) return false;

					const anchorNode = selection.anchor.getNode();
					const codeNode = anchorNode.getParent();
					if (!$isCodeNode(codeNode)) return false;
					if (!isAtTopOfCode(anchorNode)) return false;

					event.preventDefault();
					const prevSibling = codeNode.getPreviousSibling();
					if ($isElementNode(prevSibling)) {
						prevSibling.selectEnd();
					} else {
						const paragraph = $createParagraphNode();
						codeNode.insertBefore(paragraph);
						paragraph.select();
					}
					return true;
				},
				COMMAND_PRIORITY_HIGH,
			),

			editor.registerCommand(
				KEY_ARROW_DOWN_COMMAND,
				(event) => {
					const selection = $getSelection();
					if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;
					if (event?.shiftKey || event?.altKey || event?.metaKey || event?.ctrlKey) return false;

					const anchorNode = selection.anchor.getNode();
					const codeNode = anchorNode.getParent();
					if (!$isCodeNode(codeNode)) return false;
					if (!isAtBottomOfCode(anchorNode)) return false;

					event.preventDefault();
					const nextSibling = codeNode.getNextSibling();
					if ($isElementNode(nextSibling)) {
						nextSibling.selectStart();
					} else {
						const paragraph = $createParagraphNode();
						codeNode.insertAfter(paragraph);
						paragraph.select();
					}
					return true;
				},
				COMMAND_PRIORITY_HIGH,
			),
		);
	}, [editor]);

	return null;
}
