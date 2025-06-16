
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function PlantMaster() {
//   const [formData, setFormData] = useState({
//     plantId: null,
//     plantName: '',
//     plantAddress: '',
//     contactPerson: '',
//     mobileNo: '',
//     remarks: ''
//   });
//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState('');
//   const [showEditButton, setShowEditButton] = useState(false);
//   const [editMode, setEditMode] = useState(false);

//   useEffect(() => {
//     fetchPlants();
//   }, []);

//   const fetchPlants = async () => {
//     try {
//       const res = await axios.get('http://localhost:3001/api/plants');
//       setPlantList(res.data);
//     } catch (err) {
//       console.error('Error fetching plant list:', err);
//     }
//   };

//   const handlePlantSelect = (e) => {
//     const plantName = e.target.value;
//     setSelectedPlant(plantName);
//     setShowEditButton(!!plantName);
//   };

//   const handleEditClick = async () => {
//     if (!selectedPlant) return;
//     try {
//       const res = await axios.get(`http://localhost:3001/api/plantmaster/${encodeURIComponent(selectedPlant)}`);
//       if (res.data && (res.data.PlantID || res.data.PlantId)) {
//         setFormData({
//           plantId: res.data.PlantID || res.data.PlantId,
//           plantName: res.data.PlantName,
//           plantAddress: res.data.PlantAddress,
//           contactPerson: res.data.ContactPerson,
//           mobileNo: res.data.MobileNo,
//           remarks: res.data.Remarks
//         });
//         setEditMode(true);
//       } else {
//         console.error('No valid plant data returned');
//         alert('❌ Invalid plant selected or no data found');
//       }
//     } catch (err) {
//       console.error('Error fetching plant:', err);
//       alert('❌ Error fetching plant data');
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleBack = () => {
//     setFormData({
//       plantId: null,
//       plantName: '',
//       plantAddress: '',
//       contactPerson: '',
//       mobileNo: '',
//       remarks: ''
//     });
//     setEditMode(false);
//     setSelectedPlant('');
//     setShowEditButton(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (formData.plantId) {
//         await axios.put(`http://localhost:3001/api/plantmaster/update/${formData.plantId}`, formData);
//         alert('✅ Plant updated successfully!');
//       } else {
//         await axios.post('http://localhost:3001/api/plantmaster', formData);
//         alert('✅ Plant data saved successfully!');
//       }
//       fetchPlants();
//       handleBack();
//     } catch (err) {
//       alert('❌ Error saving data');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 p-4">
//       <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Plant Master</h2>
//         {!editMode ? (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Select Plant to Edit</label>
//               <select value={selectedPlant} onChange={handlePlantSelect} className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2">
//                 <option value="">-- Select --</option>
//                 {[...new Set(plantList.map((plant) => plant.PlantName))].map((name, index) => (
//                   <option key={index} value={name}>{name}</option>
//                 ))}
//               </select>
//             </div>
//             {showEditButton && (
//               <button
//                 onClick={handleEditClick}
//                 className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
//               >
//                 Edit Selected Plant
//               </button>
//             )}
//             <button
//               onClick={() => setEditMode(true)}
//               className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//             >
//               + Add New Plant
//             </button>
//           </div>
//         ) : (
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Plant Name</label>
//               <input
//                 type="text"
//                 name="plantName"
//                 value={formData.plantName}
//                 onChange={handleChange}
//                 placeholder="Enter Plant Name"
//                 className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Plant Address</label>
//               <textarea
//                 name="plantAddress"
//                 value={formData.plantAddress}
//                 onChange={handleChange}
//                 placeholder="Enter Plant Address"
//                 rows="2"
//                 className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
//               ></textarea>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Contact Person</label>
//               <input
//                 type="text"
//                 name="contactPerson"
//                 value={formData.contactPerson}
//                 onChange={handleChange}
//                 placeholder="Enter Contact Person Name"
//                 className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Mobile No</label>
//               <input
//                 type="tel"
//                 name="mobileNo"
//                 value={formData.mobileNo}
//                 onChange={handleChange}
//                 placeholder="Enter Mobile Number"
//                 className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Remarks</label>
//               <textarea
//                 name="remarks"
//                 value={formData.remarks}
//                 onChange={handleChange}
//                 placeholder="Enter Remarks"
//                 rows="2"
//                 className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
//               ></textarea>
//             </div>
//             <div className="flex justify-between mt-6">
//               <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
//                 {formData.plantId ? 'Update' : 'Save'}
//               </button>
//               <button type="button" onClick={handleBack} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
//                 Back
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
//////////////////////////////////////////


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function PlantMaster() {
//   const [formData, setFormData] = useState({
//     plantId: null,
//     plantName: '',
//     plantAddress: '',
//     contactPerson: '',
//     mobileNo: '',
//     remarks: ''
//   });
//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState('');
//   const [showEditButton, setShowEditButton] = useState(false);
//   const [editMode, setEditMode] = useState(false);

//   useEffect(() => {
//     fetchPlants();
//   }, []);

//   const fetchPlants = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/plants`);
//       setPlantList(res.data);
//     } catch (err) {
//       console.error('Error fetching plant list:', err);
//     }
//   };

//   const handlePlantSelect = (e) => {
//     const plantName = e.target.value;
//     setSelectedPlant(plantName);
//     setShowEditButton(!!plantName);
//   };

//   const handleEditClick = async () => {
//     if (!selectedPlant) return;
//     try {
//       const res = await axios.get(`${API_URL}/api/plantmaster/${encodeURIComponent(selectedPlant)}`);
//       if (res.data && (res.data.PlantID || res.data.PlantId)) {
//         setFormData({
//           plantId: res.data.PlantID || res.data.PlantId,
//           plantName: res.data.PlantName,
//           plantAddress: res.data.PlantAddress,
//           contactPerson: res.data.ContactPerson,
//           mobileNo: res.data.MobileNo,
//           remarks: res.data.Remarks
//         });
//         setEditMode(true);
//       } else {
//         console.error('No valid plant data returned');
//         alert('❌ Invalid plant selected or no data found');
//       }
//     } catch (err) {
//       console.error('Error fetching plant:', err);
//       alert('❌ Error fetching plant data');
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleBack = () => {
//     setFormData({
//       plantId: null,
//       plantName: '',
//       plantAddress: '',
//       contactPerson: '',
//       mobileNo: '',
//       remarks: ''
//     });
//     setEditMode(false);
//     setSelectedPlant('');
//     setShowEditButton(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (formData.plantId) {
//         await axios.put(`${API_URL}/api/plantmaster/update/${formData.plantId}`, formData);
//         alert('✅ Plant updated successfully!');
//       } else {
//         await axios.post(`${API_URL}/api/plantmaster`, formData);
//         alert('✅ Plant data saved successfully!');
//       }
//       fetchPlants();
//       handleBack();
//     } catch (err) {
//       alert('❌ Error saving data');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 p-4">
//       <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Plant Master</h2>
//         {!editMode ? (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Select Plant to Edit</label>
//               <select value={selectedPlant} onChange={handlePlantSelect} className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2">
//                 <option value="">-- Select --</option>
//                 {[...new Set(plantList.map((plant) => plant.PlantName))].map((name, index) => (
//                   <option key={index} value={name}>{name}</option>
//                 ))}
//               </select>
//             </div>
//             {showEditButton && (
//               <button
//                 onClick={handleEditClick}
//                 className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
//               >
//                 Edit Selected Plant
//               </button>
//             )}
//             <button
//               onClick={() => setEditMode(true)}
//               className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//             >
//               + Add New Plant
//             </button>
//           </div>
//         ) : (
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Plant Name</label>
//               <input
//                 type="text"
//                 name="plantName"
//                 value={formData.plantName}
//                 onChange={handleChange}
//                 placeholder="Enter Plant Name"
//                 className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Plant Address</label>
//               <textarea
//                 name="plantAddress"
//                 value={formData.plantAddress}
//                 onChange={handleChange}
//                 placeholder="Enter Plant Address"
//                 rows="2"
//                 className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
//               ></textarea>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Contact Person</label>
//               <input
//                 type="text"
//                 name="contactPerson"
//                 value={formData.contactPerson}
//                 onChange={handleChange}
//                 placeholder="Enter Contact Person Name"
//                 className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Mobile No</label>
//               <input
//                 type="tel"
//                 name="mobileNo"
//                 value={formData.mobileNo}
//                 onChange={handleChange}
//                 placeholder="Enter Mobile Number"
//                 className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Remarks</label>
//               <textarea
//                 name="remarks"
//                 value={formData.remarks}
//                 onChange={handleChange}
//                 placeholder="Enter Remarks"
//                 rows="2"
//                 className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
//               ></textarea>
//             </div>
//             <div className="flex justify-between mt-6">
//               <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
//                 {formData.plantId ? 'Update' : 'Save'}
//               </button>
//               <button type="button" onClick={handleBack} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
//                 Back
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function PlantMaster() {
  const [formData, setFormData] = useState({
    plantId: null,
    plantName: '',
    plantAddress: '',
    contactPerson: '',
    mobileNo: '',
    remarks: ''
  });
  const [plantList, setPlantList] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [showEditButton, setShowEditButton] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchPlants();
  }, []);

  // Helper to get plant name robustly
  const getPlantName = (plant) => plant.PlantName || plant.plantname || plant.plant_name || plant || '';

  const fetchPlants = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/plants`);
      setPlantList(res.data);
    } catch (err) {
      console.error('Error fetching plant list:', err);
    }
  };

  const handlePlantSelect = (e) => {
    const plantName = e.target.value;
    setSelectedPlant(plantName);
    setShowEditButton(!!plantName);
  };

  const handleEditClick = async () => {
    if (!selectedPlant) return;
    try {
      const res = await axios.get(`${API_URL}/api/plantmaster/${encodeURIComponent(selectedPlant.trim())}`);
      if (res.data && (res.data.PlantID || res.data.PlantId)) {
        setFormData({
          plantId: res.data.PlantID || res.data.PlantId,
          plantName: res.data.PlantName,
          plantAddress: res.data.PlantAddress,
          contactPerson: res.data.ContactPerson,
          mobileNo: res.data.MobileNo,
          remarks: res.data.Remarks
        });
        setEditMode(true);
      } else {
        console.error('No valid plant data returned');
        alert('❌ Invalid plant selected or no data found');
      }
    } catch (err) {
      console.error('Error fetching plant:', err);
      alert('❌ Error fetching plant data');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    setFormData({
      plantId: null,
      plantName: '',
      plantAddress: '',
      contactPerson: '',
      mobileNo: '',
      remarks: ''
    });
    setEditMode(false);
    setSelectedPlant('');
    setShowEditButton(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.plantId) {
        await axios.put(`${API_URL}/api/plantmaster/update/${formData.plantId}`, formData);
        alert('✅ Plant updated successfully!');
      } else {
        await axios.post(`${API_URL}/api/plantmaster`, formData);
        alert('✅ Plant data saved successfully!');
      }
      fetchPlants();
      handleBack();
    } catch (err) {
      alert('❌ Error saving data');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Plant Master</h2>
        {!editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Plant to Edit</label>
              <select value={selectedPlant} onChange={handlePlantSelect} className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2">
                <option value="">-- Select --</option>
                {[...new Set(plantList.map(getPlantName))].map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </div>
            {showEditButton && (
              <button
                onClick={handleEditClick}
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                Edit Selected Plant
              </button>
            )}
            <button
              onClick={() => setEditMode(true)}
              className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              + Add New Plant
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plant Name</label>
              <input
                type="text"
                name="plantName"
                value={formData.plantName}
                onChange={handleChange}
                placeholder="Enter Plant Name"
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plant Address</label>
              <textarea
                name="plantAddress"
                value={formData.plantAddress}
                onChange={handleChange}
                placeholder="Enter Plant Address"
                rows="2"
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Enter Contact Person Name"
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile No</label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter Remarks"
                rows="2"
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2"
              ></textarea>
            </div>
            <div className="flex justify-between mt-6">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                {formData.plantId ? 'Update' : 'Save'}
              </button>
              <button type="button" onClick={handleBack} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}