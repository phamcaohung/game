import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: "3.0.0", // chuẩn OpenAPI
        info: {
            title: "My API",
            version: "1.0.0",
            description: "Tài liệu API của Node.js app",
        },
        servers: [
            {
                url: "http://localhost:5000", // URL base của API
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./routes/*.js"], // Đường dẫn tới file chứa API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default function swaggerDocs(app, port) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`📑 Swagger docs available at http://localhost:${port}/api-docs`);
}