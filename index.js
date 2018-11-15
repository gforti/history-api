import { RouterService } from './routing/index.js'
import TemplateCache from './template-cache.js'

const defaultCtrl = (req, next) => {
  req.load(TemplateCache.get('default'))
  next()
}

const testCtrl = (req, next) => {
  req.load(TemplateCache.get('test'))
  next()
}

const usersCtrl = (req, next) => {
  req.load(TemplateCache.get('users'))
  next()
}

const usersCtrl2 = (req, next) => {
  const id = req.params.get('id')
  console.log('params.id', id)
  document.querySelector('p').innerText = id || ''
  next()
}

RouterService
  .setPath('/test', testCtrl)
  .setPath('/users/:id?', usersCtrl, usersCtrl2)
  .defaultPath(defaultCtrl)
