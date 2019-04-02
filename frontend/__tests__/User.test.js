import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import User, { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  },
];

describe('<User/>', () => {
  it('carries information of logged in user', async () => {
    const ChildMock = ({ data: { me } }) =>
      me ? <p>{me.id}</p> : <p>Loading</p>;

    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <User>{ChildMock}</User>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toEqual(fakeUser().id);
  });
});
