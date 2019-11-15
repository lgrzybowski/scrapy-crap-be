const pagesDefinition =
    [{
        pageName: 'cdaction',
        pageDomain: 'https://www.cdaction.pl',
        newsLink: '/newsy-1.html',
        mainSelector: '#newsy',
        newsSelector: '#newsy .news h3 a',
        newsTitle: '#news_content h1',
        newsContent: '#intertext1',
    },{
        pageName: 'eurogamerpl',
        pageDomain: 'https://www.eurogamer.pl',
        newsLink: '/archive/news',
        mainSelector: '.main',
        newsSelector: '.compact-archive-item h2.title a',
        newsTitle: '.title',
        newsContent: 'main section p',
    },{
        pageName: 'grampl',
        pageDomain: 'https://www.gram.pl',
        newsLink: '',
        mainSelector: '.news-room',
        newsSelector: '.news-room .article a',
        newsTitle: 'article h1',
        newsContent: '#content-root p',
    },{
        pageName: 'gryonline',
        pageDomain: 'https://www.gry-online.pl',
        newsLink: '/newsroom.asp',
        mainSelector: '.lista-news',
        newsSelector: '.lista-news .box a:not(.pic-c)',
        newsTitle: '.word-txt h1',
        newsContent: '.word-txt p',
    },{
        pageName: 'mmorpgorgpl',
        pageDomain: 'https://mmorpg.org.pl',
        newsLink: '',
        mainSelector: '.content__left',
        newsSelector: '.article-list__item--title a',
        newsTitle: '.article__title',
        newsContent: '.article__text p',
    }];

module.exports = {
    pagesDefinition,
};