class SortingIcon extends HTMLElement {
    constructor() {
        super();
  
        this.attachShadow({ mode: 'open' });
        this.sortOrder = 'asc';
    }
  
    connectedCallback() {
        this.addEventListener('click', this.toggleSort);
        this.render();
    }
  
    disconnectedCallback() {
        this.removeEventListener('click', this.toggleSort);
    }
  
    toggleSort = () => {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

        this.dispatchEvent(new CustomEvent('sortingRequired', {
            detail: { sortOrder: this.sortOrder },
            bubbles: true,
            composed: true
      }));

      this.shadowRoot.querySelector("#sortButtonIcon").innerHTML = this.sortOrder === 'asc' ? '🔼' : '🔽';
    }
  
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    user-select: none;
                    margin-bottom:10px;
                }
            </style>
            <div id="sortButtonIcon">▶️</div>
        `;
    }
}

window.customElements.define('sorting-icon', SortingIcon);
  