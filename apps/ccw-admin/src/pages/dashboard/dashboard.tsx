import React, { useState, useEffect } from 'react';
import { Grid, Button, Tabs, Tab, Badge, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import RoomIcon from '@mui/icons-material/Room';
import IconButton from '@mui/material/IconButton';

const ComplaintTable = ({ complaints }) => {
  return (
    <div style={{ overflowY: 'scroll', height: 'calc(100vh - 200px)' }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>City</th>
            <th>Title</th>
            <th>Status</th>
            <th>ID</th>
            <th>Content</th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint:any) => (
            <tr key={complaint.id}>
              <td>{complaint.city}</td>
              <td>{complaint.title}</td>
              <td>{complaint.status?.name}</td>
              <td>{complaint.id}</td>
              <td>{complaint.content}</td>
              <td>
                {/* Use Link to navigate to complaint details page */}
                <Link to={`/complaint/${complaint.id}`}>
                  <Button variant="outlined" color="primary" sx={{ filter: 'blur(0.8)' }}>
                    View More
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminDashboard = () => {
  // const [tabValue, setTabValue] = useState(0);
  const [complaints, setComplaints] = useState([]);
  // const [complaintCounts, setComplaintCounts] = useState(null);
  const [complaintCounts, setComplaintCounts] = useState([{
    "id": 1,
    "name": "Open",
    "_count": {
      "posts": 0
    }
  },
  {
    "id": 2,
    "name": "In Progress",
    "_count": {
      "posts": 0
    }
  },
  {
    "id": 3,
    "name": "In Review",
    "_count": {
      "posts": 0
    }
  },
  {
    "id": 4,
    "name": "Resolved",
    "_count": {
      "posts": 0
    }
  },
  {
    "id": 5,
    "name": "Reopened",
    "_count": {
      "posts": 0
    }
  },
  {
    "id": 6,
    "name": "On Hold",
    "_count": {
      "posts": 0
    }
  },
  {
    "id": 7,
    "name": "Invalid",
    "_count": {
      "posts": 0
    }
  },
  {
    "id": 8,
    "name": "Blocked",
    "_count": {
      "posts": 0
    }
  }]);
  

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsResponse, countsResponse] = await Promise.all([
          fetch('http://localhost:3000/api/post'),
          fetch('http://localhost:3000/api/post/status/count'),
        ]);

       
        const complaintsData = await complaintsResponse.json();
        setComplaints(complaintsData);
        console.log(complaintsData)
   
        const data  = await countsResponse.json();

        setComplaintCounts(data);
        console.log('data saved for count');
        console.log(complaintCounts);



      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  

  
  const handleViewMore = (complaintId:any) => {
    // Replace '/complaints' with the actual route for complaint details
    navigate(`/complaint/${complaintId}`);
  };

  

  function handleChangeTab(arg0: null, arg1: number): void {

    console.log(complaintCounts);
  }

  return (
    <div style={{ textAlign: 'center',height:'25px', paddingTop: '1px',backgroundColor: '#00a5a5' }}>
      {/* Top Half: Status Tabs */}
      <Grid container spacing={2} style={{ background: '#00a5a5', padding: '10px' }}>
      <Grid item xs={3}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => handleChangeTab(null, 3)}
            sx={{ marginBottom: '10px' }}
          >
            <Badge badgeContent={complaintCounts[0]['_count']['posts']} color="error">
              Open
            </Badge>
          </Button>
        </Grid> 
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => handleChangeTab(null, 1)}
            sx={{ marginBottom: '10px' }}
          >
            <Badge badgeContent={complaintCounts[1]['_count']['posts']} color="error">
              In Progress
            </Badge>
          </Button>
        </Grid>
        
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => handleChangeTab(null, 4)}
            sx={{ marginBottom: '10px' }}
          >
            <Badge badgeContent={complaintCounts[2]['_count']['posts']}color="error">
              Review
            </Badge>
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => handleChangeTab(null, 5)}
            sx={{ marginBottom: '10px' }}
          >
            <Badge badgeContent={complaintCounts[3]['_count']['posts']}color="error">
              Resolved
            </Badge>
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => handleChangeTab(null, 6)}
            sx={{ marginBottom: '10px' }}
          >
            <Badge badgeContent={complaintCounts[4]['_count']['posts']} color="error">
              Reopened
            </Badge>
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => handleChangeTab(null, 7)}
            sx={{ marginBottom: '10px' }}
          >
            <Badge badgeContent={complaintCounts[5]['_count']['posts']} color="error">
              On Hold
            </Badge>
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => handleChangeTab(null, 8)}
            sx={{ marginBottom: '10px' }}
          >
            <Badge badgeContent={complaintCounts[6]['_count']['posts']} color="error">
              Invalid
            </Badge>
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => handleChangeTab(null, 9)}
            sx={{ marginBottom: '10px' }}
          >
            <Badge badgeContent={complaintCounts[7]['_count']['posts']} color="error">
              Blocked
            </Badge>
          </Button>
        </Grid>
      </Grid>

      
      <div style={{ textAlign: 'center', paddingTop: '20px', backgroundColor: 'white' }}>


      <ComplaintTable complaints={complaints} />
      </div>

      {/* Logo Section */}
      {/* <div style={{ marginTop: '20px' }}>
        <img src={LogoImage} alt="Logo" style={{ width: '200px', height: 'auto' }} />
      </div> */}
      


      {/* Bottom Right Corner: Map Button */}
      <div style={{ position: 'absolute', bottom: '40px', right: '60px', zIndex: 1 }}>
        <IconButton
          style={{
            borderRadius: '15%', // Circular shape
            backgroundColor: '#00a5a5', // iOS Maps button color
            padding: '15px', // Adjust the padding for your preferred size
            boxShadow: '0px 4px 8px rgba(1, 1, 1, 1.1)', // Shadow
            position: 'relative',
          }}

          onClick={() => {
            // Replace '/map' with the actual route or template URL you want to render
            navigate('/mapLeaflet');
          }}
        >
          Map
        </IconButton>
      </div>
      <div style={{ position: 'absolute', bottom: '40px', left: '60px', zIndex: 1 }}>
      <IconButton
          style={{
            borderRadius: '15%', // Circular shape
            backgroundColor: '#00a5a5', // iOS Maps button color
            padding: '15px', // Adjust the padding for your preferred size
            boxShadow: '0px 4px 8px rgba(1, 1, 1, 1.1)', // Shadow
            position: 'relative',
          }}
          onClick={() => {
            navigate('/organization');
          }}
        >
          Organizations
        </IconButton>
      </div>

    </div>
    
  );
};

export default AdminDashboard;



