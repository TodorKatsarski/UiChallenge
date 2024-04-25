class UserName extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});

        const defaultText = 'Todor';
        const nameContent = this.getAttribute('name') || defaultText;

        const nameElement = document.createElement('span');
        nameElement.textContent = nameContent;

        // Styles
        const userStyle = this.getAttribute('style') || 'color: #2552da;';
        const style = document.createElement('style');
        style.textContent = `
            span {
                display: block;
                font-size: 20px;
                font-family: Arial, sans-serif;
                ${userStyle}
            }
        `;

        // Attach the created elements to the shadow dom
        shadow.appendChild(style);
        shadow.appendChild(nameElement);
    }
}

customElements.define('user-name', UserName);
