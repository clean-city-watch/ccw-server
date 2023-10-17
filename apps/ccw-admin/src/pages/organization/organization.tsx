import React, { useState, useEffect } from 'react';
import './organization.css';
// Define the organization data interface
interface OrganizationData {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  countryCode: string;
  stateCode: string;
  logoUrl: string;
  user: string[];
}

const OrganizationPage: React.FC = () => {
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [user, setUser] = useState([]);

  // Comment this part to use dummy data
  // Replace 'apiUrl' with your actual API endpoint
  const fetchOrganizationData = async () => {
    const apiUrl = 'http://localhost:3000/api/organization/1';
    try {
      const response = await fetch(apiUrl);
      // console.log(response);
      if (response.ok) {
        const data = await response.json();
       
        setOrganization(data);
       
        setUser(data.user);
       
        

      } else {
        console.error('Failed to fetch organization data');
      }
    } catch (error) {
      console.error('Error fetching organization data:', error);
    }
  };
  

  useEffect(() => {
    fetchOrganizationData();
  }, []); // The empty dependency array ensures this effect runs once when the component mounts
  


  return (
    <div className='content' >
      <div className='heading'><h1>Organization Details</h1></div>
      {organization ? (
        <div className='container'>
          {/* Display the organization's logo */}
          <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_YT1HBTzGJutmrEriz9yUr0tRrXoeSzg74f7LHOh4qA&s' alt="Organization Logo" />
          {/* Display organization details */}
          <p ><b>ID: </b> {organization.id}</p>
          <p ><b>Name: </b> {organization.name}</p>
          <p ><b>Email:</b> {organization.email}</p>
          <p ><b>Phone Number:</b> {organization.phoneNumber}</p>
          <p ><b>Address: </b>{organization.address}</p>
          <p ><b>City:</b> {organization.city}</p>
          <p ><b>Postal Code:</b> {organization.postalCode}</p>
          <p><b>Country Code: </b>{organization.countryCode}</p>
          <p><b>State Code:</b> {organization.stateCode}</p>
          <h2>Users:</h2>
          {/* Display the list of organization users */}
          <ul>
            {user.map((user, index) => (
              <li key={user.id}>{user.profile.firstName+' '+user.profile.LastName}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading organization data...</p>
      )}
    </div>
  );
};

export default OrganizationPage;
