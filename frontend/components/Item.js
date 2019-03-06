import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteItem from './DeleteItem';
import User from './User';
import AddToCart from './AddToCart';

class Item extends Component {
  render() {
    const { item } = this.props;
    return (
      <ItemStyles>
        {item.image && <img src={item.image} alt={item.title} />}
        <Title>
          <Link
            href={{
              pathname: '/item',
              query: { id: item.id },
            }}
          >
            <a>{item.title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(item.price)}</PriceTag>
        <p>{item.description} </p>

        <User>
          {({ data: { me } }) =>
            me && (
              <div className="buttonList">
                <Link
                  href={{
                    pathname: 'update',
                    query: { id: item.id },
                  }}
                >
                  <a>Edit</a>
                </Link>
                <AddToCart id={item.id} />
                <DeleteItem id={item.id}>Delete</DeleteItem>
              </div>
            )
          }
        </User>
      </ItemStyles>
    );
  }
}

Item.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }),
};

export default Item;
