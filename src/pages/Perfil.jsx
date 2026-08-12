import { useContext, useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import ProfileContent from '../components/profile/ProfileContent';
import { UserContext } from '../context/UserContext';

const Perfil = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const { user } = useContext(UserContext);
  const { userId } = useParams();

  if (!user) return <Navigate to="/login" replace />;

  if (userId !== user._id) {
    return (
      <Container fluid className="bg-secondary p-4 min-vh-100">
        <Alert variant="warning">
          Este perfil no pertenece a la sesión actual.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="bg-secondary p-4 min-vh-100">
      <ProfileHeader />
      <div className="w-100 w-md-75 w-lg-50 mx-auto">
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <ProfileContent activeTab={activeTab} />
      </div>
    </Container>
  );
};

export default Perfil;
