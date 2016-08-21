var router = require('koa-router')();

router.get('/', function *(next) {
  yield this.render('index', {
    title: 'Hello World Koa!',
    template: 'mobile',
    body: 'Whazzip?'
  });
});

module.exports = router;
