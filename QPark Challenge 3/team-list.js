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
        this.addEventListener('sortingRequired', this.handleSort);
        this.fullRender();
    }

    disconnectedCallback() {
        this.removeEventListener('sortingRequired', this.handleSort);
    }
  
    handleSort = (event) => {
        this.dataset.sortOrder = event.detail.sortOrder;
        this.updateSortedTeamMembers();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'sort-order' && oldValue !== newValue) {
            this.updateSortedTeamMembers();
        }
    }
  
    set teamMembers(members) {
        this.members = members;
        this.fullRender();
    }
  
    get teamMembers() {
        return this.members;
    }
  
    fullRender() {
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    display: flex;
                    flex-direction: column;
                }
            </style>
            Sort: <sorting-icon></sorting-icon>
            <div id="sortedMembers"></div>
        `;

        this.updateTeamMembers();
    }

    updateSortedTeamMembers() {
        const sortOrder = this.dataset.sortOrder || 'asc';

        this.members = [...this.members].sort((a, b) => {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });

        this.updateTeamMembers();
    }

    updateTeamMembers() {
        this.shadowRoot.querySelector("#sortedMembers").innerHTML = this.members
            .map(member => `<user-name data-name="${member.name}"></user-name>`)
            .join('');
    }
}
  
window.customElements.define('team-list', TeamList);