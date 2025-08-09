class ResonposeDataClient {
    constructor({ layout, fullLayout, isAdmin, title, currentPage, totalPage, posts, tags, related, newsletter, popularArticle, portfolio, categories, allPost, aboutAuthor, isHideSidebar = false, isSearch = false, qrLink = "", qrTexts = "",  projectImages = "", fireworkTexts = "", music = "" , textColor = "", time = "" }) {
        this.layout = layout;
        this.fullLayout = fullLayout;
        this.isAdmin = isAdmin;
        this.title = title;
        this.currentPage = currentPage;
        this.totalPage = totalPage;
        this.posts = posts;
        this.tags = tags;
        this.related = related;
        this.newsletter = newsletter;
        this.popularArticle = popularArticle;
        this.portfolio = portfolio;
        this.categories = categories;
        this.allPost = allPost;
        this.aboutAuthor = aboutAuthor;
        this.isHideSidebar = isHideSidebar;
        this.isSearch = isSearch;
        this.qrLink = qrLink;
        this.qrTexts = qrTexts;
        this.projectImages = projectImages;
        this.fireworkTexts = fireworkTexts;
        this.music = music;
        this.textColor = textColor;
        this.time = time;
    }
}

module.exports = ResonposeDataClient;