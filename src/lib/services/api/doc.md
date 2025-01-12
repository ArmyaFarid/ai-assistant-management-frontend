# Custom API Client Documentation

## Initialization

The custom API client (CustomApiClient) is used to interact with your REST API. You initialize it with your API's base URL. You can also set the JWT token if required.

```javascript
// Initialize the custom API client with your API base URL
const customClient = new CustomApiClient('https://your-custom-api-base-url');

// Set the JWT token (if available)
customClient.setJwtToken('your-jwt-token');
```

## Custom API Client Provider

To make the client accessible to your application, you wrap it around the CustomApiClientProvider component. This provider should be placed at a higher level in your component tree, ensuring that all components can access the custom API client.

```javascript
<CustomApiClientProvider value={customClient}>
{/* Your entire application content */}
</CustomApiClientProvider>
```
Now, your custom API client is available for use in any part of your application.

## Custom API Hooks Documentation
HTTP GET Hook (useHttpGet)

The useHttpGet hook is used for making GET requests to your API.

```javascript
const { data, loading, error, refetch } = useHttpGet<Doctor[]>('doctors/', { token: tokens });
```
#### data: 
Contains the response data if the request was successful, otherwise null.

#### loading: 
A boolean indicating whether the request is currently loading.

#### error: 
Contains any error information if the request fails, otherwise null.

#### refetch: 
A function to manually trigger a refetch of the data.


## HTTP POST Hook (useHttpPost)

The useHttpPost hook is used for making POST requests to your API.

```javascript
const [sendPostData, { data: postResponseData, loading: postLoading, error: postError, resetData }] = useHttpPost('doctors/', { token: tokens });
```
#### sendPostData: 
A function to send a POST request with the provided data.
#### data: 
Contains the response data if the request was successful, otherwise null.
#### loading: 
A boolean indicating whether the request is currently loading.
#### error: 
Contains any error information if the request fails, otherwise null.
#### resetData: 
A function to reset the data state to null.


## HTTP PUT Hook (useHttpPut)

The useHttpPut hook is used for making PUT requests to your API.

```javascript
const [putData, { response, loading, error, resetData }] = useHttpPut('doctors/', { token: tokens });
```
#### putData: 
A function to send a PUT request with the provided data and ID.
#### data: 
Contains the response data if the request was successful, otherwise null.
#### loading: 
A boolean indicating whether the request is currently loading.
#### error: 
Contains any error information if the request fails, otherwise null.
#### resetData: 
A function to reset the data state to null.


## HTTP DELETE Hook (useHttpDelete)

The useHttpDelete hook is used for making DELETE requests to your API.

```javascript
const [deleteData, { loading, error }] = useHttpDelete('doctors/', { token: tokens });
```
#### deleteData: 
A function to send a DELETE request with the provided ID.
#### loading: 
A boolean indicating whether the request is currently loading.
#### error: 
Contains any error information if the request fails, otherwise null.

## HTTP PATCH Hook (useHttpPatch)

The useHttpPatch hook is used for making PATCH requests to your API.

```javascript
const [patchData, { data, loading, error, resetData }] = useHttpPatch('doctors/', { token: tokens });
```
#### patchData: 
A function to send a PATCH request with the provided data and ID.
#### data: 
Contains the response data if the request was successful, otherwise null.
#### loading: 
A boolean indicating whether the request is currently loading.
#### error: 
Contains any error information if the request fails, otherwise null.
#### resetData: 
A function to reset the data state to null.


## Login Hook (useLogin)

The useLogin hook is used for handling user login.

```javascript
const [login, { loading, error, isConnected, userData }] = useLogin('/login');
```
#### login: 
A function to perform user login. It takes user credentials (email and password) as input.
#### loading: 
A boolean indicating whether the login request is currently loading.
#### error: 
Contains any error information if the login request fails, otherwise null.
#### isConnected: 
A boolean indicating whether the user is valid based on the login request.
#### userData: 
Contains user data if the login request was successful, otherwise null.
Using the Hooks

These hooks can be used within your components to interact with your API endpoints. For example, you can use them in event handlers, such as clicking a button to send a POST request, or in a useEffect to load data when a component mounts.

```javascript
// Example usage of useHttpGet
const { data, loading, error, refetch } = useHttpGet('doctors/', { token: tokens });

// Example usage of useHttpPost
const [sendPostData, { data: postResponseData, loading: postLoading, error: postError, resetData }] = useHttpPost('doctors/', { token: tokens });

// Example usage of useHttpPut
const [putData, { data, loading, error, resetData }] = useHttpPut('doctors/', { token: tokens });

// Example usage of useHttpDelete
const [deleteData, { loading, error }] = useHttpDelete('doctors/', { token: tokens });

// Example usage of useHttpPatch
const [patchData, { data, loading, error, resetData }] = useHttpPatch('doctors/', { token: tokens });

// Example usage of useLogin
const [login, { loading, error, isConnected, userData }] = useLogin('/login');
```

This documentation provides an overview of your custom API client and hooks, including their purpose and usage. Developers can refer to this documentation to effectively integrate these components into their applications.




