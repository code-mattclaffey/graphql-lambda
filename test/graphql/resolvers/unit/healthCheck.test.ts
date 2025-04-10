import HealthCheckResolvers from "../../../../src/graphql/resolvers/healthCheck";

describe("HealthCheckResolvers", () => {
  it("should return GOOD on the health query", () => {
    const result = HealthCheckResolvers.Query.health();
    expect(result).toEqual("GOOD");
  });
});
