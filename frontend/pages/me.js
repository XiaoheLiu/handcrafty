import PleaseSignIn from '../components/PleaseSignIn';
import UserProfile from '../components/UserProfile';

const admin = props => (
  <div>
    <PleaseSignIn>
      <UserProfile />
    </PleaseSignIn>
  </div>
);

export default admin;
