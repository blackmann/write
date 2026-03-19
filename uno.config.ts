import presetIcons from "@unocss/preset-icons";
import {
	defineConfig,
	presetWind4,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

export default defineConfig({
	presets: [presetWind4(), presetIcons()],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
