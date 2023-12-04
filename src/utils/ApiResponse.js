class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = this.stringifySafe(data);
        this.message = message;
        this.success = statusCode < 400;
    }

    stringifySafe(data) {
        try {
            return JSON.stringify(data);
        } catch (error) {
            // Handle circular references by removing them or providing a default value
            return "[Circular reference]";
        }
    }
}

export { ApiResponse };
