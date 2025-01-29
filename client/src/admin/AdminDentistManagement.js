import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDentistManagement = () => {
  const [dentists, setDentists] = useState([]);
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    address: "",
    city: "",
    phone: "",
    rating: "",
  });
  const [editingDentist, setEditingDentist] = useState(null);
  const [error, setError] = useState(null); // Gestion des erreurs globales
  const [formError, setFormError] = useState(""); // Erreur liée au formulaire
  const [backendErrors, setBackendErrors] = useState(null); // Erreurs renvoyées par le backend

  // Récupérer les dentistes depuis le backend
  const fetchDentists = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/dentists");
      console.log('Response:', response); // Afficher la réponse complète
      if (response.status === 200) {
        setDentists(response.data);
        setError(null);
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching dentists:", error);
      setError("Failed to fetch dentists. Please try again later.");
    }
  };
  
  useEffect(() => {
    fetchDentists();
  }, []);

  // Gestion du changement des champs du formulaire
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError(""); // Réinitialiser l'erreur à chaque changement de champ
    setBackendErrors(null); // Réinitialiser les erreurs du backend
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de tous les champs obligatoires
    if (!form.name || !form.specialization || !form.address || !form.city || !form.phone) {
      setFormError("All fields are required.");
      return;
    }

    // Validation de la note
    if (form.rating && (form.rating < 0 || form.rating > 5)) {
      setFormError("Rating must be between 0 and 5.");
      return;
    }

    try {
      // Ajouter ou mettre à jour un dentiste
      if (editingDentist) {
        await axios.put(`http://localhost:5000/api/dentists/${editingDentist._id}`, form);
        window.location.reload();

      } else {
        await axios.post("http://localhost:5000/api/dentists", form);
        window.location.reload();

      }
      setForm({ name: "", specialization: "", address: "", city: "", phone: "", rating: "" });
      setEditingDentist(null);
      setBackendErrors(null); // Réinitialiser les erreurs du backend après succès
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setBackendErrors(error.response.data.errors); 
      } else {
        setFormError("Error saving dentist. Please try again.");
      }
    }
  };

  // Supprimer un dentiste
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dentist?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/dentists/${id}`);
      await fetchDentists(); // Rafraîchissement de la liste après suppression
      alert("Dentist deleted successfully");
    } catch (error) {
      console.error("Error deleting dentist:", error);
      alert("Failed to delete dentist. Please try again.");
    }
  };

  // Éditer un dentiste
  const handleEdit = (dentist) => {
    setEditingDentist(dentist);
    setForm(dentist);
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Administrateur : gérer les dentistes </h2>

      {/* Affichage de l'erreur s'il y en a une */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Formulaire pour ajouter/modifier */}
      <div className="card p-4 mb-4">
        <h4>{editingDentist ? "Edit Dentist" : "Add New Dentist"}</h4>
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Form fields with validation */}
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={form.specialization}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="number"
                name="rating"
                placeholder="Rating (0-5)"
                value={form.rating}
                onChange={handleInputChange}
                className="form-control"
                step="0.1"
                min="0"
                max="5"
              />
            </div>
          </div>
          {formError && <div className="alert alert-danger">{formError}</div>}

          {/* Affichage des erreurs du backend */}
          {backendErrors && (
            <div className="alert alert-danger">
              {backendErrors.map((error, index) => (
                <div key={index}>{error.msg}</div>
              ))}
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            {editingDentist ? "Update Dentist" : "Add Dentist"}
          </button>
        </form>
      </div>

      {/* Liste des dentistes */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Address</th>
            <th>City</th>
            <th>Phone</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dentists.map((dentist) => (
            <tr key={dentist._id}>
              <td>{dentist.name}</td>
              <td>{dentist.specialization}</td>
              <td>{dentist.address}</td>
              <td>{dentist.city}</td>
              <td>{dentist.phone}</td>
              <td>{dentist.rating}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(dentist)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(dentist._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDentistManagement;
