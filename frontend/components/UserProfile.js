import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const UserProfile = () => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <Error error={error} />;
      const { me } = data;
      return (
        <div>
          <h1>{me.name}'s Profile</h1>
          <p>Email: {me.email}</p>
          <p>User ID: {me.id}</p>
        </div>
      );
    }}
  </Query>
);

export default UserProfile;
