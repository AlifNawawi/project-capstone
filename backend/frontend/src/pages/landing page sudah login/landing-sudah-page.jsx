import { useEffect, useState } from 'react';
import LandingSudahView from './landing-sudah-view';
import LandingSudahPresenter from './landing-sudah-presenter';

export default function LandingSudahPage() {
  const [content, setContent] = useState({
    user: null,
    moodData: [],
    testimonials: [],
  });

  useEffect(() => {
    const presenter = new LandingSudahPresenter({
      renderContent: (data) => {
        setContent(data);
      },
    });

    // Load initial content
    presenter.loadContent();

    // Set up real-time listener untuk testimoni
    const unsubscribeTestimonials = presenter.setupTestimonialListener(
      (testimonials) => {
        setContent((prev) => ({
          ...prev,
          testimonials,
        }));
      },
    );

    // Cleanup listener when component unmounts
    return () => {
      if (unsubscribeTestimonials) {
        unsubscribeTestimonials();
      }
    };
  }, []);

  return (
    <LandingSudahView
      {...content}
      onRefreshTestimonials={() => {
        const presenter = new LandingSudahPresenter({
          renderContent: (data) => {
            setContent(data);
          },
        });
        presenter.refreshTestimonials();
      }}
    />
  );
}
