export function get_style() {
    return `
        <style>
            p {
                width: fit-content;
                padding: 0.3em;
                background-color: var(--counter-background, white);
                font-size: var(--counter-size, 3em);
                font-family: "Arial";
                color: var(--counter-color, black);
            }
            p:hover {
                cursor: pointer;
            }
        </style>
    `
}