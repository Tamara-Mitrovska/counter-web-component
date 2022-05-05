class SpeedyCounter extends HTMLElement {
    #speed = 1000;
    #currValue = 0;
    #target = 0;
    #startValue = 0;
    constructor() {
        super();
        this.state = "stopped";
        this.timer = null;
        this.addEventListener("click", e => {
            e.preventDefault();
            this.#clicked();
            if (this.#startValue == this.#currValue) {
                this.#target = Number(this.innerHTML);
            }
        });
    }

    /**
     * Reset the counter when it is done or after
     * a change in attribute.
     */
    #reset() {
        clearInterval(this.timer);
        this.timer = null;
        this.timer = setInterval(() => {
            if (this.#currValue < this.#target) {
                this.#currValue++;
                this.#render();
            } else {
                this.state = "done";
                clearInterval(this.timer);
                this.timer = null;
            }
        }, this.#speed);
    }

    /**
     * The counter can be paused / unpaused on click
     */
    #clicked() {
        if (this.state === "stopped" || this.state === "done") {
            if (this.state === "done") this.#currValue = this.#startValue; // reset
            this.state = "running";
            this.timer = setInterval(() => {
                if (this.#currValue < this.#target) {
                    this.#currValue++;
                    this.#render();
                } else {
                    this.state = "done";
                    clearInterval(this.timer);
                    this.timer = null;
                }
            }, this.#speed);
        } else if (this.state === "running") {
            this.state = "stopped";
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    #render() {
        this.innerHTML = this.#currValue;
    }

    // reflected attribute-properties
    get speed() {
        return this.#speed;
    }
    set speed(val) {
        this.#speed = val;
        this.setAttribute("speed", val);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "speed") {
            this.#speed = newValue;
            this.#reset();
        }
    }
    static get observedAttributes() {
        return ["speed"];
    }
    

    connectedCallback() {

    }

    disconnectedCallback() {
        this.removeEventListener("click", e => this.#clicked());
    }
}

// register speedy-counter
customElements.define("speedy-counter", SpeedyCounter);