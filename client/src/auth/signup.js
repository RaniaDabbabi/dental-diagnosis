import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faIdCard, faCity, faPhone, faMapMarkerAlt, faCalendarAlt, faClock, faImage } from '@fortawesome/free-solid-svg-icons';

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
        city: '',
        isDentist: false,
        phone: '',
        address: '',
        workDays: { start: '', end: '' },
        workHours: { open: '', close: '' },
        image: null,
      },
      message: '',
      error: false,
    };

    this.daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    this.tunisianCities = [
      'Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Gabès', 'Bizerte', 'Ariana', 'Gafsa', 'Monastir', 'Médenine',
      'Nabeul', 'Tataouine', 'Beja', 'Jendouba', 'Tozeur', 'Kasserine', 'Zarzis', 'Kebili', 'Mahdia', 'Siliana',
      'Le Kef', 'Sidi Bouzid', 'Ben Arous', 'Manouba', 'Douz',
    ];
  }

  handleWorkDaysChange = (key, value) => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        workDays: {
          ...prevState.formData.workDays,
          [key]: value
        }
      }
    }));
  };

  handleWorkHoursChange = (key, value) => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        workHours: {
          ...prevState.formData.workHours,
          [key]: value
        }
      }
    }));
  };

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    this.setState((prevState) => {
      let updatedValue = type === 'checkbox' ? checked : value;
  
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          formData: {
            ...prevState.formData,
            [parent]: {
              ...prevState.formData[parent],
              [child]: value
            }
          }
        };
      }
  
      return {
        formData: {
          ...prevState.formData,
          [name]: updatedValue,
        }
      };
    });
  };

  handleFileChange = (e) => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        image: e.target.files[0],
      },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { formData } = this.state;

    for (const field in formData) {
      if (field !== 'isDentist' && field !== 'phone' && field !== 'address' && field !== 'workDays' && field !== 'workHours' && field !== 'image' && !formData[field]) {
        this.setState({ message: 'Tous les champs obligatoires doivent être remplis.', error: true });
        return;
      }
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else if (typeof formData[key] === 'object') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      this.setState({ message: response.ok ? data.message : data.message || 'Erreur de serveur.', error: !response.ok });
    } catch (error) {
      console.error('Erreur de connexion au serveur:', error);
      this.setState({ message: 'Erreur de connexion au serveur.', error: true });
    }
  };

  render() {
    const { formData, message, error } = this.state;

    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="signup-form mb-4" style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', maxWidth: '500px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 className="text-center mb-4">Créer un Compte</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
                <input type="text" className="form-control" placeholder="Nom d'utilisateur" name="username" value={formData.username} onChange={this.handleInputChange} required />
              </div>
            </div>

            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
                <input type="password" className="form-control" placeholder="Mot de passe" name="password" value={formData.password} onChange={this.handleInputChange} required />
              </div>
            </div>

            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
                <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={this.handleInputChange} required />
              </div>
            </div>

            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faIdCard} /></span>
                <input type="text" className="form-control" placeholder="Prénom" name="firstname" value={formData.firstname} onChange={this.handleInputChange} required />
              </div>
            </div>

            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faIdCard} /></span>
                <input type="text" className="form-control" placeholder="Nom" name="lastname" value={formData.lastname} onChange={this.handleInputChange} required />
              </div>
            </div>

            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faCity} /></span>
                <select className="form-control" name="city" value={formData.city} onChange={this.handleInputChange} required>
                  <option value="">- Sélectionner une ville -</option>
                  {this.tunisianCities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="form-check-label">
                <input type="checkbox" className="form-check-input" name="isDentist" checked={formData.isDentist} onChange={this.handleInputChange} /> Je suis un dentiste
              </label>
            </div>

            {formData.isDentist && (
              <>
                <div className="form-group mb-3">
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faPhone} /></span>
                    <input type="text" className="form-control" placeholder="Téléphone" name="phone" value={formData.phone} onChange={this.handleInputChange} required />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
                    <input type="text" className="form-control" placeholder="Adresse" name="address" value={formData.address} onChange={this.handleInputChange} required />
                  </div>
                </div>

                <h5 className="mt-3">Jours de travail</h5>
                <div className="form-group mb-3">
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faCalendarAlt} /></span>
                    <select className="form-control" value={formData.workDays.start} onChange={(e) => this.handleWorkDaysChange('start', e.target.value)} required>
                      <option value="">Sélectionner un jour</option>
                      {this.daysOfWeek.map((day) => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group mb-3">
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faCalendarAlt} /></span>
                    <select className="form-control" value={formData.workDays.end} onChange={(e) => this.handleWorkDaysChange('end', e.target.value)} required>
                      <option value="">Sélectionner un jour</option>
                      {this.daysOfWeek.map((day) => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </div>
                </div>

                <h5 className="mt-3">Horaires de travail</h5>
                <div className="form-group mb-3">
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faClock} /></span>
                    <input type="time" className="form-control" value={formData.workHours.open} onChange={(e) => this.handleWorkHoursChange('open', e.target.value)} required />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faClock} /></span>
                    <input type="time" className="form-control" value={formData.workHours.close} onChange={(e) => this.handleWorkHoursChange('close', e.target.value)} required />
                  </div>
                </div>
              </>
            )}

            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faImage} /></span>
                <input type="file" className="form-control" onChange={this.handleFileChange} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">S'inscrire</button>
          </form>
          {message && <div className={`alert ${error ? 'alert-danger' : 'alert-success'} mt-3`}>{message}</div>}
        </div>
      </div>
    );
  }
}

export default SignUp;