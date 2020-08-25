const hbs = require('hbs');
const path = require('path');

hbs.registerPartials(path.join(__dirname, '../views'));

hbs.registerHelper('date', (date) => {
  const format = (s) => (s < 10) ? '0' + s : s
  var d = new Date(date)
  return [format(d.getDate()), format(d.getMonth() + 1), d.getFullYear()].join('/')
})

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this)
})
