import { mockServer } from "../../mocks/server";
import dotenv from "dotenv";

dotenv.config();

beforeAll(() => mockServer.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());
