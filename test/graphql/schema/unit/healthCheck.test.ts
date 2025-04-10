import healthCheckSchema from "../../../../src/graphql/schema/healthCheck";

describe("healthCheckSchema", () => {
  it("should return GOOD on the health check query", () => {
    expect(healthCheckSchema).toMatchSnapshot();
  });
});
