import { ApolloError } from "apollo-server-core";

enum ErrorCodes {
  NotAuthorized = "NOT_AUTHORIZED",
  NoBoiler = "BOILER_NOT_FOUND",
  NoProvider = "UNKNOWN_PROVIDER",
  AddressInUse = "ADDRESS_IN_USE",
  PhoneNumberInvalid = "PHONE_NUMBER_INVALID",
  OrderError = "ORDER_ERROR",
  InternalError = "INTERNAL_SERVER_ERROR",
}

interface IErrorMessages {
  [errorKey: string]: (...param: Record<string, unknown>[]) => ApolloError;
}

const errors: IErrorMessages = {
  InternalErrorException: () =>
    new ApolloError("Internal Server Error", ErrorCodes.InternalError),
};

interface HTTPBodyError {
  errors: { detail: string }[];
}
export class HTTPError extends Error {
  status: number;

  body: HTTPBodyError;

  message: string;

  constructor(statusCode: number, statusText: string, body: HTTPBodyError) {
    super(statusText);
    this.status = statusCode;
    this.message = statusText;
    this.body = body;
  }
}

export default errors;
