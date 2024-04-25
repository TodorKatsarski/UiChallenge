class TeamList extends HTMLElement {
    storeName = "teamMembers";
    teamName = "TF1";

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

        this.loadTeamMembers()
            .then(() => {
                this.fullRender();    
            });
    }

    disconnectedCallback() {
        this.removeEventListener('sortingRequired', this.handleSort);
    }

    async initDB() {
        await teamRepository.addItems(this.storeName, [
            { name: 'Elena', team: 'TF1' },
            { name: 'Veronica', team: 'TF1' },
            { name: 'Ionut', team: 'TF1' },
            { name: 'Werner', team: 'TF1' },
            { name: 'Ben', team: 'TF1' },
            { name: 'Tom', team: 'TF1' },
            { name: 'Todor', team: 'TF1' },
            { name: 'Cedric', team: 'ADB' },
        ]);
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

    async loadTeamMembers() {
        const allTeamMembers = await teamRepository.getTeamMembersByTeam(this.storeName, this.teamName);

        if (allTeamMembers.length == 0) {
            await this.initDB();

            allTeamMembers = await teamRepository.getTeamMembersByTeam(this.storeName, this.teamName);
        }

        this.members = allTeamMembers.map(x => ({ name: x.name }));
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
