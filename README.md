# History Api
History API and Routing with JavaScript


### history.pushState

`history.pushState` allows you to update the url and history without having to refresh the page.  Doing so does not cause an event to trigger.  This is merely visual.  No content is loaded or changed on the page except for the current url.

If working on an SPA it's recommend to use `window.location.origin` as the base of the url.

```js
const basePath = window.location.origin
window.history.pushState(stateObject, title, `${basePath}/route-path`)
```
> If you do not have a base path, the url pushstate will be added to the current url.

### popstate

`popstate` is only triggered when you use the back and forward buttons with your browser.

### handle pushState changes

Since the pushState function does not trigger an event listener, a custom one can be triggered.

```js
window.dispatchEvent(new CustomEvent('push-state', { detail: '/route-path' }))
```
