// frontend/my-app/src/components/UsersList.jsx

import { useState } from "react";
import { UsersService } from "../services/users.service";
import { QueryService } from "../services/query.service";

export default function UsersList() {
  const [users, setUsers] = useState(null);
  const [queryId, setQueryId] = useState("");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Chargement manuel de la liste
  const loadUsers = async () => {
    try {
      setErrorMsg("");
      setResult(null);

      const res = await UsersService.getAll();

      if (!Array.isArray(res.data)) {
        throw new Error("Invalid response");
      }

      setUsers(res.data);
    } catch {
      setUsers([]);
      setErrorMsg("Impossible de charger les utilisateurs.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setResult(null);

    const trimmedId = queryId.trim();
    if (!trimmedId) {
      setErrorMsg("Veuillez saisir un ID valide.");
      return;
    }

    try {
      const res = await QueryService.findUserById(trimmedId);
      setResult(res.data);
    } catch {
      setErrorMsg("Utilisateur introuvable.");
    }
  };

  return (
    <section className="box-blue">
      <h3>Rechercher un utilisateur</h3>

      <button type="button" onClick={loadUsers}>
        Afficher la liste des utilisateurs
      </button>

      {users === null ? (
        <p style={{ fontStyle: "italic" }}>
          Cliquez sur le bouton pour afficher les utilisateurs.
        </p>
      ) : users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        users.map((u) => <p key={u.id}>ID : {u.id}</p>)
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Entrez un ID utilisateur"
          value={queryId}
          onChange={(e) => setQueryId(e.target.value)}
          required
        />
        <button type="submit">Rechercher</button>
      </form>

      {errorMsg && <p className="msg-error">{errorMsg}</p>}

      {result && (
        <div className="result-block">
          <h4>Utilisateur trouvé :</h4>
          <p>ID : {result.id}</p>
          <p>Name : {result.name}</p>
        </div>
      )}
    </section>
  );
}
