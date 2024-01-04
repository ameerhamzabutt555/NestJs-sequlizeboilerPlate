/**
 * Defines an interface for an output object that typically represents a response from an API or service.
 * It contains information about the total number of records, the actual data, status code, and a message.
 * @template T - The type of data that the output object contains.
 */
export interface IOutputObject<T> {
  // The total number of records, which can be useful for pagination or result information.
  totalRecords: number;

  // The actual data contained within the output object. It is of type T.
  data: T;

  // The status code indicating the result or response status.
  status: number;

  // A message or description that provides additional information about the response.
  message: string;
}
