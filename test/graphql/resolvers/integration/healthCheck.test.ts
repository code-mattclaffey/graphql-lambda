/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApp } from "../../../../dev/server";

import request from "supertest";

describe("HealthStatusResolvers", () => {
  let app: any;

  beforeAll(async () => {
    const { app: createdApp } = await createApp();
    app = createdApp;
  });

  describe("GraphQL API - Authentication", () => {
    it("should return 'GOOD' when a valid x-client-id is provided", async () => {
      const query = `query { health }`;

      const response = await request(app)
        .post("/")
        .set("Content-Type", "application/json")
        .set("x-client-id", "test-client")
        .send({ query });

      expect(response.status).toBe(200);
      expect(response.body.data.health).toEqual("GOOD");
    });

    it("should return an error if x-client-id is missing", async () => {
      const query = `query { health }`;

      const response = await request(app)
        .post("/")
        .set("Content-Type", "application/json")
        .send({ query });

      expect(response.status).toBe(500);
      expect(response.body.errors[0].message).toBe(
        "Failed authentication validation"
      );
      expect(response.body.errors[0].statusCode).toBe(401);
    });
  });
});
