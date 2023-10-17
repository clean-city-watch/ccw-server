import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


import { Typography, Card, CardContent, CardMedia, Button } from '@mui/material';

const Complaint = () => {
  const { id } = useParams();
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [selected, setSelected] = useState<boolean>(false);
  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/post/${id}`);
        const data = await response.json();
        setComplaintDetails(data);
      } catch (error) {
        console.error('Error fetching complaint details:', error);
      }
    };

    fetchComplaintDetails();
  }, [id]);

  
  const handleMarkAsSelected = async () => {
    try {
      // Make an API call to mark the issue as selected
      const response = await fetch(`http://your-api-endpoint/markAsSelected/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if required
        },
        // You can pass any payload if needed
        body: JSON.stringify({
          selected: true,
        }),
      });

      if (response.ok) {
        // Update the local state to reflect the selection
        setSelected(true);
      } else {
        console.error('Failed to mark the issue as selected.');
      }
    } catch (error) {
      console.error('Error marking the issue as selected:', error);
    }
  };
  
  return (
    <div style={{ textAlign: 'center', padding:'20px',paddingTop:'1em'}}>
      {complaintDetails ? (
        <Card style={{ paddingBottom:"20em",paddingTop:"80px"}}>
          <CardMedia
            component="img"
            alt="Complaint Image"
            height="140"
            image={complaintDetails.imageUrl}
          />
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {complaintDetails.title}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {complaintDetails.city}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {complaintDetails.content}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Status: {complaintDetails.status?.name}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Upvotes: {complaintDetails._count.upvotes}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Comments: {complaintDetails._count.comments}
            </Typography>
            <div style={{ position: 'absolute', top: '50px', right: '70px'}} >
              <Button variant="contained" color="primary" onClick={handleMarkAsSelected}>
                Mark as Selected
              </Button>
              </div>
            <div style={{ position: 'absolute', top: '50px', left: '70px'}} >  
            <Button variant="contained" color="primary">
              Back to Dashboard
            </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6">Loading...</Typography>
      )}
    </div>
  );
};

export default Complaint;
function setSelected(arg0: boolean) {
  throw new Error('Function not implemented.');
}

