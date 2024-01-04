/**
 * Defines an interface for specifying keys within nested objects.
 * The keys are represented as an object where each key maps to an array of strings.
 */
export interface INestedObjectKeys {
  [key: string]: string[];
}

/**
 * Defines an interface for specifying keys within nested objects where the values are arrays of strings.
 * The keys are represented as an object where each key maps to an array of strings.
 */
export interface INestedArrayObjectKeys {
  [key: string]: string[];
}

/**
 * Defines an interface for removing specific keys from an object.
 * You can provide the object to remove keys from and an array of keys to remove.
 * Optionally, you can specify keys within nested objects and arrays to remove keys from.
 */
export interface IRemoveKeysFromObject {
  // The object from which keys should be removed.
  obj: any;

  // An array of keys to remove from the top-level object.
  keys: string[];

  // Optional: Keys within nested objects to remove.
  nestedObjectKeys?: INestedObjectKeys[];

  // Optional: Keys within nested objects where the values are arrays of strings to remove.
  nestedArrayObjectKeys?: INestedArrayObjectKeys[];
}
