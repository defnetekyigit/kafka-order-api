import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Playlist API",
      version: "1.0.0",
      description: "A simple API for managing playlists and songs",
    },
    servers: [{ url: "https://playlist-api-476914-europe-west1.run.app" }],
  },
  apis: [`${__dirname}/routes/*.{ts,js}`],
};

export const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
