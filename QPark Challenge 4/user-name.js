class UserName extends HTMLElement {
  static get observedAttributes() {
    return ['data-name', 'data-style'];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if ((name === 'data-name' || name === 'data-style') && oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const name = this.dataset.name || 'Todor';

    this.shadowRoot.innerHTML = `
      <style>
          span {
              display: block;
              font-size: 20px;
              font-family: Arial, sans-serif;
              color: #2552da;
              ${this.dataset.style}
          }
      </style>
      <span>${name}</span>
    `;
  }
}

window.customElements.define('user-name', UserName);