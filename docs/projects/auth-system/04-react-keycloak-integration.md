---
id: 04-react-keycloak-integration
title: React + Keycloak Integration
sidebar_position: 4
---

# Integrating React App with Keycloak

Now that Keycloak is running, let's integrate it with a **React frontend** using the `keycloak-js` and `react-keycloak` libraries.

---

## 1. Install Dependencies

```bash
npm install keycloak-js @react-keycloak/web
```

---

## 2. React Auth Setup

- src/keycloak.ts

```js
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "myrealm",
  clientId: "react-client",
});

export default keycloak;
```

- src/index.tsx

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";

ReactDOM.render(
  <ReactKeycloakProvider authClient={keycloak}>
    <App />
  </ReactKeycloakProvider>,
  document.getElementById("root")
);
```

## 3. Protecting Routes

- src/App.tsx

```js
import React from "react";
import { useKeycloak } from "@react-keycloak/web";

function App() {
  const { keycloak } = useKeycloak();

  if (!keycloak?.authenticated) {
    keycloak?.login();
    return <p>Redirecting to login...</p>;
  }

  return (
    <div>
      <h1>Welcome, {keycloak.tokenParsed?.preferred_username}</h1>
      <button onClick={() => keycloak.logout()}>Logout</button>
    </div>
  );
}

export default App;
```

## 4. Configure Client in Keycloak

- In Keycloak Admin UI:

  - Realm: myrealm
  - Clients → Create client:

  - Client ID: react-client
  - Client Type: public
  - Root URL: http://localhost:3000

  - Save and go to Settings:
  - Valid redirect URIs: http://localhost:3000/\*
  - Web Origins: \*
