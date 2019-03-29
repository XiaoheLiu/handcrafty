import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import formatMoney from '../lib/formatMoney';
import ItemComponent from '../components/Item';

const fakeItem = {
  id: '12345',
  title: 'Test Item',
  price: 1230,
  description: 'Describe test item',
  image: 'testImage.jpg',
  largeImage: 'largeImage.jpg',
};

describe('<Item/>', () => {
  // Snapshot testing
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  // Shallow rendering test
  it('renders the image properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const img = wrapper.find('img');
    expect(img.props().src).toBe(fakeItem.image);
    expect(img.props().alt).toBe(fakeItem.title);
  });

  it('renders price tag and title properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const PriceTag = wrapper.find('PriceTag');
    expect(PriceTag.children().text()).toBe(formatMoney(fakeItem.price));
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });

  // Skipped because buttonList is rendered through render props within <User/>
  xit('renders out the buttons properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link').exists()).toBe(true);
    expect(buttonList.find('AddToCart')).toBeTruthy();
    expect(buttonList.find('AddToCart')).toHaveLength(1);
  });
});
