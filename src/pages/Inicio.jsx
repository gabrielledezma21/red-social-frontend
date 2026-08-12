import FormPost from '../components/FormPost';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Container } from 'react-bootstrap';
import HomeContent from '../components/home/HomeContent';

function Inicio() {
  //const [userComplete, setUserComplete] = useState(null);
  const { user } = useContext(UserContext);

  // useEffect(() => {
  //   const loadUserComplete = async () => {
  //     if (user?._id) {
  //       try {
  //         const userData = await getFunctions.getAUser(user._id);
  //         setUserComplete(userData);
  //       } catch (error) {
  //         console.error("Error loading user:", error);
  //       }
  //     }
  //   };

  //   loadUserComplete();
  // }, [user?._id]);

  return (
    <Container fluid className="bg-secondary p-4 min-vh-100">
      <div className="w-100 w-md-75 w-lg-50 mx-auto">
        {user && (
          <FormPost user={user} />
        )}
        <HomeContent />
      </div>
    </Container>
  );
}

export default Inicio;
