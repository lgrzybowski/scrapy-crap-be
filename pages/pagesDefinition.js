const pagesDefinition =
    [{
      pageName: 'cdaction',
      pageDomain: 'https://www.cdaction.pl',
      newsLink: '/newsy-1.html',
      mainSelector: '#newsy',
      newsSelector: '#newsy .news h3 a',
      newsTitle: '#news_content h1',
      newsContent: '#intertext1'
    }, {
      pageName: 'gryonline',
      pageDomain: 'https://www.gry-online.pl',
      newsLink: '/newsroom.asp',
      mainSelector: '.lista-news',
      newsSelector: '.lista-news .box a:not(.pic-c)',
      newsTitle: '.word-txt h1',
      newsContent: '.word-txt p'
    }, {
      pageName: 'mmorpgorgpl',
      pageDomain: 'https://mmorpg.org.pl',
      newsLink: '',
      mainSelector: '.content__left',
      newsSelector: '.article-list__item--title a',
      newsTitle: '.article__title h2',
      newsContent: '.article__text p'
    }]

module.exports = {
  pagesDefinition
}
