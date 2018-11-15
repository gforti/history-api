window.customElements.define('route-display', class extends HTMLElement {

  constructor() {
    super()
  }

  static get observedAttributes() {
    return ['data-content']
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue !== newValue) {
      const doc = new DOMParser().parseFromString(this.dataset.content, 'text/html')
      this.innerHTML = doc.body.innerHTML.toString()
    }
  }

})
