module.exports = new class {
    constructor() {
        this.currentTest = null;
    }
    running() {
        this.currentTest = {
            running: true
        };
    }
    stop() {
        this.currentTest.running = false;
    }
    error(message) {
        this.currentTest.error = true;
        this.currentTest.message = message;
    }
    isRunning() {
        return this.currentTest && this.currentTest.running;
    }
    isError() {
        return this.currentTest && !!this.currentTest.error;
    }
    errorInfo() {
        if(!this.currentTest) {
            return null;
        }
        return {
            message: this.currentTest.message
        }
    }
}()