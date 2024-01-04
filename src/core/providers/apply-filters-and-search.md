# Documentation of `get-all` API - Quick Steps

_Original/Default `get-all` API **payload**:_

```json
{
  "page": 1, //optional
  "pageSize": 10, //optional
  "sortColumn": "id",
  "sortOrder": "DESC",
  "condition": {}, //optional
  "attributes": ["string"] //optional
}
```

## Example Table:

**User:**

| id  | firstName | lastName | age | gender |
| --- | --------- | -------- | --- | ------ |
| 1   | Areeb     | Arshad   | 22  | Male   |
| 2   | Hamza     | Ajmal    | 23  | Male   |
| 3   | Isra      | Aslam    | 21  | Female |
| 4   | Muhammad  | Ibrar    | 25  | Male   |
| 5   | Sana      | Shafqat  | 22  | Male   |
| 6   | Jaffer    | Ali      | 25  | Male   |
| 7   | Hamza     | Rajpoot  | 22  | Male   |

---

**Usage of `get-all` API with examples:**

1.  **Pagination:**
    You need to pass `page` and `pageSize` keys according to your need and it will return the data according to server side pagination.

2.  **Get All Record From the Database:**
    If you want to take all the records from database without the paginations, just remove `page` and `pageSize` keys from the payload.
3.  **Get Specific Columns:**
    If you want to fetch some specific columns, you will need to pass to an array of strings in attributes key in the payload.
    **_Example:_** I want only `firstName` and `lastName` from `User` table then I'll pass:
    ```json
    "attributes": ["firstName", "lastName"]
    ```
4.  **Sorting:**
    Let suppose I want to sort User table with age and in ascending order then I'll have to pass:

    ```json
    {
      "sortColumn": "age",
      "sortOrder": "ASC"
    }
    ```

5.  **Searching:**
    Now, I want to search anything, I need to pass the condition key in the pay load.
    Examples:
    get the user with the name Hamza:

    ```json
    "condition": { "fistName": "Hamza" }
    ```

    _it will return 2 records_

    | id  | firstName | lastName | age | gender |
    | --- | --------- | -------- | --- | ------ |
    | 7   | Hamza     | Rajpoot  | 22  | Male   |
    | 2   | Hamza     | Ajmal    | 23  | Male   |

    get the user with the name Hamza:

    ```json
    "condition": { "fistName": "Hamza", "lastName": "Ajmal" }
    ```

    _it will perform the **`AND`** operation and return only 1 record_

    | id  | firstName | lastName | age | gender |
    | --- | --------- | -------- | --- | ------ |
    | 2   | Hamza     | Ajmal    | 23  | Male   |

    Now, if you want to perform **`OR`** operation, you need to add **`$or`** keyword and pass an array into this:

    ```json
    "condition": {
    	"$or": [
    		{ "fistName": "Hamza" },
    		{ "firstName": "Areeb" }
    	]
    }
    ```

    it will return:

    | id  | firstName | lastName | age | gender |
    | --- | --------- | -------- | --- | ------ |
    | 7   | Hamza     | Rajpoot  | 22  | Male   |
    | 2   | Hamza     | Ajmal    | 23  | Male   |
    | 1   | Areeb     | Arshad   | 22  | Male   |

    And you want combination of **`AND`** & **`OR`** operators:

    ```json
    "condition": {
    	"age": 22,
    	"$or": [
    		{ "fistName": "Hamza" },
    		{ "firstName": "Areeb" }
    	]
    }
    ```

    It will perform the query like this:
    -> **_where age = 22 AND (firstName = "Hamza" OR firstName = "Areeb")_**
    So, it will return 2 records:

    | id  | firstName | lastName | age | gender |
    | --- | --------- | -------- | --- | ------ |
    | 7   | Hamza     | Rajpoot  | 22  | Male   |
    | 1   | Areeb     | Arshad   | 22  | Male   |

    If you want to perform **`like`** search then you have to use **`$iLike`** keyword:
    If I want to get all the records whose lastName starts with "a":

    ```json
    "condition": {
    	lastName: { "$iLike": "a%" }
    }
    ```

    result:

    | id  | firstName | lastName | age | gender |
    | --- | --------- | -------- | --- | ------ |
    | 6   | Jaffer    | Ali      | 25  | Male   |
    | 3   | Isra      | Aslam    | 21  | Female |
    | 2   | Hamza     | Ajmal    | 23  | Male   |
    | 1   | Areeb     | Arshad   | 22  | Male   |

    Now the records whose firstName ends with "a":

    ```json
    "condition": {
    	lastName: { "$iLike": "%a" }
    }
    ```

    result:

    | id  | firstName | lastName | age | gender |
    | --- | --------- | -------- | --- | ------ |
    | 7   | Hamza     | Rajpoot  | 22  | Male   |
    | 5   | Sana      | Shafqat  | 22  | Male   |
    | 3   | Isra      | Aslam    | 21  | Female |
    | 2   | Hamza     | Ajmal    | 23  | Male   |

    Any records whose lastName contains "m":

    ```json
    "condition": {
    	lastName: { "$iLike": "%m%" }
    }
    ```

    result:

    | id  | firstName | lastName | age | gender |
    | --- | --------- | -------- | --- | ------ |
    | 3   | Isra      | Aslam    | 21  | Female |
    | 2   | Hamza     | Ajmal    | 23  | Male   |

6.  **Filters:**
    It's same as search, you can apply any filters using above examples.
    Let's suppose, we have 2 filters; **`age`** and **`gender`**. I want to filter records having _`age 22 and gender Male`_

    ```json
    "condition": {
    	"age": 22,
    	"gender": "MALE"
    }
    ```

    result:

    | id  | firstName | lastName | age | gender |
    | --- | --------- | -------- | --- | ------ |
    | 7   | Hamza     | Rajpoot  | 22  | Male   |
    | 1   | Areeb     | Arshad   | 22  | Male   |
