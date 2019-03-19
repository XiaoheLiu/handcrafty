import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart) {
  return cart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
}

class CheckOut extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  onToken = async (res, createOrder) => {
    console.log(res.id);
    const order = await createOrder({
      variables: {
        token: res.id,
      },
    }).catch(err => {
      alert(err.message);
    });
    console.log(order);
  };

  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {createOrder => (
              <StripeCheckout
                name="Handcrafty Co."
                description={`Order of ${totalItems(me.cart)} items`}
                image={
                  me.cart.length && me.cart[0].item && me.cart[0].item.image
                }
                ComponentClass="div"
                panelLabel="Pay" // prepended to the amount in the bottom pay button
                amount={calcTotalPrice(me.cart)} // cents
                currency="CAD"
                stripeKey="pk_test_ZQiy8W7qTlbT3S1dxaRnkt6s00TBe7iMLX"
                email={me.email}
                shippingAddress={false}
                billingAddress
                zipCode={false}
                alipay // accept Alipay (default false)
                allowRememberMe
                token={res => this.onToken(res, createOrder)}
              >
                {this.props.children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

export default CheckOut;
