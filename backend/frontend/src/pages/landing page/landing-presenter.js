// landing-presenter.js
import LandingModel from "./landing-model";

export default class landingPresenter {
  constructor(view) {
    this.view = view;
    this.model = new LandingModel();
  }

  async loadContent() {
    const data = await this.model.fetchMoodData();
    this.view.renderContent(data);
  }
}
