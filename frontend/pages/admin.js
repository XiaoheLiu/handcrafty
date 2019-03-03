import PleaseSignIn from '../components/PleaseSignIn';
import Permission from '../components/Permissions';

const admin = props => (
  <div>
    <PleaseSignIn>
      <Permission />
    </PleaseSignIn>
  </div>
);

export default admin;
