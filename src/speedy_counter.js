class SpeedyCounter extends HTMLElement {
    #speed = 1000;
    #currValue = 0;
    #target = 0;
    #startValue = 0;
    constructor() {
        super();
        this.state = "stopped";
        this.timer = null;
        this.first = true;
        this.addEventListener("click", e => {
            e.preventDefault();
            if (this.first) {
                this.first = false;
                this.#target = Number(this.innerHTML);
            }
            this.#clicked();
        });
        this.stoppedEvent = new CustomEvent("counter-stopped");
        this.startedEvent = new CustomEvent("counter-started");
        this.doneEvent = new CustomEvent("counter-done");
    }

    /**
     * Reset the counter when it is done or
     * after a change in speed.
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
        this.#render();
        if (this.state === "stopped" || this.state === "done") {
            if (this.#currValue < this.#target) this.dispatchEvent(this.startedEvent);
            if (this.state === "done") this.#currValue = this.#startValue; // reset
            this.state = "running";
            this.timer = setInterval(() => {
                if (this.#currValue < this.#target) {
                    this.#currValue++;
                    this.#render();
                } else {
                    this.state = "done";
                    this.dispatchEvent(this.doneEvent);
                    clearInterval(this.timer);
                    this.timer = null;
                }
            }, this.#speed);
        } else if (this.state === "running") {
            this.dispatchEvent(this.stoppedEvent);
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
    get start() {
        return this.#startValue;
    }
    set start(val) {
        this.#startValue = val;
        this.setAttribute("start", val);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "speed") {
            this.#speed = newValue;
            this.#reset();
        } else if (name === "start") {
            this.#startValue = newValue;
            this.#currValue = newValue;
        }
    }
    static get observedAttributes() {
        return ["speed", "start"];
    }
    

    connectedCallback() {

    }

    disconnectedCallback() {
        this.removeEventListener("click", e => this.#clicked());
    }
}

// register speedy-counter
customElements.define("speedy-counter", SpeedyCounter);