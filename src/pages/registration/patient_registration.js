import { API_ENDPOINTS } from "@/config/apiConfig";
import React, { useState } from "react";

export default function PatientRegistration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    medicalHistory: "",
    currentMedications: [],
    emergencyContact: {
      name: "",
      relationship: "",
      contactNumber: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [key, subKey] = name.split(".");
      setFormData((prevState) => ({
        ...prevState,
        [key]: {
          ...prevState[key],
          [subKey]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_ENDPOINTS.CREATE_PATIENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Patient registered successfully");
      } else {
        console.error("Failed to register patient");
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Patient Registration
      </h2>
      <p>Manage Your Patient Registration</p>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {/* Patient Details Section */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Patient Details
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Current Medications
              </label>
              <input
                type="text"
                name="currentMedications"
                value={formData.currentMedications.join(", ")}
                onChange={(e) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    currentMedications: e.target.value
                      .split(", ")
                      .filter((med) => med),
                  }))
                }
                placeholder="Separate medications with a comma"
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Medical History
              </label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Street
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                State
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Zip
              </label>
              <input
                type="text"
                name="address.zip"
                value={formData.address.zip}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Emergency Contact
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Emergency Contact Name
              </label>
              <input
                type="text"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Relationship
              </label>
              <input
                type="text"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Contact Number
              </label>
              <input
                type="text"
                name="emergencyContact.contactNumber"
                value={formData.emergencyContact.contactNumber}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Register Patient
        </button>
      </form>
    </div>
  );
}
