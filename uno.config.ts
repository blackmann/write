import presetIcons from "@unocss/preset-icons";
import {
	defineConfig,
	presetWind4,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

export default defineConfig({
	presets: [presetWind4({ dark: "media" }), presetIcons()],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
