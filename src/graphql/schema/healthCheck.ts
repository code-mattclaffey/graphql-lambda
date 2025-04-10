import gql from "graphql-tag";

export default gql`
  enum HealthStatus {
    GOOD
    BAD
  }

  type Query {
    health: HealthStatus
  }
`;
