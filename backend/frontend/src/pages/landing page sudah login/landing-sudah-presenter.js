import LandingSudahModel from "./landing-sudah-model";

export default class LandingSudahPresenter {
  constructor(view) {
    this.view = view;
    this.model = new LandingSudahModel();
    this.currentData = { user: null, moodData: [], testimonials: [] };
  }

  async loadContent() {
    const user = JSON.parse(localStorage.getItem('user'));
    let userData = user;
    let moodData = [];
    let testimonials = [];

    if (user && user.uid) {
      const userResult = await this.model.fetchUserData(user.uid);
      if (userResult.success) {
        userData = userResult.user;
        localStorage.setItem('user', JSON.stringify(userData));
      }

      moodData = await this.model.fetchMoodData();
      testimonials = await this.model.fetchTestimonials();
    }

    this.currentData = { user: userData, moodData, testimonials };
    this.view.renderContent({
      ...this.currentData,
      onRefreshTestimonials: () => this.refreshTestimonials(),
    });
  }

  async refreshTestimonials() {
    try {
      const testimonials = await this.model.fetchTestimonials();
      this.currentData.testimonials = testimonials;
      this.view.renderContent({
        ...this.currentData,
        onRefreshTestimonials: () => this.refreshTestimonials(),
      });
    } catch (error) {
      console.error('Error refreshing testimonials:', error);
    }
  }

  setupTestimonialListener(callback) {
    return this.model.subscribeToTestimonials(callback);
  }
}