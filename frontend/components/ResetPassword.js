import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_PASSWORD = gql`
  mutation RESET_PASSWORD(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

class RequestReset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  };

  state = {
    confirmPassword: '',
    password: '',
  };

  saveToState = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <Mutation
        mutation={RESET_PASSWORD}
        variables={{ resetToken: this.props.resetToken, ...this.state }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetPassword, { error, loading, called }) => {
          return (
            <Form
              method="post"
              onSubmit={e => {
                e.preventDefault();
                resetPassword();
                this.setState({ password: '', confirmPassword: '' });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset Your Password</h2>
                <Error error={error} />
                <label htmlFor="password">
                  New Password
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>

                <label htmlFor="confirmPassword">
                  Confirm Password
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={this.state.confirmPassword}
                    onChange={this.saveToState}
                  />
                </label>
              </fieldset>
              <button type="submit">Reset Password</button>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
