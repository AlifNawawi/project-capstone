import { useEffect } from "react";
import LandingView from "./landing-view";
import LandingPresenter from "./landing-presenter";

export default function LandingPage() {
  useEffect(() => {
    const presenter = new LandingPresenter({
      renderContent: () => {
        // Belum ada data yang perlu di-pass ke view karena view pakai teks statis
      },
    });

    presenter.loadContent();
  }, []);

  return <LandingView />;
}
