export function get_style() {
    return `
        <style>
            :host {
                font-size: var(--counter-size, 2em);
                font-family: var(--counter-font-family, "Arial");
                color: var(--counter-color, black);
            }
            :host:hover {
                cursor: pointer;
            }
        </style> 
    `
}