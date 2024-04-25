class TeamList extends HTMLElement {
  static get observedAttributes() {
    return ['sort-order'];
  }

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.members = [];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'sort-order' && oldValue !== newValue) {
      this.render();
    }
  }

  set teamMembers(members) {
    this.members = members;
    this.render();
  }

  get teamMembers() {
    return this.members;
  }

  render() {
    const sortOrder = this.dataset.sortOrder || 'asc';
    const sortedMembers = [...this.members].sort((a, b) => {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });

    this.shadowRoot.innerHTML = `
      <style>
        div {
          display: flex;
          flex-direction: column;
        }
      </style>
      <div>
        ${sortedMembers.map(member => `<user-name data-name="${member.name}"></user-name>`).join('')}
      </div>
    `;
  }
}

window.customElements.define('team-list', TeamList);