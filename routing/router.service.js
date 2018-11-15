class RouterService {

  constructor() {

    if(this.instance) {
      return this.instance
    }
    this.instance = this
    this._paths = new Map()
    this._basePath = window.location.origin
    this._exitFn = null
    this.paramRegex = /[:*](\w+)/g

    this.historyChangeBind = this.historyChange.bind(this)
    window.addEventListener('route-clicked', this.historyChangeBind)
    window.addEventListener('popstate', this.historyChangeBind)
    this.routeDisplay = document.querySelector('route-display')

    const path = this.getCurrentPath()
    window.addEventListener('load', this.goto.bind(this, path))
  }

  getCurrentPath() {
    return decodeURI(window.location.pathname)
  }

  getRoute() {
    let currentPath = this.getAdjustedPath(this.getCurrentPath())
    return [...this._paths.keys()]
      .map(this.fromBase64.bind(this))
      .find(routeRE => this._pathToRegex(routeRE).test(currentPath))
  }

  getAdjustedPath(path) {
    return path.split('/')
      .filter(pathName => pathName.length)
      .join('/')
  }

  historyChange() {
    if (typeof this._exitFn === 'function') {
      this._exitFn()
    }
    this._exitFn = null
    const route = this.getRoute()
    let handlers = this.getPath(route) || this.getPath('/')
    let req = {
      exit: this._exit.bind(this),
      load: this._load.bind(this),
      params: this._pathParams(route),
      search: new URLSearchParams(window.location.search)
    }
    const run = (callbacks) => {
      if (Array.isArray(callbacks) && callbacks.length) {
        const element = callbacks.shift()
        if(typeof element === 'function') {
          element(req, () => {
            run.call(this, callbacks)
          })
        }
      }
    }
    if (handlers) {
      run(handlers.slice())
    }
  }

  get basePath() {
    return this._basePath
  }

  goto(path, title='') {
    window.history.pushState(path, title, `${this.basePath}${path}`)
    window.dispatchEvent(new CustomEvent('route-clicked', { detail: path }))
    return this
  }

  toBase64(str) {
    return window.btoa(unescape(encodeURIComponent(str)))
  }

  fromBase64(str) {
    return decodeURIComponent(escape(window.atob(str)))
  }

  setPath(path, ...callbacks) {
    path = this.getAdjustedPath(path)
    if (path.length) {
      this._paths.set(this.toBase64(path), callbacks)
    }
    return this
  }

  defaultPath(...callbacks) {
    this._paths.set(this.toBase64('/'), callbacks)
    return this
  }

  getPath(path) {
    return this._paths.get(this.toBase64(path))
  }

  _load(content) {
    if (document.body.contains(this.routeDisplay)) {
      this.routeDisplay.dataset.content = content
    }
    return this
  }

  _exit(fn) {
    this._exitFn = fn
  }

  _pathToRegex(path = '') {
    let pattern = path.split('/')
      .filter(pathName => pathName.length)
      .map(pathName => this.paramRegex.test(pathName) ? `(\\w+)${pathName.includes('?') ? '?' : ''}` : pathName)
      .join('/?')
    return new RegExp(`^/?${pattern || '/'}/?$`)
  }

  _pathParams(path = '') {
    let matches = path.match(this.paramRegex)
    const currentPath = this.getAdjustedPath(this.getCurrentPath())
    const routeParams = currentPath.match(this._pathToRegex(path))
    let params = new Map()
    if (matches && routeParams) {
      routeParams.shift()
      matches = matches.map(param => param.replace(':','')).forEach((param, i) => {
        params.set(param, routeParams[i])
      })
    }
    return params
  }
}

export default new RouterService()
