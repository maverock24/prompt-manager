---
title: Integration Tests — Test the Seams
description: Write integration tests for component interaction, data flow across boundaries, and error handling between services. Prioritize after unit tests.
---

# Integration Tests — Test the Seams

Write integration tests for the target feature or flow. Integration tests verify that multiple components work together correctly. They test the SEAMS — the boundaries between units where bugs hide.

## Input

Fill in the field below, then run the steps.

**Feature / flow to test — components and data flow involved:**

```
[DESCRIBE THE FEATURE / FLOW AND COMPONENTS INVOLVED]
```

---

## When to Write Integration Tests
- After unit tests cover individual components
- When testing: database queries with real (embedded) DB → API response formatting → middleware chains → service-to-service communication → event publishing/consuming

## What Makes a Good Integration Test

### It Tests One Coherent Flow
Not "test everything" — pick ONE user action or system interaction and test its full journey:
```
Example: "User creates an order" → order saved to DB → inventory decremented → 
confirmation event published → response returned
```

### It Uses Real Infrastructure (Embedded, Not Mocked)
- Database: use embedded/testcontainers (NOT mocked repositories)
- Message queue: use embedded Kafka/RabbitMQ
- Cache: use embedded Redis
- External APIs: use wiremock/mock server (since you can't embed Stripe)

**Critical distinction**: mocking at the unit level is correct. Mocking at the integration level defeats the purpose. If you mock the database in an integration test, you're testing nothing useful.

### It Tests the Boundaries That Unit Tests Miss
Unit tests verify: "Does my service call the repository with the right arguments?"
Integration tests verify: "Does the actual SQL query return the right rows from a real database?"

## Test Structure

For each integration test:
```
1. SETUP: Start with a known state
   - Seed the database with test fixtures
   - Authenticate (obtain a real token, not a bypass)
   
2. EXECUTE: Perform the action through the real stack
   - Hit the actual API endpoint (not the controller directly)
   - OR call the service with real dependencies
   
3. VERIFY: Check the FULL outcome
   - Response status and body
   - Database state (rows created/updated/deleted)
   - Side effects (events published, emails sent, cache updated)
   - What should NOT have changed (other users' data untouched)

4. TEARDOWN: Clean up (or use @Transactional rollback)
```

## Prioritization
Integration tests are more expensive than unit tests. Be strategic:
1. Critical data mutations (create, update, delete operations)
2. Authentication and authorization flows
3. Transaction boundaries (rollback on failure)
4. Event publishing and consumption
5. Caching behavior (stale data, cache invalidation)

## Self-Critique Checklist
After writing, verify:
- "Does this test verify something unit tests cannot verify? If yes, keep it. If no, convert to a unit test."
- "Is the infrastructure setup worth the confidence gained? If setup takes 30 seconds and the test catches a bug once a year, consider removing it."
- "Will this test break when I refactor internal implementation, or only when behavior changes? It should only break on behavior changes."
- "Am I testing the framework or my code? Spring Boot's `@Transactional` works — test YOUR transactional logic, not Spring's."


