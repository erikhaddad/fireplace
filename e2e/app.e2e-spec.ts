import { FireplacePage } from './app.po';

describe('fireplace App', function() {
  let page: FireplacePage;

  beforeEach(() => {
    page = new FireplacePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
