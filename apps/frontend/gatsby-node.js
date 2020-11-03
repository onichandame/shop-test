require('ts-node').register({ files: true })

const { localize } = require('./src/i18n/localize')
const { locales } = require('./src/i18n/locales')

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  deletePage(page)
  locales.map(locale => {
    return createPage({
      ...page,
      path: localize(locale, page.path),
      context: {
        ...page.context,
        locale
      }
    })
  })
}
