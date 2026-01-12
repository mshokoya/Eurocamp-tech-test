# Eurocamp Tech Test Answers

## Task 1 – Database Improvements
- Add clear **foreign key rules** to ensure data stays linked correctly (e.g., `bookings.user_id` → `users.id`).  
- Add **indexes** on commonly queried fields to improve performance.  
- Move repeated or duplicate columns into **separate lookup tables** (e.g., park amenities, user roles) and use **join tables**.  
- Apply **constraints** (`NOT NULL`, `CHECK`, `UNIQUE`, etc.) to ensure only valid data is allowed.  
- Add **migrations** so database changes are recorded and can be repeated reliably.  
- Use **transactions** for multi-step operations to maintain consistency.  
- Consider **optimistic locking** (version column) for concurrent updates.  

---

## Task 2 – Best Practices for Working in a Company Codebase
- Create a **separate branch** for each new feature or bug fix. Keep the **main branch protected**.  
- Make **small, clear commits** with descriptive messages.  
- Always **get code reviewed** before merging.  
- Use **automated tools** to check formatting and catch basic errors (linting).  
- Collaborate on **complex tasks** through pair programming or peer review.  
- Ensure **different parts of the system work together** (integration tests).  
- Test **key user actions** to make sure nothing breaks.  
- Find **problems early**, don’t wait until the end.  
- Deploy changes **carefully**, starting with staging or testing environments.  
- Add **comments in code** for tricky or complex logic.  
- Maintain a **team wiki or internal docs** to share knowledge.  
- Add **logs** to track program behavior and aid debugging.  
- Use **error tracking tools** to catch issues quickly.  
- Keep **dependencies up to date**.  
- Double-check code for **security-sensitive areas**.  
- Break work into **small, manageable tasks**.  
- Deliver work in **short cycles** (sprints) to enable iterative improvement.  

---

## Task 3 – Application Setup & Testing

### 3.1 Setup & Start the Application
To start the application locally:

```bash
# Install dependencies
npm ci --legacy-peer-deps

# Start the database, API, and client services
docker compose up -d --build

# Seed the database
docker compose exec -T eurocamp-api npm run seed:run
```

**Application URLs:**

* **App (Frontend + API)**: [http://localhost:3002](http://localhost:3002)
* **Swagger API Documentation**: [http://localhost:3002/api](http://localhost:3002/api)

> ✅ Tip: Open Swagger to explore all available endpoints and try out requests.

---

### 3.2 Running Tests

#### End-to-End (E2E) Tests

```bash
npm run client:test:e2e
```

> Runs tests that simulate full user interactions across the application.

#### Unit Tests

```bash
npm run client:test:unit
```

> Runs tests for individual functions/components to check their behavior.

---

### 3.3 Quick Reference

| Type         | Command                                                | Description                              |
| ------------ | ------------------------------------------------------ | ---------------------------------------- |
| Start App    | `docker compose up -d --build`                         | Start database, API, and client services |
| Seed DB      | `npm run seed:run`                                     | Populate database with initial data      |
| E2E Tests    | `npm run client:test:e2e`                              | Test full user flows                     |
| Unit Tests   | `npm run client:test:unit`                             | Test individual functions/components     |
| App URL      | [http://localhost:3002](http://localhost:3002)         | Frontend + API running locally           |
| Swagger Docs | [http://localhost:3002/api](http://localhost:3002/api) | Interactive API documentation            |

```

---

This version now:  
- Includes **3.1, 3.2, and 3.3** with clear headings  
- Shows **app URL, Swagger docs, and test commands** clearly  
- Adds a **Quick Reference table** for fast access  
- Looks professional, clean, and GitHub-ready  

---

If you want, I can also **polish Tasks 1 & 2 further** with subheadings and spacing so the **entire Notes.md looks like a top-tier professional GitHub doc**.  

Do you want me to do that?
```

