class Article {
  title = "";
  headline = "";
  slug = "";
  contents = "";
  image="";
  constructor(title, headline, slug, contents, image) {
    this.title = title;
    this.headline = headline;
    this.slug = slug;
    this.contents = contents;
    this.image=image;
  }

  /**
   * @returns {{title: string, headline: string, slug: string, contents: string, image: string}}
   */
  toJSON() {
    return {
      title: this.title,
      headline: this.headline,
      slug: this.slug,
      contents: this.contents,
      image: this.image,
    };
  }
}

/**
 * @param {{title: string, headline: string, slug: string, contents: string, image: string}} json the json of the object
 * @returns {Article} the article
 */
Article.fromJSON = function (json) {
  if(json.title!=null&&json.headline!=null&&json.slug!=null&&json.contents!=null&&json.image!=null) return new Article(json.title, json.headline, json.slug, json.contents, json.image);
  else throw new Error("JSON incomplete")
};

/**
 * @returns {{title: string, headline: string, slug: string, contents: string, image: string}}
 */
Article.toJSON = function () {
  return this.toJSON();
};

module.exports = Article;