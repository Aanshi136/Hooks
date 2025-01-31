import React, { useState, useEffect } from "react";
import "./Form.css";
import { MdEdit, MdDelete } from "react-icons/md";
import Pagination from "./Pagination";

const Form = ({ items }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [formEntries, setFormEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 4;
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    age: "",
    gender: "female",
    email: "",
    positions: [],
    language: "",
    password: "",
    confirmpassword: "",
  });

  
  useEffect(() => {
    const savedEntries = localStorage.getItem("formEntries");
    if (savedEntries) {
      setFormEntries(JSON.parse(savedEntries));
    } else {
      setFormEntries([]);  
    }
  }, []);
  

  useEffect(() => {
    if (formEntries.length > 0) { 
      localStorage.setItem("formEntries", JSON.stringify(formEntries));
    }
  }, [formEntries]);
  

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        positions: checked
          ? [...prev.positions, value]
          : prev.positions.filter((position) => position !== value),
      }));
    } else if (type === "radio") {
      setFormData((prev) => ({ ...prev, language: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "phoneNumber" && /^\d*$/.test(value)) {
        setPhoneNumber(value);
        setMessage("");
      }
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordMessage("");
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (phoneNumber.length !== 10) {
      setMessage("Phone number must be exactly 10 digits.");
      return;
    }

    if (password.length < 8) {
      setPasswordMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmpassword) {
      setPasswordMessage("Passwords do not match.");
      return;
    }

    const newEntry = {
      ...formData,
      phoneNumber,
      password,
      confirmpassword,
    };

    if (editingIndex !== null) {
      const updatedEntries = [...formEntries];
      updatedEntries[editingIndex] = newEntry;
      setFormEntries(updatedEntries);
      setEditingIndex(null);
    } else {
      setFormEntries((prevEntries) => [...prevEntries, newEntry]);
    }

   
    setFormData({
      firstName: "",
      lastName: "",
      dob: "",
      age: "",
      gender: "female",
      email: "",
      positions: [],
      language: "",
      password: "",
      confirmpassword: "",
    });
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setPasswordMessage("");
  };

  const handleDelete = (index) => {
    const updatedEntries = formEntries.filter((_, i) => i !== index);
    setFormEntries(updatedEntries);
  };

  const handleEdit = (index) => {
    const entryToEdit = formEntries[index];
    setFormData({
      ...entryToEdit,
      phoneNumber: entryToEdit.phoneNumber,
    });
    setPhoneNumber(entryToEdit.phoneNumber);
    setPassword(entryToEdit.password);
    setConfirmPassword(entryToEdit.confirmpassword);
    setEditingIndex(index);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEntries = formEntries.filter((entry) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (
      entry.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
      entry.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
      entry.gender.toLowerCase().includes(lowerCaseSearchTerm) ||
      entry.positions.some((position) =>
        position.toLowerCase().includes(lowerCaseSearchTerm)
      ) ||
      entry.language.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEntries.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="form-wrapper">
      <input
        type="text"
        placeholder="Search "
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <form className="form" onSubmit={handleSubmit}>
        <fieldset className="form-container">
          <legend>Get in touch with us :</legend>
          <label htmlFor="fname">First Name:</label>
          <input
            type="text"
            id="fname"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First name"
            required
          />
          <br />
          <label htmlFor="lname">Last Name:</label>
          <input
            type="text"
            id="lname"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last name"
            required
          />
          <br />
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="Age"
            required
          />
          <br />
          <label htmlFor="gender">Gender:</label>
          <select
            name="gender"
            id="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <br />
          <label htmlFor="mail">Email:</label>
          <input
            type="email"
            id="mail"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your Email"
            required
          />
          <br />
          <label htmlFor="no">Phone Number:</label>
          <input
            type="text"
            id="no"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter your Number"
            required
          />
          <p style={{ color: "red" }}>{message}</p>
          <br />
          <label htmlFor="position">Position Available:</label>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="position1"
              name="position"
              value="Junior Developer"
              onChange={handleInputChange}
              checked={formData.positions.includes("Junior Developer")}
            />
            <label htmlFor="position1">Junior Developer</label>

            <input
              type="checkbox"
              id="position2"
              name="position"
              value="Mid-level Developer"
              onChange={handleInputChange}
              checked={formData.positions.includes("Mid-level Developer")}
            />
            <label htmlFor="position2">Mid-level Developer</label>

            <input
              type="checkbox"
              id="position3"
              name="position"
              value="Senior Developer"
              onChange={handleInputChange}
              checked={formData.positions.includes("Senior Developer")}
            />
            <label htmlFor="position3">Senior Developer</label>
          </div>
          <br />
          <label htmlFor="lan">Programming Languages:</label>
          <div className="radio-group">
            <input
              type="radio"
              id="lan1"
              name="lan"
              value="Python"
              onChange={handleInputChange}
              checked={formData.language === "Python"}
            />
            <label htmlFor="lan1">Python</label>

            <input
              type="radio"
              id="lan2"
              name="lan"
              value="JavaScript"
              onChange={handleInputChange}
              checked={formData.language === "JavaScript"}
            />
            <label htmlFor="lan2">JavaScript</label>

            <input
              type="radio"
              id="lan3"
              name="lan"
              value="ReactJS"
              onChange={handleInputChange}
              checked={formData.language === "ReactJS"}
            />
            <label htmlFor="lan3">ReactJS</label>

            <input
              type="radio"
              id="lan4"
              name="lan"
              value="Java"
              onChange={handleInputChange}
              checked={formData.language === "Java"}
            />
            <label htmlFor="lan4">Java</label>

            <input
              type="radio"
              id="lan5"
              name="lan"
              value="C++"
              onChange={handleInputChange}
              checked={formData.language === "C++"}
            />
            <label htmlFor="lan5">C++</label>
          </div>
          <br />
          <label htmlFor="pass">Password:</label>
          <input
            type="password"
            name="pass"
            id="pass"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            required
          />
          <br />
          <label htmlFor="confirm-pass">Confirm Password:</label>
          <input
            type="password"
            name="confirm-pass"
            id="confirm-pass"
            value={confirmpassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm password"
            required
          />
          <p style={{ color: "red" }}>{passwordMessage}</p>
          <br />
          <button type="submit">Submit</button>
        </fieldset>
      </form>
      <div className="entries">
        {currentItems.map((entry, index) => (
          <div key={index} className="entry-card">
            <p>
              Name: {entry.firstName} {entry.lastName}
            </p>
            <p>Date of Birth: {entry.dob}</p>
            <p>Age: {entry.age}</p>
            <p>Gender: {entry.gender}</p>
            <p>Email: {entry.email}</p>
            <p>Phone Number: {entry.phoneNumber}</p>
            <p>Positions: {entry.positions.join(", ")}</p>
            <p>Programming Language: {entry.language}</p>
            <p>Password : {entry.password}</p>
            <p>confirmpassword : {entry.confirmpassword}</p>
            <div className="update-btn">
              <MdEdit className="edit-icon" onClick={() => handleEdit(index)} />
              <MdDelete
                className="delete-icon"
                onClick={() => handleDelete(index)}
              />
            </div>
          </div>
        ))}
      </div>
      <Pagination
        formEntries={formEntries}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Form;