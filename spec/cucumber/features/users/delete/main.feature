Feature: Delete User by ID

  Clients should be able to send a request to our API in order to delete an user.

  Background: Create two Users and logs in with the first user's account

    Given 1 new user is created with random password and email

  Scenario: Delete Self

    When the client creates a DELETE request to /users/:userId
    And sends the request
    Then our API should respond with a 200 HTTP status code
    
    When the client creates a GET request to /users/:userId
    And sends the request
    Then our API should respond with a 404 HTTP status code

  Scenario: Delete Non-existing User

    When the client creates a DELETE request to /users/:userId
    And sends the request
    Then our API should respond with a 200 HTTP status code

    When the client creates a DELETE request to /users/:userId
    And sends the request
    Then our API should respond with a 404 HTTP status code
