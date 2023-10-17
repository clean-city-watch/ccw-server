// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Complaint from '../pages/complaint/complaint';
import Complaintinfo from '../pages/complaint/complaint';
import AdminDashboard from '../pages/dashboard/dashboard';
import MapWithCustomMarker from '../pages/mapLeaflet/mapLeaflet';
import MapComponent from '../pages/mapLeaflet/mapLeaflet';
import OrganizationPage from '../pages/organization/organization';
import PostPage from '../pages/post/PostPage';
import styles from './app.module.css';
import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  return (
    <div>
      

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      
     
      <Routes>
      <Route path={'/'} element={<AdminDashboard />} />
      <Route path="/complaint/:id" element={<Complaint />} />
      <Route path={'/mapLeaflet'} element={<MapWithCustomMarker />}/>
      <Route path={'/organization'} element={<OrganizationPage />}/>
        
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
