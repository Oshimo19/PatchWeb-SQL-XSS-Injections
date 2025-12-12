// frontend/my-app/src/components/Comments.jsx

import { useEffect, useState } from "react";
import { CommentsService } from "../services/comments.service";
import { sanitizePreview } from "../utils/sanitize-xss";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const load = async () => {
    try {
      setErrorMsg("");
      const res = await CommentsService.getAll();

      // Sécurité : s'assurer qu'on reçoit bien un tableau
      if (!Array.isArray(res.data)) {
        throw new Error("Invalid response");
      }

      setComments(res.data);
    } catch {
      setComments([]);
      setErrorMsg("Impossible de charger les commentaires.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await CommentsService.addComment(text);
      setText("");
      await load();
    } catch {
      setErrorMsg("Le commentaire n'a pas pu être ajouté.");
    }
  };

  return (
    <section className="box-red">
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          placeholder="Enter your comment"
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Post Comment</button>
      </form>

      {errorMsg && <p className="msg-error">{errorMsg}</p>}

      <div className="comments-list">
        <h3>Comments:</h3>

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment-block">
              <span>{sanitizePreview(c.content ?? "")}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
