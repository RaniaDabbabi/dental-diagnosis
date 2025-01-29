import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        username: '',
        password: '',
        email: '',
        firstname: '',
        lastname: '',
        gender: '',
        city: '',
      },
      message: '',
      error: false,
    };

    // Static list of Tunisian cities
    this.tunisianCities = [
      'Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Gabès', 'Bizerte', 'Ariana', 'Gafsa', 'Monastir', 'Médenine',
      'Nabeul', 'Tataouine', 'Beja', 'Jendouba', 'Tozeur', 'Kasserine', 'Zarzis', 'Kebili', 'Mahdia', 'Siliana',
      'Le Kef', 'Sidi Bouzid', 'Ben Arous', 'Manouba', 'Douz',
    ];
  }

  // Update form fields
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: { ...prevState.formData, [name]: value },
    }));
  };

  // Handle form submission
  handleSubmit = async (e) => {
    e.preventDefault();
    const { formData } = this.state;

    // Validation des champs
    for (const field in formData) {
      if (!formData[field]) {
        this.setState({ message: 'Tous les champs sont obligatoires.', error: true });
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        this.setState({ message: data.message, error: false });
      

      } else {
        this.setState({ message: data.message || 'Erreur de serveur.', error: true });
      }
    } catch (error) {
      console.error('Erreur de connexion au serveur:', error);
      this.setState({ message: 'Erreur de connexion au serveur.', error: true });
    }
  };

  render() {
    const { formData, message, error } = this.state;

    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: '100vh',
          backgroundColor: '#f8f9fa',
        }}
      >
        <div
          className="signup-form mb-4"
          style={{
            backgroundColor: '#ffffff',
            color: 'black',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 className="text-center mb-4">Créer un Compte</h2>
          <form onSubmit={this.handleSubmit}>
            {/* Username */}
            <div className="form-group mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Nom d'utilisateur"
                name="username"
                value={formData.username}
                onChange={this.handleInputChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group mb-4">
              <input
                type="password"
                className="form-control"
                placeholder="Mot de passe"
                name="password"
                value={formData.password}
                onChange={this.handleInputChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group mb-4">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={this.handleInputChange}
                required
              />
            </div>

            {/* First Name and Last Name */}
            <div className="form-row mb-4">
              <div className="form-group col-md-6 mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Prénom"
                  name="firstname"
                  value={formData.firstname}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="form-group col-md-6 mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nom"
                  name="lastname"
                  value={formData.lastname}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div className="form-group mb-4">
              <label className="mr-3 ">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={this.handleInputChange}
                  checked={formData.gender === 'Male'}
                />
                Homme
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={this.handleInputChange}
                  checked={formData.gender === 'Female'}
                />
                Femme
              </label>
            </div>

            {/* City */}
            <div className="form-group mb-4">
              <select
                className="form-control"
                name="city"
                value={formData.city}
                onChange={this.handleInputChange}
                required
              >
                <option value="">- Sélectionner une ville -</option>
                {this.tunisianCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            {/* Submit */}
            <div className="form-group text-center mb-4 mt-3">
              <input
                type="submit"
                value="S'inscrire"
                className="btn btn-primary btn-block"
              />
              <p className="mt-3">
                Déjà inscrit ? <a href="/signin" className="btn btn-link ">Se connecter</a>
              </p>
            </div>
          </form>

          {/* Message */}
          <div className="form-group">
            <span style={{ color: error ? 'red' : 'green' }}>{message}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
