import axios from "axios";
import {
  BGApiGet,
  BGApiPost,
  getTracingHeaders,
  convertHeadersToLowercase,
  isEmpty,
} from "../../../src/utils/http";
import dotenv from "dotenv";
import { APIGatewayRequestAuthorizerEventHeaders } from "aws-lambda/trigger/api-gateway-authorizer";

dotenv.config();

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedHeaders = {
  "x-app-id": "appId",
  "x-journey-name": "journey-name",
  "x-client-id": "clientId",
};

describe("Utils http", () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
    mockedAxios.post.mockClear();
  });

  describe("BGApiPost", () => {
    it("do a POST to the url with the bg api host prefix and handle the response", async () => {
      const payload = { firstName: "Pankaj", surname: "Sharma" };
      const mockResponse = {
        data: { data: "fake-data" },
        status: 200,
        statusText: "OK",
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      const response = await BGApiPost("customers", payload, mockedHeaders);

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining(`/customers`),
        payload,
        {
          headers: {
            ...mockedHeaders,
            "Content-Type": "application/vnd.api+json",
          },
        }
      );
      expect(response).toEqual({ data: "fake-data" });
    });

    it("should throw an error if API returns an error response", async () => {
      const errorMessage = "Internal Server Error";
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(BGApiPost("customers", {}, {})).rejects.toThrow(
        errorMessage
      );
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
  });

  describe("BGApiGet", () => {
    it("do a GET to the url with the bg api host prefix and handle the response ", async () => {
      const mockResponse = {
        data: { data: "fake-data" },
        status: 200,
        statusText: "OK",
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      const response = await BGApiGet("customers", mockedHeaders);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/customers`),
        {
          headers: {
            ...mockedHeaders,
            "Content-Type": "application/vnd.api+json",
          },
        }
      );
      expect(response).toEqual({ data: "fake-data" });
    });

    it("should throw an error if API returns an error response", async () => {
      const errorMessage = "Internal Server Error";
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(BGApiGet("customers", {})).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("helper utils", () => {
    describe("getTracingHeaders", () => {
      it("should return the application id header", () => {
        const result = getTracingHeaders({
          "random-header": "123",
          "x-app-id": "appId",
        });

        expect(result).toEqual({
          "x-app-id": "appId",
        });
      });

      it("should return the journey name header", () => {
        const result = getTracingHeaders({
          "random-header": "123",
          "x-journey-name": "journey-name",
        });

        expect(result).toEqual({
          "x-journey-name": "journey-name",
        });
      });

      it("should return no headers if none are correct", () => {
        const result = getTracingHeaders({
          "random-header": "123",
        });

        expect(result).toEqual({});
      });
    });
    describe("convertHeadersToLowercase", () => {
      it("should convert all header keys to lowercase", () => {
        const inputHeaders: APIGatewayRequestAuthorizerEventHeaders = {
          "Content-Type": "application/json",
          "X-API-Key": "123456",
          Authorization: "Bearer token",
        };

        const expectedHeaders: APIGatewayRequestAuthorizerEventHeaders = {
          "content-type": "application/json",
          "x-api-key": "123456",
          authorization: "Bearer token",
        };

        expect(convertHeadersToLowercase(inputHeaders)).toEqual(
          expectedHeaders
        );
      });

      it("should return an empty object when given an empty object", () => {
        expect(convertHeadersToLowercase({})).toEqual({});
      });

      it("should handle mixed-case headers correctly", () => {
        const inputHeaders: APIGatewayRequestAuthorizerEventHeaders = {
          "ConTent-TYpe": "text/plain",
          "X-aPi-Key": "abcdef",
        };

        const expectedHeaders: APIGatewayRequestAuthorizerEventHeaders = {
          "content-type": "text/plain",
          "x-api-key": "abcdef",
        };

        expect(convertHeadersToLowercase(inputHeaders)).toEqual(
          expectedHeaders
        );
      });
    });

    describe("isEmpty", () => {
      it("should return true for an empty object", () => {
        expect(isEmpty({})).toBe(true);
      });

      it("should return false for a non-empty object", () => {
        expect(isEmpty({ key: "value" })).toBe(false);
      });

      it("should return true for an object with no own properties", () => {
        const obj = Object.create(null); // Creates an object with no prototype
        expect(isEmpty(obj)).toBe(true);
      });
    });
  });
});
