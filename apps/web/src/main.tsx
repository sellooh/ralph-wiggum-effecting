import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
	return <div>Echo Lab</div>;
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
