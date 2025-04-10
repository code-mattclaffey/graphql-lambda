/* eslint-disable @typescript-eslint/no-explicit-any */

import { APIGatewayRequestAuthorizerEventHeaders } from "aws-lambda/trigger/api-gateway-authorizer";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import dotenv from "dotenv";
import { Headers } from "../types/common";
import errors from "./errors";

dotenv.config();

export function convertHeadersToLowercase(
  eventHeaders: APIGatewayRequestAuthorizerEventHeaders
): APIGatewayRequestAuthorizerEventHeaders {
  const headers: APIGatewayRequestAuthorizerEventHeaders = {};
  const keys = Object.keys(eventHeaders);
  for (const key of keys) {
    headers[key.toLowerCase()] = eventHeaders[key];
  }
  return headers;
}

export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

export const getTracingHeaders = (headers: Headers) => {
  const normalizedHeaders = convertHeadersToLowercase(headers);
  const tracingHeaderKeys = [
    "x-app-id",
    "x-api-key",
    "x-journey-name",
    "x-client-id",
  ];

  const tracingHeaders = tracingHeaderKeys.reduce(
    (tracingHeaders: Headers, key) => {
      const value = normalizedHeaders[key];
      if (value) {
        tracingHeaders[key] = value;
      }
      return tracingHeaders;
    },
    {}
  );
  // tracingHeaders["Access-Control-Allow-Origin"] = "*";
  return tracingHeaders;
};

export async function doPost<T>(
  url: string,
  payload: Record<string, any> | URLSearchParams,
  configuration: AxiosRequestConfig
): Promise<T> {
  try {
    let res: AxiosResponse<T>;
    console.log(
      `POST url ${url} with payload ${JSON.stringify(
        payload
      )}  and configuration ${JSON.stringify(configuration)}`
    );
    if (isEmpty(configuration) || configuration.headers === undefined) {
      res = await axios.post<T>(url, payload);
    } else {
      res = await axios.post<T>(url, payload, configuration);
    }
    return res.data;
  } catch (e) {
    console.error(`Error while POST ${url}, error: ${JSON.stringify(e)}`);
    throw errors.InternalErrorException();
  }
}

export async function doGet<T>(
  url: string,
  configuration: AxiosRequestConfig
): Promise<T> {
  try {
    console.log(
      `GET url ${url} with configuration ${JSON.stringify(configuration)}`
    );
    const res = await axios.get<T>(url, configuration);
    return res.data;
  } catch (e) {
    console.error(
      `Error: ${e.message} on ${url} with data: ${JSON.stringify(e)}`
    );
    throw errors.InternalErrorException();
  }
}

export const BGApiPost = <T>(
  url: string,
  data: Record<string, any>,
  headers: Record<string, any> = {}
) =>
  doPost<T>(`/${url}`, data, {
    headers: {
      "Content-Type": "application/vnd.api+json",
      ...getTracingHeaders(headers),
    },
  });

export const BGApiGet = <T>(url: string, headers: Record<string, any>) =>
  doGet<T>(`/${url}`, {
    headers: {
      "Content-Type": "application/vnd.api+json",
      ...getTracingHeaders(headers),
    },
  });

export const BGAEMGet = <T>(url: string, headers: Record<string, any>) =>
  doGet<T>(`/${url}`, {
    headers: {
      "Content-Type": "application/vnd.api+json",
      ...getTracingHeaders(headers),
    },
  });
